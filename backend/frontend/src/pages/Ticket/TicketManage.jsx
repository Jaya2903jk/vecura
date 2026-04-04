
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";

export default function TicketManage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        pending: 0,
        accepted: 0,
        approved: 0,
        completed: 0
    });
    const handleNavigate = (status, department = "") => {
        let url = `/ticket?status=${status}`;

        if (department) {
            url += `&department=${department}`;
        }

        navigate(url);
    };
    const departmentData = [
        { name: "IT Software", pending: 5, accepted: 3, completed: 12 },
        { name: "IT Systems", pending: 2, accepted: 4, completed: 10 },
        { name: "Facility", pending: 7, accepted: 1, completed: 8 },
        { name: "HR", pending: 1, accepted: 2, completed: 5 },
        { name: "Accounts", pending: 1, accepted: 2, completed: 5 },
        { name: "VSupport", pending: 1, accepted: 2, completed: 5 },
    ];
    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);

        fetch("http://127.0.0.1:8000/api/tickets", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    setTickets(data.data.data || []);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (tickets.length === 0) return;

        if ($.fn.DataTable.isDataTable('#multi-filter-select')) {
            $('#multi-filter-select').DataTable().destroy();
        }

        const table = $('#multi-filter-select').DataTable({
            pageLength: 10,
            destroy: true
        });

        return () => {
            table.destroy();
        };
    }, [tickets]);
    return (

        <div class="page-inner">
            <div className="page-header">
                <h3 className="fw-bold mb-3">Ticket</h3>

                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            <i className="icon-home"></i>
                        </span>
                    </li>

                    <li className="separator">
                        <i className="icon-arrow-right"></i>
                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/ticket")}
                        >
                            Ticket
                        </span>
                    </li>

                    <li className="separator">
                        <i className="icon-arrow-right"></i>
                    </li>

                    <li className="nav-item">
                        <span className="nav-link active">
                            Ticket Manage
                        </span>
                    </li>
                </ul>
            </div>

            <div class="row mb-3">
                <div class="col-md-12">
                    <div class="table-card">
                        <div class="premium-header">
                            Overall Ticket Summary
                        </div>

                        <div class="table-responsive">
                            <table class="table premium-table table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th class="text-center">Pending</th>
                                        <th class="text-center">Accepted</th>
                                        <th class="text-center">Completed</th>
                                        <th class="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departmentData.map((dep, index) => {
                                        const total = dep.pending + dep.accepted + dep.completed;

                                        return (
                                            <tr key={index}>
                                                <td>{dep.name}</td>

                                                <td className="text-center" >
                                                    <span
                                                        className="badge badge-warning"
                                                        style={{ cursor: "pointer", textAlign: "center" }} onClick={() => handleNavigate(1, dep.name)}
                                                    >
                                                        {dep.pending}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className="badge badge-info"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleNavigate(2, dep.name)}
                                                    >
                                                        {dep.accepted}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className="badge badge-success"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleNavigate(4, dep.name)}
                                                    >
                                                        {dep.completed}
                                                    </span>
                                                </td>

                                                <td
                                                    className="text-center fw-bold total-text"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleNavigate("", dep.name)}
                                                >
                                                    {total}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot class="">
                                    <tr class="grand-total ">
                                        <td>Grand Total</td>
                                        <td class="text-center">15</td>
                                        <td class="text-center">10</td>
                                        <td class="text-center">35</td>
                                        <td class="text-center">60</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">

                <div class="col-md-6">
                    <div class="table-card">
                        <div class="premium-header">
                            Ticket Raised By TEST
                        </div>

                        <div class="table-responsive">
                            <table class="table premium-table table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th class="text-center">Pending</th>
                                        <th class="text-center">Accepted</th>
                                        <th class="text-center">Completed</th>
                                        <th class="text-center">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>IT Software</td>
                                        <td class="text-center"><span class="badge badge-warning">5</span></td>
                                        <td class="text-center"><span class="badge badge-info">3</span></td>
                                        <td class="text-center"><span class="badge badge-success">12</span></td>
                                        <td class="text-center fw-bold total-text">20</td>
                                    </tr>

                                    <tr>
                                        <td>IT Systems</td>
                                        <td class="text-center"><span class="badge badge-warning">2</span></td>
                                        <td class="text-center"><span class="badge badge-info">4</span></td>
                                        <td class="text-center"><span class="badge badge-success">10</span></td>
                                        <td class="text-center fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>Facility</td>
                                        <td class="text-center"><span class="badge badge-warning">7</span></td>
                                        <td class="text-center"><span class="badge badge-info">1</span></td>
                                        <td class="text-center"><span class="badge badge-success">8</span></td>
                                        <td class="text-center fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>HR</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                    <tr>
                                        <td>Accounts</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                    <tr>
                                        <td>VSupport</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="grand-total">
                                        <td>Grand Total</td>
                                        <td class="text-center">15</td>
                                        <td class="text-center">10</td>
                                        <td class="text-center">35</td>
                                        <td class="text-center">60</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="table-card">
                        <div class="premium-header">
                            Ticket Assigned to TEST
                        </div>

                        <div class="table-responsive">
                            <table class="table premium-table table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th class="text-center">Pending</th>
                                        <th class="text-center">Accepted</th>
                                        <th class="text-center">Completed</th>
                                        <th class="text-center">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>IT Software</td>
                                        <td class="text-center"><span class="badge badge-warning">5</span></td>
                                        <td class="text-center"><span class="badge badge-info">3</span></td>
                                        <td class="text-center"><span class="badge badge-success">12</span></td>
                                        <td class="text-center fw-bold total-text">20</td>
                                    </tr>

                                    <tr>
                                        <td>IT Systems</td>
                                        <td class="text-center"><span class="badge badge-warning">2</span></td>
                                        <td class="text-center"><span class="badge badge-info">4</span></td>
                                        <td class="text-center"><span class="badge badge-success">10</span></td>
                                        <td class="text-center fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>Facility</td>
                                        <td class="text-center"><span class="badge badge-warning">7</span></td>
                                        <td class="text-center"><span class="badge badge-info">1</span></td>
                                        <td class="text-center"><span class="badge badge-success">8</span></td>
                                        <td class="text-center fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>HR</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                    <tr>
                                        <td>Accounts</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                    <tr>
                                        <td>VSupport</td>
                                        <td class="text-center"><span class="badge badge-warning">1</span></td>
                                        <td class="text-center"><span class="badge badge-info">2</span></td>
                                        <td class="text-center"><span class="badge badge-success">5</span></td>
                                        <td class="text-center fw-bold total-text">8</td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="grand-total">
                                        <td>Grand Total</td>
                                        <td class="text-center">15</td>
                                        <td class="text-center">10</td>
                                        <td class="text-center">35</td>
                                        <td class="text-center">60</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}
