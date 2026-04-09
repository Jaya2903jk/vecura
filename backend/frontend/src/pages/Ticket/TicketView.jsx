import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../assets/css/ticket.css";

export default function TicketDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // ticket id from route
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    const userRole = Number(user?.roleId);

    const [ticket, setTicket] = useState(null);
    const [ticketStatus, setTicketStatus] = useState("");

    // Fetch ticket data
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://127.0.0.1:8000/api/tickets/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setTicket(data.data);
                    setTicketStatus(String(data.data.Status));
                }
            })
            .catch((err) => console.error("Error fetching ticket:", err));
    }, [id]);

    // Update ticket status (for main ticket)
    const handleAction = (action) => {
        if (!ticket) return;
        let newStatus = ticketStatus;
        if (action === "accept") newStatus = "2";
        if (action === "approve") newStatus = "3";
        if (action === "reject") newStatus = "5";
        if (action === "complete") newStatus = "4";
        setTicketStatus(newStatus);
    };

    // Handle complaint action (level-based)
    const handleComplaintAction = (complaintId, action) => {
        if (!ticket) return;

        setTicket((prev) => ({
            ...prev,
            complaints: prev.complaints.map((c) =>
                c.complaintId === complaintId
                    ? {
                          ...c,
                          Status:
                              action === "accept"
                                  ? "Accepted"
                                  : action === "verify"
                                  ? "Verified"
                                  : action === "approve"
                                  ? "Approved"
                                  : action === "reject"
                                  ? "Rejected"
                                  : c.Status,
                      }
                    : c
            ),
        }));

        // API call to backend
        const token = localStorage.getItem("token");
        fetch(`http://127.0.0.1:8000/api/complaints/${complaintId}/action`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action }),
        })
            .then((res) => res.json())
            .then((data) => console.log("Action saved:", data))
            .catch((err) => console.error(err));
    };

    const getStatusBadge = (status) => {
        switch (String(status).toLowerCase()) {
            case "pending":
                return <span className="badge bg-warning text-dark">Pending</span>;
            case "accepted":
                return <span className="badge bg-info text-dark">Accepted</span>;
            case "verified":
                return <span className="badge bg-primary text-white">Verified</span>;
            case "approved":
                return <span className="badge bg-success">Approved</span>;
            case "rejected":
                return <span className="badge bg-danger">Rejected</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (!ticket) return null;

    return (
        <div className="page-inner">
            <div className="page-header">
                <h3 className="fw-bold mb-3">Ticket</h3>
                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <a href="#"><i className="icon-home"></i></a>
                    </li>
                    <li className="separator"><i className="icon-arrow-right"></i></li>
                    <li className="nav-item"><a href="#">Ticket</a></li>
                    <li className="separator"><i className="icon-arrow-right"></i></li>
                    <li className="nav-item"><a href="#">Ticket View</a></li>
                </ul>
            </div>

            {/* Ticket Info */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header premium-header">
                            <div className="card-title text-white">Ticket Information</div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6"><strong>Ticket ID:</strong> {ticket.TicketCode ?? "N/A"}</div>
                                <div className="col-md-6"><strong>Mobile No:</strong> {ticket.mobile ?? "N/A"}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6"><strong>Department:</strong> {ticket.Department}</div>
                                <div className="col-md-6"><strong>Location Name:</strong> {ticket.Branch}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6"><strong>Registration No:</strong> {ticket.CustomerCode}</div>
                                <div className="col-md-6"><strong>Customer Name:</strong> {ticket.CustomerName}</div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>

                {/* Ticket Actions */}
                <div className="col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header premium-header">
                            <h5 className="card-title text-white">Ticket Actions</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div className="alert alert-warning mt-4 small">
                                <strong>Note:</strong> Please validate before approving or rejecting.
                            </div>
                            <div className="d-grid mt-2">
                                <button className="btn btn-dark fw-semibold" onClick={() => navigate(-1)}>⬅ Back to List</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complaints Table */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header premium-header">
                            <div className="card-title text-white">Complaints</div>
                        </div>
                        <div className="card-body p-2">
                            <div className="row fw-bold text-muted small px-2 py-1 border-bottom">
                                <div className="col-md-1">#</div>
                                <div className="col-md-1">Date</div>
                                <div className="col-md-2">Created By</div>
                                <div className="col-md-1">Complaint</div>
                                <div className="col-md-1">Source</div>
                                <div className="col-md-2">Escalation</div>
                                <div className="col-md-2">Feedback</div>
                                <div className="col-md-1">Status</div>
                                <div className="col-md-1 text-end">Action</div>
                            </div>

                            {ticket.complaints?.length > 0 ? (
                                ticket.complaints.map((c, idx) => {
                                    const levels = c.ApprovalLevels || [];
                                    const currentLevel = c.CurrentLevel || 0;
                                    const levelIndex = levels.findIndex((r) => Number(r) === userRole);
                                    const canAct = levelIndex === currentLevel || userRole === 1;

                                    return (
                                        <div key={c.complaintId || idx} className="row align-items-center log-item small px-2 py-2 border-bottom">
                                            <div className="col-md-1">{idx + 1}</div>
                                            <div className="col-md-1">{c.CreatedDate ?? "-"}</div>
                                            <div className="col-md-2 text-muted">{c.CreatedBy ?? "-"}</div>
                                            <div className="col-md-1" title={c.Category}>{c.Category || "-"}</div>
                                            <div className="col-md-1" title={c.sources}>{c.sources || "-"}</div>
                                            <div className="col-md-2" title={c.Issue}>{c.Issue || "-"}</div>
                                            <div className="col-md-2" title={c.Comment}>{c.Comment || "No comment"}</div>
                                            <div className="col-md-1">{getStatusBadge(c.Status)}</div>

                                            {/* Action Buttons */}
                                            <div className="col-md-1 text-end">
                                                {/* {canAct && ( */}
                                                    <div className="d-flex flex-column gap-1">
                                                        {currentLevel === levelIndex && (
                                                            <>
                                                                <button className="btn btn-outline-info btn-sm" onClick={() => handleComplaintAction(c.complaintId, "accept")}>Accept</button>
                                                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleComplaintAction(c.complaintId, "verify")}>Verify</button>
                                                                <button className="btn btn-outline-success btn-sm" onClick={() => handleComplaintAction(c.complaintId, "approve")}>Approve</button>
                                                            </>
                                                        )}
                                                        {userRole === 13 && (
                                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleComplaintAction(c.complaintId, "reject")}>Reject</button>
                                                        )}
                                                    </div>
                                                {/* )} */}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-muted p-3">No complaints found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
