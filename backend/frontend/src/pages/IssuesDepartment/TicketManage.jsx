
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
                                        <th class="text-end">Pending</th>
                                        <th class="text-end">Accepted</th>
                                        <th class="text-end">Completed</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>IT Software</td>
                                        <td class="text-end"><span class="badge badge-warning">5</span></td>
                                        <td class="text-end"><span class="badge badge-info">3</span></td>
                                        <td class="text-end"><span class="badge badge-success">12</span></td>
                                        <td class="text-end fw-bold total-text">20</td>
                                    </tr>

                                    <tr>
                                        <td>IT Systems</td>
                                        <td class="text-end"><span class="badge badge-warning">2</span></td>
                                        <td class="text-end"><span class="badge badge-info">4</span></td>
                                        <td class="text-end"><span class="badge badge-success">10</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>Facility</td>
                                        <td class="text-end"><span class="badge badge-warning">7</span></td>
                                        <td class="text-end"><span class="badge badge-info">1</span></td>
                                        <td class="text-end"><span class="badge badge-success">8</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>HR</td>
                                        <td class="text-end"><span class="badge badge-warning">1</span></td>
                                        <td class="text-end"><span class="badge badge-info">2</span></td>
                                        <td class="text-end"><span class="badge badge-success">5</span></td>
                                        <td class="text-end fw-bold total-text">8</td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="grand-total">
                                        <td>Grand Total</td>
                                        <td class="text-end">15</td>
                                        <td class="text-end">10</td>
                                        <td class="text-end">35</td>
                                        <td class="text-end">60</td>
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
                                        <th class="text-end">Pending</th>
                                        <th class="text-end">Accepted</th>
                                        <th class="text-end">Completed</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>IT Software</td>
                                        <td class="text-end"><span class="badge badge-warning">5</span></td>
                                        <td class="text-end"><span class="badge badge-info">3</span></td>
                                        <td class="text-end"><span class="badge badge-success">12</span></td>
                                        <td class="text-end fw-bold total-text">20</td>
                                    </tr>

                                    <tr>
                                        <td>IT Systems</td>
                                        <td class="text-end"><span class="badge badge-warning">2</span></td>
                                        <td class="text-end"><span class="badge badge-info">4</span></td>
                                        <td class="text-end"><span class="badge badge-success">10</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>Facility</td>
                                        <td class="text-end"><span class="badge badge-warning">7</span></td>
                                        <td class="text-end"><span class="badge badge-info">1</span></td>
                                        <td class="text-end"><span class="badge badge-success">8</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>HR</td>
                                        <td class="text-end"><span class="badge badge-warning">1</span></td>
                                        <td class="text-end"><span class="badge badge-info">2</span></td>
                                        <td class="text-end"><span class="badge badge-success">5</span></td>
                                        <td class="text-end fw-bold total-text">8</td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="grand-total">
                                        <td>Grand Total</td>
                                        <td class="text-end">15</td>
                                        <td class="text-end">10</td>
                                        <td class="text-end">35</td>
                                        <td class="text-end">60</td>
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
                                        <th class="text-end">Pending</th>
                                        <th class="text-end">Accepted</th>
                                        <th class="text-end">Completed</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>IT Software</td>
                                        <td class="text-end"><span class="badge badge-warning">5</span></td>
                                        <td class="text-end"><span class="badge badge-info">3</span></td>
                                        <td class="text-end"><span class="badge badge-success">12</span></td>
                                        <td class="text-end fw-bold total-text">20</td>
                                    </tr>

                                    <tr>
                                        <td>IT Systems</td>
                                        <td class="text-end"><span class="badge badge-warning">2</span></td>
                                        <td class="text-end"><span class="badge badge-info">4</span></td>
                                        <td class="text-end"><span class="badge badge-success">10</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>Facility</td>
                                        <td class="text-end"><span class="badge badge-warning">7</span></td>
                                        <td class="text-end"><span class="badge badge-info">1</span></td>
                                        <td class="text-end"><span class="badge badge-success">8</span></td>
                                        <td class="text-end fw-bold total-text">16</td>
                                    </tr>

                                    <tr>
                                        <td>HR</td>
                                        <td class="text-end"><span class="badge badge-warning">1</span></td>
                                        <td class="text-end"><span class="badge badge-info">2</span></td>
                                        <td class="text-end"><span class="badge badge-success">5</span></td>
                                        <td class="text-end fw-bold total-text">8</td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="grand-total">
                                        <td>Grand Total</td>
                                        <td class="text-end">15</td>
                                        <td class="text-end">10</td>
                                        <td class="text-end">35</td>
                                        <td class="text-end">60</td>
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
