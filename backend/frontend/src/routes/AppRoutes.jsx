import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import Settings from "../pages/Settings";
import AdminLayout from "../layouts/AdminLayout";
import Ticket from "../pages/Ticket/Ticket";
import TicketManage from "../pages/Ticket/TicketManage";
import AddTicket from "../pages/Ticket/TicketAdd";
import TicketView from "../pages/Ticket/TicketView";
import IssuesDepartment from "../pages/IssuesDepartment/IssuesDepartment";
import IssuesDepartmentAdd from "../pages/IssuesDepartment/IssuesDepartmentAdd";
import IssuesDepartmentView from "../pages/IssuesDepartment/IssuesDepartmentView";

import IssuesMaster from "../pages/IssuesMaster/IssuesMaster";
import IssuesMasterAdd from "../pages/IssuesMaster/IssuesMasterAdd";
import IssuesMasterView from "../pages/IssuesMaster/IssuesMasterView";

import IssuesCategory from "../pages/IssuesCategory/IssuesCategory";
import IssuesCategoryAdd from "../pages/IssuesCategory/IssuesCategoryAdd";
import IssuesCategoryView from "../pages/IssuesCategory/IssuesCategoryView";
// import IssuesMasterEdit from "../pages/IssuesMaster/IssuesMasterEdit";
export default function AppRoutes({ setLoading }) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<AdminLayout setLoading={setLoading} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/ticket" element={<Ticket />} />
                    <Route path="/ticket/manage" element={<TicketManage />} />
                    <Route path="/ticket/add" element={<AddTicket />} />
                    <Route path="/ticket/view/:id" element={<TicketView />} />

                    <Route path="/issues-department" element={<IssuesDepartment />} />
                    <Route path="/issues-department/add" element={<IssuesDepartmentAdd />} />
                    <Route path="/issues-department/view/:id" element={<IssuesDepartmentView />} />

                     <Route path="/issues-master" element={<IssuesMaster />} />
                    <Route path="/issues-master/add" element={<IssuesMasterAdd />} />
                    <Route path="/issues-master/view/:id" element={<IssuesMasterView />} />

                     <Route path="/issues-category" element={<IssuesCategory />} />
                    <Route path="/issues-category/add" element={<IssuesCategoryAdd />} />
                    <Route path="/issues-category/view/:id" element={<IssuesCategoryView />} />



                </Route>
            </Routes>
        </BrowserRouter>
    );
}
