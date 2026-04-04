
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


            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                <ul class="breadcrumbs mb-3">
                    <li class="nav-home">
                        <a href="#">
                            <i class="icon-home"></i>
                        </a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/ticket");
                            }}
                            className="nav-link"
                        >
                            Ticket
                        </a>
                    </li>

                </ul>

            </div>

            <div class="row">

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-warning">
                                <i class="fa fa-clock"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Pending Tickets</div>
                        </div>
                    </div>
                </div>


                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-info">
                                <i class="fa fa-check"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Accepted Tickets</div>
                        </div>
                    </div>
                </div>


                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-primary">
                                <i class="fa fa-thumbs-up"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Approved Tickets</div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-success">
                                <i class="fa fa-tools"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Fixed Tickets</div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-dark">
                                <i class="fa fa-flag-checkered"></i>
                            </div>
                            <div class="h1 m-0">24386</div>
                            <div class="text-muted mb-3">Completed Tickets</div>
                        </div>
                    </div>
                </div>


                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-danger">
                                <i class="fa fa-redo"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Reopened Tickets</div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-danger">
                                <i class="fa fa-exclamation-triangle"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Not Fixed In Time</div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-warning">
                                <i class="fa fa-hourglass-half"></i>
                            </div>
                            <div class="h1 m-0">0</div>
                            <div class="text-muted mb-3">Approval Pending</div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-sm-4 col-lg-2">
                    <div class="card">
                        <div class="card-body p-3 text-center">
                            <div class="text-end text-success">
                                <i class="fa fa-check-circle"></i>
                            </div>
                            <div class="h1 m-0">29943</div>
                            <div class="text-muted mb-3">Approved (Final)</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
