
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mapMenuItemRoute } from "../utils/routeMapper";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setLoading }) => {
    const [menuData, setMenuData] = useState({
        menus: [],
        submenus: [],
        items: [],
    });
    const navigate = useNavigate();
    const getMenuIcon = (menuName = "") => {
        const name = menuName.toLowerCase().trim();

        if (name.includes("dashboard")) return "bi bi-speedometer2";
        if (name.includes("admin")) return "bi bi-shield-lock";
        if (name.includes("master")) return "bi bi-database";
        if (name.includes("customer")) return "bi bi-people";
        if (name.includes("appointment")) return "bi bi-calendar2-check";
        if (name.includes("purchase")) return "bi bi-cart-check";
        if (name.includes("inventory")) return "bi bi-box-seam";
        if (name.includes("audit")) return "bi bi-search";
        if (name.includes("report")) return "bi bi-bar-chart-line";
        if (name.includes("gst")) return "bi bi-receipt";
        if (name.includes("settings")) return "bi bi-gear";

        return "bi bi-folder";
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("http://127.0.0.1:8000/api/user-menu", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.status) {
                    setMenuData(data);
                }
            } catch (error) {
                console.error("Failed to fetch menu", error);
            }
        };

        fetchMenu();
    }, []);

    // Group submenus by MenuCode
    const submenusByMenu = (menuData.submenus || []).reduce((acc, submenu) => {
        const key = submenu.MenuCode.trim();
        if (!acc[key]) acc[key] = [];
        acc[key].push(submenu);
        return acc;
    }, {});

    // Group items by SubMenuCode
    const itemsBySubmenu = (menuData.items || []).reduce((acc, item) => {
        const key = item.SubMenuCode.trim();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div className="sidebar" data-background-color="dark">

            {/* LOGO */}
            <div className="sidebar-logo">
                <div className="logo-header" data-background-color="dark">
                    <a href="/" className="logo">
                        <img
                            src="/assets/img/kaiadmin/logo_light.svg"
                            alt="logo"
                            className="navbar-brand"
                            height="20"
                        />
                    </a>

                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar">
                            <i className="gg-menu-right"></i>
                        </button>
                        <button className="btn btn-toggle sidenav-toggler">
                            <i className="gg-menu-left"></i>
                        </button>
                    </div>

                    <button className="topbar-toggler more">
                        <i className="gg-more-vertical-alt"></i>
                    </button>
                </div>
            </div>

            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">

                    <ul className="nav nav-secondary">

                        <li className="nav-item active">
                            <Link to="/dashboard">
                                <i className="bi bi-speedometer2"></i>
                                <p>Dashboard</p>
                            </Link>
                        </li>

                        {menuData.menus.map((menu) => (
                            <li key={menu.MenuCode} className="nav-item">

                                <a
                                    data-bs-toggle="collapse"
                                    href={`#${menu.MenuCode.trim()}`}
                                >
                                    <i className={getMenuIcon(menu.MenuName)}></i>
                                    <p>{menu.MenuName}</p>
                                    <span className="caret"></span>
                                </a>

                                <div className="collapse" id={menu.MenuCode.trim()}>
                                    <ul className="nav nav-collapse">
                                        {submenusByMenu[menu.MenuCode.trim()]?.map((submenu) => {
                                            const submenuCode = submenu.SubMenuCode.trim();
                                            const hasItems = itemsBySubmenu[submenuCode]?.length > 0;

                                            return (
                                                <li key={submenu.SubMenuCode}>

                                                    <a
                                                        data-bs-toggle="collapse"
                                                        href={`#${submenuCode}`}
                                                        onClick={(e) => {
                                                            if (!hasItems || submenu.SubMenuName.toLowerCase().includes("ticket")) {
                                                                e.preventDefault(); // stop collapse
                                                                // navigate(mapMenuItemRoute(submenu.SubMenuName));
                                                                setLoading(true);

                                                                setTimeout(() => {
                                                                    navigate(mapMenuItemRoute(submenu.SubMenuName));
                                                                }, 1000);
                                                            }
                                                        }}
                                                    >
                                                        <span className="sub-item">
                                                            {submenu.SubMenuName}
                                                        </span>
                                                        <span className="caret"></span>
                                                    </a>
                                                    {hasItems && (
                                                        <div className="collapse" id={submenuCode}>
                                                            <ul className="nav nav-collapse">

                                                                {itemsBySubmenu[submenuCode]?.map((item) => (
                                                                    <li key={item.MenuItemCode}>
                                                                        <Link
                                                                            to={mapMenuItemRoute(item.MenuItemPage)}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setLoading(true);

                                                                                navigate(mapMenuItemRoute(item.MenuItemPage));
                                                                            }}
                                                                        >
                                                                            <span className="sub-item">
                                                                                {item.MenuItemName}
                                                                            </span>
                                                                        </Link>
                                                                    </li>
                                                                ))}

                                                            </ul>
                                                        </div>
                                                    )}

                                                </li>
                                            );
                                        })}
                                    </ul>

                                </div>

                            </li>
                        ))}
                        {/* <li className="nav-item active">
                            <Link to="/issues-department">
                                <i className="bi bi-database"></i>
                                <p>Issues Department</p>
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link to="/issues-master">
                                <i className="bi bi-database"></i>
                                <p>Issues Master</p>
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link to="/issues-category">
                                <i className="bi bi-database"></i>
                                <p>Issues Category</p>
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <a
                                data-bs-toggle="collapse"
                                href="#issuesMenu"
                                className="collapsed"
                            >
                                <i className="bi bi-database"></i>
                                <p>Issues</p>
                                <span className="caret"></span>
                            </a>

                            <div className="collapse" id="issuesMenu">
                                <ul className="nav nav-collapse">

                                    <li>
                                        <Link to="/issues-department">
                                            <span className="sub-item">Issues Department</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/issues-master">
                                            <span className="sub-item">Issues Master</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/issues-category">
                                            <span className="sub-item">Issues Category</span>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </li>
                    </ul>


                </div>
            </div>

        </div>
    );
};

export default Sidebar;
