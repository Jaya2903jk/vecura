
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/Navbar";
import Footer from "../components/Footer";
import Themechanger from "../components/Themechanger";

const AdminLayout = ({ setLoading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        setLoading(false);
    }, [location]);

    return (
        <div className="wrapper">
            <Sidebar setLoading={setLoading} />

            <div className="main-panel">
                <MainHeader />

                <div className="container">
                    <Outlet />
                </div>

                <Footer />
            </div>

            <Themechanger />
        </div>
    );
};

export default AdminLayout;
