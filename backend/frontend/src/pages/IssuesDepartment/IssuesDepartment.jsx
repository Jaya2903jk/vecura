
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function TicketDepartment() {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const getStatus = (status) => {
        switch (status) {
            case "1": return "Pending";
            case "2": return "Accepted";
            case "3": return "Approved";
            case "4": return "Completed";
            default: return status;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", page);

        // if (search) params.append("search", search);
        // if (statusFilter) params.append("status", statusFilter);

        fetch(`http://127.0.0.1:8000/api/issue-departments?${params.toString()}`, {
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
    }, [page, search, statusFilter, priorityFilter]);

    const handleDelete = (id) => {
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const token = localStorage.getItem("token");

                fetch(`http://127.0.0.1:8000/api/issue-departments/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status) {
                            swal("Deleted!", "Department has been deleted.", "success");

                            // 🔁 Refresh list
                            fetchData();
                        } else {
                            swal("Error", "Delete failed", "error");
                        }
                    })
                    .catch(() => swal("Error", "Something went wrong", "error"));
            }
        });
    };
    const renderPagination = () => {
        let pages = [];

        let start = Math.max(1, page - 2);
        let end = Math.min(lastPage, page + 2);

        for (let i = start; i <= end; i++) {
            pages.push(
                <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
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

            {/* Header */}
            <div className="d-flex align-items-left flex-column pt-2 pb-4">
                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <i className="icon-home"></i>
                    </li>
                    <li className="separator">
                        <i className="icon-arrow-right"></i>
                    </li>
                    <li className="nav-item">Ticket Department</li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">

                        {/* Header */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Ticket Department List</h4>
                            <div>
                                <button
                                    className="btn btn-label-info btn-round me-2"
                                    onClick={() => navigate("/ticket/manage")}
                                >
                                    Manage
                                </button>
                                <button
                                    className="btn btn-primary btn-round"
                                    onClick={() => navigate("/issues-department/add")}
                                >
                                    Add Ticket Department
                                </button>
                            </div>
                        </div>

                        <div className="card-body">

                            {/* FILTERS */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search tickets department..."
                                        value={search}
                                        onChange={(e) => {
                                            setPage(1);
                                            setSearch(e.target.value);
                                        }}
                                    />
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
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-secondary w-100"
                                        onClick={() => {
                                            setPage(1);
                                            setSearch("");
                                            setStatusFilter("");
                                            setPriorityFilter("");
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
                                    <p>Loading tickets department...</p>
                                </div>
                            ) : (
                                <>
                                    {/* TABLE */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr className="text-center">
                                                    <th>S.No</th>
                                                    <th>Department Name</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tickets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No tickets department found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tickets.map((t, index) => (
                                                        <tr key={t.Departmentid} className="text-center">
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td >{t.DepartmentName}</td>


                                                            <td>
                                                                <span className="badge bg-warning text-dark">
                                                                    Active
                                                                </span>
                                                            </td>
                                                            {/* <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-info me-2"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                    onClick={() => setSelectedDept(t)}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => navigate(`/ticket/manage/${t.Departmentid}`)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDelete(t.Departmentid)}
                                                                >
                                                                    Delete
                                                                </button>

                                                            </td> */}
                                                            <td>

                                                                <button
                                                                    className="btn btn-info btn-sm me-2"
                                                                    onClick={() => setSelectedDept(t)}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    View
                                                                </button>

                                                                <button
                                                                    className="btn btn-outline-primary btn-sm me-2"
                                                                    onClick={() => navigate(`/ticket/manage/${t.Departmentid}`)}
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDelete(t.Departmentid)}
                                                                >
                                                                    Delete
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

                                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(page - 1)}
                                                >
                                                    Previous
                                                </button>
                                            </li>

                                            {renderPagination()}

                                            <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(page + 1)}
                                                >
                                                    Next
                                                </button>
                                            </li>

                                        </ul>
                                    </nav>
                                </>
                            )}


                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Ticket Department View</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {selectedDept ? (
                                                <>
                                                    <p><strong>Department ID:</strong> {selectedDept.Departmentid}</p>
                                                    <p><strong>Department Name:</strong> {selectedDept.DepartmentName}</p>
                                                </>
                                            ) : (
                                                <p>No data</p>
                                            )}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
