<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckToken {
    /**
    * Handle an incoming request.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \Closure( \Illuminate\Http\Request ): ( \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse )  $next
    * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
    */

    public function handle( Request $request, Closure $next ) {
        $token = $request->bearerToken();

        if ( !$token ) {
            return response()->json( [ 'status' => false, 'message' => 'Token required' ], 401 );
        }

        $hashed = hash( 'sha256', $token );
        $session = DB::table( 'user_tokens' )
        ->where( 'token', $hashed )
        ->where( 'expires_at', '>', now() )
        ->first();

        if ( !$session ) {
            return response()->json( [ 'status' => false, 'message' => 'Invalid token' ], 401 );
        }

        if ( $session->expires_at && now()->gt( $session->expires_at ) ) {
            return response()->json( [ 'status' => false, 'message' => 'Token expired' ], 401 );
        }

        // Add user to request
        $request->merge( [ 'auth_user_id' => $session->user_id ] );

        return $next( $request );
    }
}
