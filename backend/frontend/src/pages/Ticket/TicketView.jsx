import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../assets/css/ticket.css";
export default function TicketDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // ticket id from route

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketStatus, setTicketStatus] = useState("");
    const activityLog = [
        {
            action: "Created Task",
            employeeId: "EMP001",
            employeeName: "John Doe",
            comment: "Initial task created",
            dateTime: "03 Apr 2026, 10:30 AM"
        },
        {
            action: "Updated Status",
            employeeId: "EMP002",
            employeeName: "Jane Smith",
            comment: "Marked as completed",
            dateTime: "03 Apr 2026, 11:00 AM"
        }
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

    // return (
    //     <div className="page-inner">

    //         <div class="page-header">
    //             <h3 class="fw-bold mb-3">Ticket</h3>
    //             <ul class="breadcrumbs mb-3">
    //                 <li class="nav-home">
    //                     <a href="#">
    //                         <i class="icon-home"></i>
    //                     </a>
    //                 </li>
    //                 <li class="separator">
    //                     <i class="icon-arrow-right"></i>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a href="#">Ticket</a>
    //                 </li>
    //                 <li class="separator">
    //                     <i class="icon-arrow-right"></i>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a href="#">Ticket View</a>
    //                 </li>
    //             </ul>
    //         </div>


    //         <div className="row">

    //             {/* LEFT SIDE */}
    //             <div className="col-lg-8">
    //                 <div className="card">
    //                     <div className="card-header d-flex justify-content-between">
    //                         <div className="card-title">Ticket Information</div>
    //                     </div>

    //                     <div className="card-body">

    //                         <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Ticket ID:</strong> {ticket.TicketCode}
    //                             </div>
    //                             <div className="col-md-6">
    //                                 <strong>Priority:</strong>{" "}
    //                                 {getPriorityBadge(ticket.Priority)}
    //                             </div>
    //                         </div>

    //                         <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Department:</strong> {ticket.Department}
    //                             </div>
    //                             <div className="col-md-6">
    //                                 <strong>Branch:</strong> {ticket.Branch}
    //                             </div>
    //                         </div>
    //                         <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Customer Code:</strong> {ticket.CustomerCode}
    //                             </div>

    //                             <div className="col-md-6">
    //                                 <strong>Customer Name:</strong> {ticket.CustomerName}
    //                             </div>
    //                         </div>
    //                         <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Status:</strong>{" "}
    //                                 {getStatusBadge(ticketStatus)}
    //                             </div>
    //                         </div>
    //                         {/* <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Approved By:</strong> {ticket.ApprovedBy}
    //                             </div>

    //                             <div className="col-md-6">
    //                                 <strong>Accepted By:</strong> {ticket.AcceptedBy}
    //                             </div>
    //                         </div> */}
    //                         <div className="row mb-3">
    //                             <div className="col-md-6">
    //                                 <strong>Created By:</strong> {ticket.CreatedBy}
    //                             </div>
    //                             <div className="col-md-6">
    //                                 <strong>Accepted By:</strong> {ticket.AcceptedBy}
    //                             </div>
    //                         </div>

    //                         <hr />

    //                         <div className="mb-3">
    //                             <strong>Subject:</strong>
    //                             <h5>{ticket.Subject}</h5>
    //                         </div>

    //                         <div>
    //                             <strong>Description:</strong>
    //                             <p>{ticket.Brief || "No description available"}</p>
    //                         </div>

    //                     </div>
    //                 </div>
    //             </div>

    //             {/* RIGHT SIDE */}
    //             <div className="col-lg-4">
    //                 <div className="card h-100 shadow-sm border-0">
    //                     <div className="card-header bg-info text-white py-3">
    //                         <h5 className="mb-0 fw-semibold"> Ticket Actions</h5>
    //                     </div>
    //                     <div className="card-body d-flex flex-column justify-content-between">
    //                         <div>
    //                             <h6 className="fw-bold text-muted mb-3">Available Actions</h6>

    //                             <div className="d-grid gap-2">

    //                                 {/* {ticketStatus === "1" && (
    //                                     <> */}
    //                                 <button
    //                                     className="btn btn-outline-primary fw-semibold"
    //                                     onClick={() => handleAction("accept")}
    //                                 >
    //                                     Assigned to Me
    //                                 </button>

    //                                 <button
    //                                     className="btn bg-success fw-semibold"
    //                                     onClick={() => handleAction("approve")}
    //                                 >
    //                                     Approve Ticket
    //                                 </button>

    //                                 <button
    //                                     className="btn btn-outline-danger fw-semibold"
    //                                     onClick={() => handleAction("reject")}
    //                                 >
    //                                     Escalte Ticket </button>
    //                                 {/* </>
    //                                 )} */}

    //                                 {ticketStatus === "2" && (
    //                                     <button
    //                                         className="btn btn-primary fw-semibold"
    //                                         onClick={() => handleAction("complete")}
    //                                     >
    //                                         Mark as Completed
    //                                     </button>
    //                                 )}

    //                             </div>
    //                         </div>

    //                         <div className="alert alert-warning mt-4 small">
    //                             <strong>Note:</strong><br />
    //                             Please validate before approving or rejecting.
    //                         </div>
    //                         <div className="d-grid mt-2">
    //                             <button
    //                                 className="btn btn-dark fw-semibold"
    //                                 onClick={() => navigate(-1)}
    //                             >
    //                                 ⬅ Back to List
    //                             </button>
    //                         </div>

    //                     </div>
    //                 </div>
    //             </div>

    //         </div>
    //         <div className="row mt-4">
    //             <div className="col-12">
    //                 <div className="card">
    //                     <div className="card-header">
    //                         <div className="card-title">Activity Log</div>
    //                     </div>
    //                     <div className="card-body">
    //                         <div className="timeline">
    //                             {activityLog.map((log, index) => (
    //                                 <div key={index} className="timeline-item">
    //                                     <div className="timeline-line"></div>
    //                                     <div className="timeline-indicator bg-primary"></div>
    //                                     <div className="timeline-content">
    //                                         <div className="d-flex justify-content-between">
    //                                             <span className="fw-bold">{log.action}</span>
    //                                             <small className="text-muted">{log.time}</small>
    //                                         </div>
    //                                         <small className="text-muted">by {log.user}</small>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="page-inner ">

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

            <div className="row">

                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header premium-header d-flex justify-content-between">
                            <div className="card-title text-white">Ticket Information</div>
                        </div>

                        <div className="card-body">

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Ticket ID:</strong> {ticket.TicketCode}
                                </div>
                                <div className="col-md-6">
                                    <strong>Priority:</strong> {getPriorityBadge(ticket.Priority)}
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
                                    <strong>Customer Name:</strong> {ticket.CustomerName}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Status:</strong> {getStatusBadge(ticketStatus)}
                                </div>
                            </div>

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

                        <div className="card-header premium-header">
                            <h5 className="card-title text-white">Ticket Actions</h5>
                        </div>

                        <div className="card-body d-flex flex-column justify-content-between">

                            <div>
                                <h6 className="fw-bold text-muted mb-3">Available Actions</h6>

                                <div className="d-grid gap-2">

                                    <button
                                        className="btn btn-outline-premium fw-semibold"
                                        onClick={() => handleAction("accept")}
                                    >
                                        Assigned to Me
                                    </button>

                                    <button
                                        className="btn btn-premium fw-semibold"
                                        onClick={() => handleAction("approve")}
                                    >
                                        Approve Ticket
                                    </button>

                                    <button
                                        className="btn btn-outline-danger fw-semibold"
                                        onClick={() => handleAction("reject")}
                                    >
                                        Escalate Ticket
                                    </button>

                                    {ticketStatus === "2" && (
                                        <button
                                            className="btn btn-premium fw-semibold"
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

            {/* ACTIVITY LOG */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card ">

                        <div className="card-header premium-header">
                            <div className="card-title text-white">Activity Log</div>
                        </div>

                        <div className="card-body p-2">

                            {/* Header Row */}
                            <div className="row fw-bold text-muted small px-2 py-1">
                                <div className="col-md-3">Employee</div>
                                <div className="col-md-4">Comment</div>
                                <div className="col-md-2 text-end">Date & Time</div>
                            </div>

                            {/* Data Rows */}
                            {activityLog.map((log, index) => (
                                <div key={index} className="row align-items-center log-item small px-2 py-2">


                                    <div className="col-md-3 text-muted">
                                        {log.employeeName} ({log.employeeId})
                                    </div>

                                    <div className="col-md-4">
                                        {log.comment}
                                    </div>

                                    <div className="col-md-2 text-end text-muted">
                                        {log.dateTime}
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>
                </div>
            </div>

        </div>
    );

    // return (
    //     <div className="page-inner">

    //         {/* HEADER */}
    //         <div class="page-header">
    //             <h3 class="fw-bold mb-3">Ticket</h3>
    //             <ul class="breadcrumbs mb-3">
    //                 <li class="nav-home">
    //                     <a href="#">
    //                         <i class="icon-home"></i>
    //                     </a>
    //                 </li>
    //                 <li class="separator">
    //                     <i class="icon-arrow-right"></i>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a href="#">Ticket</a>
    //                 </li>
    //                 <li class="separator">
    //                     <i class="icon-arrow-right"></i>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a href="#">Ticket View</a>
    //                 </li>
    //             </ul>

    //         </div>


    //         {/* SINGLE CARD */}
    //         <div className="premium-card">

    //             <div className="p-4">
    //                 <div className="row">
    //                     <div className="col-lg-8">
    //                         {/* 🔹 SECTION: BASIC INFO */}
    //                         <div className="section-block">
    //                             <div className="premium-header">Ticket Information</div>

    //                             <div className="row g-3 mt-1">
    //                                 {[
    //                                     ["Ticket ID", ticket.TicketCode],
    //                                     ["Priority", getPriorityBadge(ticket.Priority)],
    //                                     ["Department", ticket.Department],
    //                                     ["Branch", ticket.Branch],
    //                                     ["Customer Code", ticket.CustomerCode],
    //                                     ["Customer Name", ticket.CustomerName],
    //                                     ["Status", getStatusBadge(ticketStatus)],
    //                                     ["Created By", ticket.CreatedBy],
    //                                     ["Accepted By", ticket.AcceptedBy],
    //                                 ].map(([label, value], i) => (
    //                                     <div key={i} className="col-md-6">
    //                                         <div className="info-box">
    //                                             <div className="label">{label}</div>
    //                                             <div className="value">{value}</div>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         </div>

    //                         {/* 🔹 SECTION: SUBJECT */}
    //                         <div className="section-block mt-4">
    //                             <div className="section-title">Subject</div>
    //                             <h5 className="fw-bold mb-0">{ticket.Subject}</h5>
    //                         </div>

    //                         {/* 🔹 SECTION: DESCRIPTION */}
    //                         <div className="section-block mt-4">
    //                             <div className="section-title">Description</div>
    //                             <p className="text-muted mb-0">
    //                                 {ticket.Brief || "No description available"}
    //                             </p>
    //                         </div>

    //                         {/* 🔹 SECTION: LOGS */}
    //                         <div className="section-block mt-4">
    //                             <div className="premium-header">Ticket Logs</div>

    //                             {[
    //                                 {
    //                                     action: "Ticket Created",
    //                                     user: "John Doe",
    //                                     time: "03-Apr-2026 10:21 AM"
    //                                 },
    //                                 {
    //                                     action: "Assigned to self",
    //                                     user: "Jane Smith",
    //                                     time: "03-Apr-2026 10:30 AM"
    //                                 },
    //                                 {
    //                                     action: "Approved discount request",
    //                                     user: "Manager",
    //                                     time: "03-Apr-2026 11:00 AM"
    //                                 },
    //                                 {
    //                                     action: "Marked as completed",
    //                                     user: "Admin",
    //                                     time: "03-Apr-2026 12:15 PM"
    //                                 }
    //                             ].map((log, index) => (
    //                                 <div key={index} className="log-item d-flex justify-content-between">

    //                                     <div>
    //                                         <div className="fw-semibold">{log.action}</div>
    //                                         <small className="text-muted">by {log.user}</small>
    //                                     </div>

    //                                     <small className="text-muted">{log.time}</small>

    //                                 </div>
    //                             ))}
    //                         </div>

    //                     </div>

    //                     {/* RIGHT SIDE */}
    //                     <div className="col-lg-4 border-start">

    //                         <div className="ps-lg-3 mt-4 mt-lg-0">

    //                             {/* 🔹 SECTION: ACTIONS */}
    //                             <div className="premium-header">Actions</div>

    //                             <div className="d-grid gap-3 mt-3">

    //                                 <button
    //                                     className="btn btn-outline-premium"
    //                                     onClick={() => handleAction("accept")}
    //                                 >
    //                                     Assign to Me
    //                                 </button>

    //                                 <button
    //                                     className="btn btn-premium"
    //                                     onClick={() => handleAction("approve")}
    //                                 >
    //                                     Approve Ticket
    //                                 </button>

    //                                 <button
    //                                     className="btn btn-outline-danger"
    //                                     onClick={() => handleAction("reject")}
    //                                 >
    //                                     Escalate
    //                                 </button>

    //                                 {ticketStatus === "2" && (
    //                                     <button
    //                                         className="btn btn-dark"
    //                                         onClick={() => handleAction("complete")}
    //                                     >
    //                                         Mark Completed
    //                                     </button>
    //                                 )}
    //                             </div>

    //                             <div className="alert mt-4 small note-box">
    //                                 <strong>Note:</strong><br />
    //                                 Validate before action.
    //                             </div>

    //                         </div>

    //                     </div>

    //                 </div>

    //             </div>

    //         </div>

    //     </div>
    // );
}
