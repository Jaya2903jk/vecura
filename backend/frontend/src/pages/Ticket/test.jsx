import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Ticket() {
    const navigate = useNavigate();
    const [locationFilter, setLocationFilter] = useState("");
    const [locations, setLocations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const getStatus = (status) => {
        switch (status) {
            case 0:
            case "0":
                return "Pending";
            case 1:
            case "1":
                return "Accepted";
            case 2:
            case "2":
                return "Approved";
            case 3:
            case "7":
                return "Completed";
            default:
                return status;
        }
    };
    useEffect(() => {
        // Load locations for filter dropdown
        const token = localStorage.getItem("token");
        fetch(`http://127.0.0.1:8000/api/locations`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setLocations(data.data || []));
    }, []);
    useEffect(() => {
        const token = localStorage.getItem("token");

        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", page);

        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);
        if (priorityFilter) params.append("priority", priorityFilter);
        if (typeFilter) params.append("type", typeFilter);
            if (locationFilter) params.append("location", locationFilter); //

        fetch(`http://127.0.0.1:8000/api/tickets?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setTickets(data.data.data || []);
                    setLastPage(data.data.last_page || 1);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, search, statusFilter, priorityFilter, typeFilter, locationFilter]);
    const renderPagination = () => {
        let pages = [];

        let start = Math.max(1, page - 2);
        let end = Math.min(lastPage, page + 2);

        for (let i = start; i <= end; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-item ${page === i ? "active" : ""}`}
                >
                    <button className="page-link" onClick={() => setPage(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <div className="page-inner">
            <div className="d-flex align-items-left flex-column pt-2 pb-4">
                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <i className="icon-home"></i>
                    </li>
                    <li className="separator">
                        <i className="icon-arrow-right"></i>
                    </li>
                    <li className="nav-item">Ticket</li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Ticket List</h4>
                            <div>
                                <button
                                    className="btn btn-label-info btn-round me-2"
                                    onClick={() => navigate("/ticket/manage")}
                                >
                                    Manage
                                </button>
                                <button
                                    className="btn btn-primary btn-round"
                                    onClick={() => navigate("/ticket/add")}
                                >
                                    Add Ticket
                                </button>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search tickets..."
                                        value={search}
                                        onChange={(e) => {
                                            setPage(1);
                                            setSearch(e.target.value);
                                        }}
                                    />
                                </div>
                                </div>
                                <div className="row mb-3">
                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={locationFilter}
                                        onChange={(e) => {
                                            setPage(1);
                                            setLocationFilter(e.target.value);
                                        }}
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map((loc) => (
                                            <option key={loc.LocationCode} value={loc.LocationCode}>
                                                {loc.LocationName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setPage(1);
                                            setStatusFilter(e.target.value);
                                        }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Pending</option>
                                        <option value="2">Accepted</option>
                                        <option value="3">Approved</option>
                                        <option value="4">Completed</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={typeFilter}
                                        onChange={(e) => {
                                            setPage(1);
                                            setTypeFilter(e.target.value);
                                        }}
                                    >
                                        <option value="">All</option>
                                        <option value="ticket">Ticket</option>
                                        <option value="complaint">
                                            Complaint
                                        </option>
                                    </select>
                                </div>

                                {/* ✅ RESET FIXED */}
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-secondary w-100"
                                        onClick={() => {
                                            setPage(1);
                                            setSearch("");
                                            setStatusFilter("");
                                            setPriorityFilter("");
                                            setTypeFilter("");
                                        }}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* LOADING */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"></div>
                                    <p>Loading tickets...</p>
                                </div>
                            ) : (
                                <>
                                    {/* TABLE */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Ticket ID</th>
                                                    <th>Location</th>
                                                    <th>Department</th>
                                                    <th>Reg No</th>
                                                    <th>Issue Type</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tickets.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="8"
                                                            className="text-center"
                                                        >
                                                            No tickets found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tickets.map((t, index) => (
                                                        <tr key={t.ticket_id}>
                                                            <td>
                                                                {(page - 1) *
                                                                    10 +
                                                                    index +
                                                                    1}
                                                            </td>
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        t.ticket_code
                                                                    }
                                                                </strong>
                                                            </td>
                                                            <td>{t.location}</td>
                                                            <td>
                                                                {t.department}
                                                            </td>
                                                            <td>{t.reg_no}</td>
                                                            <td>
                                                                {t.issue_type}
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge ${(t.type ||
                                                                        "ticket") ===
                                                                        "complaint"
                                                                        ? "bg-danger"
                                                                        : "bg-primary"
                                                                        }`}
                                                                >
                                                                    {t.type ||
                                                                        "ticket"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-warning text-dark">
                                                                    {getStatus(
                                                                        t.status
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {t.created_at}
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-info me-2"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/ticket/view/${t.ticket_id}`
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/ticket/manage/${t.ticket_id}`
                                                                        )
                                                                    }
                                                                >
                                                                    Manage
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* PAGINATION */}
                                    <nav className="mt-3">
                                        <ul className="pagination justify-content-center">
                                            <li
                                                className={`page-item ${page === 1 ? "disabled" : ""
                                                    }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(page - 1)
                                                    }
                                                >
                                                    Previous
                                                </button>
                                            </li>

                                            {renderPagination()}

                                            <li
                                                className={`page-item ${page === lastPage
                                                    ? "disabled"
                                                    : ""
                                                    }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(page + 1)
                                                    }
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
