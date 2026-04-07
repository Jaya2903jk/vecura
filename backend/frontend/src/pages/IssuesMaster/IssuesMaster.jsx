import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function IssuesMaster() {
    const navigate = useNavigate();

    const [selectedDept, setSelectedDept] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Dropdown data
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);

    // Edit form state
    const [editDept, setEditDept] = useState({
        IssueId: "",
        DepartmentId: "",
        CategoryId: "",
        IssueName: "",
        Level1Role: "",
        Level2Role: "",
        Level3Role: "",
        Level4Role: "",
        Level5Role: "",
        Status: 1,
    });

    // Fetch tickets
    const fetchData = () => {
        const token = localStorage.getItem("token");
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", page);

        fetch(`http://127.0.0.1:8000/api/issues-master?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setTickets(data.data || []);
                    setLastPage(1);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // Fetch dropdowns
    const fetchDropdowns = () => {
        const token = localStorage.getItem("token");
        fetch("http://127.0.0.1:8000/api/departments", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setDepartments(data.data || []));

        fetch("http://127.0.0.1:8000/api/categories-list", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCategories(data.data || []));

        fetch("http://127.0.0.1:8000/api/roles", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setRoles(data.data || []));
    };

    useEffect(() => {
        fetchData();
        fetchDropdowns();
    }, [page, search, statusFilter]);

    // Delete ticket
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
                fetch(`http://127.0.0.1:8000/api/issues-master/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status) {
                            swal("Deleted!", "Issue deleted.", "success");
                            fetchData();
                        } else {
                            swal("Error", "Delete failed", "error");
                        }
                    })
                    .catch(() => swal("Error", "Something went wrong", "error"));
            }
        });
    };

    // Update ticket
    const handleUpdate = () => {
        const token = localStorage.getItem("token");
        fetch(`http://127.0.0.1:8000/api/issues-master/${editDept.IssueId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(editDept),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    swal("Success", "Updated successfully", "success");
                    document.getElementById("editModalClose").click();
                    fetchData();
                } else {
                    swal("Error", "Update failed", "error");
                }
            })
            .catch(() => swal("Error", "Something went wrong", "error"));
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
                    <li className="nav-home"><i className="icon-home"></i></li>
                    <li className="separator"><i className="icon-arrow-right"></i></li>
                    <li className="nav-item">Ticket Issues Master</li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        {/* Header */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Ticket Issues Master List</h4>
                            <div>
                                <button className="btn btn-label-info btn-round me-2" onClick={() => navigate("/ticket/manage")}>Manage</button>
                                <button className="btn btn-primary btn-round" onClick={() => navigate("/issues-master/add")}>Add Issues Master</button>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* FILTERS */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search tickets issues..."
                                        value={search}
                                        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={statusFilter}
                                        onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-secondary w-100" onClick={() => { setPage(1); setSearch(""); setStatusFilter(""); }}>Reset</button>
                                </div>
                            </div>

                            {/* LOADING */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"></div>
                                    <p>Loading tickets Issues...</p>
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
                                                    <th>Issues Category</th>
                                                    <th>Issues Name</th>
                                                    <th>Approval level</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tickets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">No issues master found</td>
                                                    </tr>
                                                ) : (
                                                    tickets.map((t, index) => (
                                                        <tr key={t.IssueId} className="text-center">
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td>{t.DepartmentName}</td>
                                                            <td>{t.category_name}</td>
                                                            <td>{t.IssueName}</td>
                                                            <td>
                                                                {[
                                                                    t.Level1Name,
                                                                    t.Level2Name,
                                                                    t.Level3Name,
                                                                    t.Level4Name,
                                                                    t.Level5Name,
                                                                ].filter(Boolean).length > 0 && (
                                                                        <>
                                                                            Level {[
                                                                                t.Level1Name,
                                                                                t.Level2Name,
                                                                                t.Level3Name,
                                                                                t.Level4Name,
                                                                                t.Level5Name,
                                                                            ].filter(Boolean).length} - (
                                                                            {[
                                                                                t.Level1Name,
                                                                                t.Level2Name,
                                                                                t.Level3Name,
                                                                                t.Level4Name,
                                                                                t.Level5Name,
                                                                            ].filter(Boolean).join(", ")})
                                                                        </>
                                                                    )}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${t.Status == 1 ? "bg-success" : "bg-danger"}`}>
                                                                    {t.Status == 1 ? "Active" : "Inactive"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-info btn-sm me-2" onClick={() => setSelectedDept(t)} data-bs-toggle="modal" data-bs-target="#viewModal">View</button>
                                                                <button className="btn btn-primary btn-sm me-2" onClick={() => setEditDept(t)} data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                                                                <button className="btn btn-danger btn-sm disabled" onClick={() => handleDelete(t.IssueId)}>Delete</button>
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
                                                <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                                            </li>
                                            {renderPagination()}
                                            <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </>
                            )}

                            {/* VIEW MODAL */}
                            <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="viewModalLabel">Ticket Issues Master View</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {selectedDept ? (
                                                <>
                                                    <p><strong>Department Name:</strong> {selectedDept.DepartmentName}</p>
                                                    <p><strong>Category Name:</strong> {selectedDept.category_name}</p>
                                                    <p><strong>Issue Name:</strong> {selectedDept.IssueName}</p>
                                                    <p><strong>Approval Levels:</strong> {[
                                                        selectedDept.Level1Name,
                                                        selectedDept.Level2Name,
                                                        selectedDept.Level3Name,
                                                        selectedDept.Level4Name,
                                                        selectedDept.Level5Name,
                                                    ].filter(Boolean).join(", ")}</p>
                                                    <p><strong>Status:</strong> {selectedDept.Status == 1 ? "Active" : "Inactive"}</p>
                                                </>
                                            ) : (<p>No data</p>)}
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* EDIT MODAL */}
                            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5>Edit Ticket Issue</h5>
                                            <button className="btn-close" data-bs-dismiss="modal" id="editModalClose"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-2">
                                                <label>Department</label>
                                                <select className="form-control" value={editDept.DepartmentId} onChange={(e) => setEditDept({ ...editDept, DepartmentId: e.target.value })}>
                                                    <option value="">Select Department</option>
                                                    {departments.map(d => <option key={d.DepartmentId} value={d.DepartmentId}>{d.DepartmentName}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <label>Category</label>
                                                <select className="form-control" value={editDept.CategoryId} onChange={(e) => setEditDept({ ...editDept, CategoryId: e.target.value })}>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <label>Issue Name</label>
                                                <input type="text" className="form-control" value={editDept.IssueName} onChange={(e) => setEditDept({ ...editDept, IssueName: e.target.value })} />
                                            </div>
                                            <div className="mb-2">
                                                <label>Approval Level 1</label>
                                                <select className="form-control" value={editDept.Level1Role} onChange={(e) => setEditDept({ ...editDept, Level1Role: e.target.value })}>
                                                    <option value="">Select Role</option>
                                                    {roles.map(r => <option key={r.UserGroupID} value={r.UserGroupID}>{r.UserGroupName}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <label>Approval Level 2</label>
                                                <select className="form-control" value={editDept.Level2Role} onChange={(e) => setEditDept({ ...editDept, Level2Role: e.target.value })}>
                                                    <option value="">Select Role</option>
                                                    {roles.map(r => <option key={r.UserGroupID} value={r.UserGroupID}>{r.UserGroupName}</option>)}
                                                </select>
                                            </div>
                                            {/* Repeat for Level3Role, Level4Role, Level5Role if needed */}
                                            <div className="mb-2">
                                                <label>Status</label>
                                                <select className="form-control" value={editDept.Status} onChange={(e) => setEditDept({ ...editDept, Status: e.target.value })}>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
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
