import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TicketDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // ticket id from route

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketStatus, setTicketStatus] = useState("");
    const activityLog = [
        { time: "2026-04-02 10:30 AM", action: "Ticket created", user: "John Doe", type: "created" },
        { time: "2026-04-02 10:35 AM", action: "Ticket assigned to Jane Smith", user: "System", type: "assigned" }
    ];
    const getStatusBadge = (status) => {
        switch (status) {
            case "1":
                return <span className="badge bg-warning text-dark">Pending</span>;
            case "2":
                return <span className="badge bg-info">Accepted</span>;
            case "3":
                return <span className="badge bg-success">Approved</span>;
            case "4":
                return <span className="badge bg-primary">Completed</span>;
            case "5":
                return <span className="badge bg-danger">Rejected</span>;
            default:
                return status;
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");

        // setLoading(true);

        fetch(`http://127.0.0.1:8000/api/tickets/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setTicket(data.data);
                    setTicketStatus(data.data.Status); // bind status from API
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAction = (action) => {
        console.log(`Action: ${action} for ticket ${ticket?.ticketId}`);

        if (action === "accept") setTicketStatus("2");
        if (action === "approve") setTicketStatus("3");
        if (action === "reject") setTicketStatus("5");
        if (action === "complete") setTicketStatus("4");
    };

    const getPriorityBadge = (priority) => {
        switch ((priority || "").toLowerCase()) {
            case "high":
                return <span className="badge bg-danger">High</span>;
            case "medium":
                return <span className="badge bg-warning text-dark">Medium</span>;
            case "low":
                return <span className="badge bg-success">Low</span>;
            default:
                return priority;
        }
    };

    if (loading) {
        return <div className="p-5">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="p-5 text-danger">Ticket not found</div>;
    }

    return (
        <div className="page-inner">

            <div class="page-header">
                <h3 class="fw-bold mb-3">Ticket</h3>
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
                        <a href="#">Ticket</a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>
                    <li class="nav-item">
                        <a href="#">Ticket View</a>
                    </li>
                </ul>
            </div>


            <div className="row">

                {/* LEFT SIDE */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="card-title">Ticket Information</div>
                            {/* <span className="badge bg-warning">
                                {ticket.ApprovedStatus || "Open"}
                            </span> */}
                        </div>

                        <div className="card-body">

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Ticket ID:</strong> {ticket.ticketId}
                                </div>
                                <div className="col-md-6">
                                    <strong>Priority:</strong>{" "}
                                    {getPriorityBadge(ticket.Priority)}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Department:</strong> {ticket.Department}
                                </div>
                                <div className="col-md-6">
                                    <strong>Branch:</strong> {ticket.Branch}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Customer Code:</strong> {ticket.CustomerCode}
                                </div>

                                <div className="col-md-6">
                                    <strong>Ticket Code:</strong> {ticket.TicketCode}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Status:</strong>{" "}
                                    {getStatusBadge(ticketStatus)}
                                </div>
                            </div>
                            {/* <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Approved By:</strong> {ticket.ApprovedBy}
                                </div>

                                <div className="col-md-6">
                                    <strong>Accepted By:</strong> {ticket.AcceptedBy}
                                </div>
                            </div> */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Created By:</strong> {ticket.CreatedBy}
                                </div>
                                <div className="col-md-6">
                                    <strong>Accepted By:</strong> {ticket.AcceptedBy}
                                </div>
                            </div>

                            <hr />

                            <div className="mb-3">
                                <strong>Subject:</strong>
                                <h5>{ticket.Subject}</h5>
                            </div>

                            <div>
                                <strong>Description:</strong>
                                <p>{ticket.Brief || "No description available"}</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-info text-white py-3">
                            <h5 className="mb-0 fw-semibold"> Ticket Actions</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h6 className="fw-bold text-muted mb-3">Available Actions</h6>

                                <div className="d-grid gap-2">

                                    {/* {ticketStatus === "1" && (
                                        <> */}
                                    <button
                                        className="btn btn-outline-primary fw-semibold"
                                        onClick={() => handleAction("accept")}
                                    >
                                        Assigned to Me
                                    </button>

                                    <button
                                        className="btn bg-success fw-semibold"
                                        onClick={() => handleAction("approve")}
                                    >
                                        Approve Ticket
                                    </button>

                                    <button
                                        className="btn btn-outline-danger fw-semibold"
                                        onClick={() => handleAction("reject")}
                                    >
                                        Escalte Ticket </button>
                                    {/* </>
                                    )} */}

                                    {ticketStatus === "2" && (
                                        <button
                                            className="btn btn-primary fw-semibold"
                                            onClick={() => handleAction("complete")}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}

                                </div>
                            </div>

                            <div className="alert alert-warning mt-4 small">
                                <strong>Note:</strong><br />
                                Please validate before approving or rejecting.
                            </div>
                            <div className="d-grid mt-2">
                                <button
                                    className="btn btn-dark fw-semibold"
                                    onClick={() => navigate(-1)}
                                >
                                    ⬅ Back to List
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Activity Log</div>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                {activityLog.map((log, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-line"></div>
                                        <div className="timeline-indicator bg-primary"></div>
                                        <div className="timeline-content">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">{log.action}</span>
                                                <small className="text-muted">{log.time}</small>
                                            </div>
                                            <small className="text-muted">by {log.user}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
