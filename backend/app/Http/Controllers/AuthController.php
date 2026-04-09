<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserMaster;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        // $user = User::where(function ($q) use ($request) {
        //     $q->where('UserID', $request->login)
        //         ->orWhere('UserCode', $request->login);
        // })->first();
            $user = UserMaster::with('userGroup') // eager load group
        ->where(function ($q) use ($request) {
            $q->where('UserID', $request->login)
              ->orWhere('UserCode', $request->login);
        })->first();


        if (
            !$user ||
            //  $user->UserActive !== 'Yes' ||
            trim($user->Password) !== trim($request->password)
        ) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials or inactive user',
            ], 401);
        }

        // Generate custom token
        $token = bin2hex(random_bytes(40));
        $hashedToken = hash('sha256', $token);

        DB::table('user_tokens')->insert([
            'user_id' => $user->UserID,
            'token' => $hashedToken,
            'created_at' => now(),
            'expires_at' => now()->addHours(8),
        ]);

        return response()->json([
            'status' => true,
            'token' => $token,
            'user' => [
                'id' => $user->UserID,
                'code' => $user->UserCode,
                'name' => $user->FullName ?? $user->UserName,
                'roleId' => $user->userGroup->UserGroupID,
                // 'roleId' => $user->UserGroupCode,
                 'roleName' => $user->userGroup->UserGroupName ?? null
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        $hashed = hash('sha256', $token);

        DB::table('user_tokens')->where('token', $hashed)->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $userId = $request->auth_user_id;
        $user = User::find($userId);

        return response()->json([
            'status' => true,
            'user' => $user,
        ]);
    }

    public function getUserMenu(Request $request)
    {
        $userId = $request->auth_user_id;
        $user = User::find($userId);
        $userCode = $user->UserCode;

        $menus = DB::connection('sqlsrv')
            ->table('MenuUser as mu')
            ->join('MenuMaster as m', 'mu.MenuCode', '=', 'm.MenuCode')
            ->where('mu.UserCode', $userCode)
            ->where('m.MenuShow', 'Yes')
            ->select('m.MenuCode', 'm.MenuName', 'm.MenuPriority')
            ->orderBy('m.MenuPriority')
            ->get();

        $submenus = DB::connection('sqlsrv')
            ->table('SubMenuUser as smu')
            ->join('SubMenuMaster as sm', 'smu.SubMenuCode', '=', 'sm.SubMenuCode')
            ->where('smu.UserCode', $userCode)
            ->where('sm.SubMenuShow', 'Yes')
            ->select('sm.SubMenuCode', 'sm.MenuCode', 'sm.SubMenuName', 'sm.SubMenuPeriority')
            ->get();

        $items = DB::connection('sqlsrv')
            ->table('MenuItemUser as miu')
            ->join('MenuItems as mi', 'miu.MenuItemCode', '=', 'mi.MenuItemCode')
            ->where('miu.UserCode', $userCode)
            ->where('mi.MenuActive', 'Yes')
            ->select(
                'mi.MenuItemCode',
                'mi.MenuItemName',
                'mi.MenuItemPage',
                'mi.SubMenuCode',
                'miu.addAccess',
                'miu.editAccess',
                'miu.deleteAccess',
                'miu.viewAccess'
            )
            ->get();

        return response()->json([
            'status' => true,
            'menus' => $menus,
            'submenus' => $submenus,
            'items' => $items,
        ]);
    }
}
