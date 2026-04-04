import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TicketDetails() {
    const navigate = useNavigate();
    const [ticketStatus, setTicketStatus] = useState("1");

    // ✅ STATIC DATA (later replace with API)
    const ticket = {
        ticket_id: "TCK-AB1234",
        department: "IT Support",
        subject: "System not working",
        priority: "High",
        status: "1",
        description: "My system is not turning on properly. It powers on but the screen remains black and no response from keyboard/mouse.",
        created_at: "2026-04-02 10:30 AM",
        created_by: "John Doe (Employee ID: EMP-456)",
        assignee: "Jane Smith (IT Admin)"
    };

    // Activity log (static demo data)
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

    const getPriorityBadge = (priority) => {
        switch (priority.toLowerCase()) {
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

    const handleAction = (action) => {
        // Replace with API call
        console.log(`Action: ${action} for ticket ${ticket.ticket_id}`);
        if (action === "accept") setTicketStatus("2");
        if (action === "approve") setTicketStatus("3");
        if (action === "reject") setTicketStatus("5");
        if (action === "complete") setTicketStatus("4");
    };

    return (
        <div className="page-inner">
            <div className="page-header">
                <h3 className="fw-bold mb-3">Ticket Details</h3>
                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <a href="#"><i className="icon-home"></i></a>
                    </li>
                    <li className="separator"><i className="icon-arrow-right"></i></li>
                    <li className="nav-item"><a href="#">Tickets</a></li>
                    <li className="separator"><i className="icon-arrow-right"></i></li>
                    <li className="nav-item active">Ticket Details</li>
                </ul>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="card-title">Ticket Information</div>
                            <div>{getStatusBadge(ticketStatus)}</div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <strong>Ticket ID:</strong> {ticket.ticket_id}
                                </div>
                                <div className="col-md-6">
                                    <strong>Priority:</strong> {getPriorityBadge(ticket.priority)}
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <strong>Department:</strong> {ticket.department}
                                </div>
                                <div className="col-md-6">
                                    <strong>Created:</strong> {ticket.created_at}
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <strong>Created By:</strong> {ticket.created_by}
                                </div>
                                <div className="col-md-6">
                                    <strong>Assignee:</strong> {ticket.assignee}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <strong>Subject:</strong>
                                    <h5 className="mt-1">{ticket.subject}</h5>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-12">
                                    <strong>Description:</strong>
                                    <p className="mt-2">{ticket.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-info text-white py-3">
                            <h5 className="mb-0 fw-semibold"> Ticket Actions</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h6 className="fw-bold text-muted mb-3">Available Actions</h6>

                                <div className="d-grid gap-2">

                                    {ticketStatus === "1" && (
                                        <>
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
                                                Escalte Ticket                                            </button>
                                        </>
                                    )}

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
