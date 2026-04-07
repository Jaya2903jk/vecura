import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function IssuesCategory() {
    const navigate = useNavigate();

    const [selectedDept, setSelectedDept] = useState(null);


    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [editCategory, setEditCategory] = useState({
        category_id: "",
        category_name: "",
        status: "Active"
    });
    const fetchData = () => {
        const token = localStorage.getItem("token");

        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", page);

        if (search) {
            params.append("search", search);
        }

        if (statusFilter) {
            params.append("status", statusFilter);
        }
        fetch(`http://127.0.0.1:8000/api/issues-category?${params.toString()}`, {
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
    };

    useEffect(() => {
        fetchData();
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

                fetch(`http://127.0.0.1:8000/api/issues-category/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status) {
                            swal("Deleted!", "Category  deleted.", "success");
                            fetchData();
                        } else {
                            swal("Error", "Delete failed", "error");
                        }
                    })
                    .catch(() => swal("Error", "Something went wrong", "error"));
            }
        });
    };

    const handleUpdate = () => {
        const token = localStorage.getItem("token");

        fetch(`http://127.0.0.1:8000/api/issues-category/${editCategory.category_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                category_name: editCategory.category_name,
                status: editCategory.status
            }),
        })
            .then(res => res.json())
            .then(data => {
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
                    <li className="nav-home">
                        <i className="icon-home"></i>
                    </li>
                    <li className="separator">
                        <i className="icon-arrow-right"></i>
                    </li>
                    <li className="nav-item">Issues Category</li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">

                        {/* Header */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Issues Category List</h4>
                            <div>
                                <button
                                    className="btn btn-label-info btn-round me-2"
                                    onClick={() => navigate("/ticket/manage")}
                                >
                                    Manage
                                </button>
                                <button
                                    className="btn btn-primary btn-round"
                                    onClick={() => navigate("/issues-category/add")}
                                >
                                    Add Issues Category
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
                                        placeholder="Search issues category..."
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
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>

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
                                    <p>Loading Issues Category ...</p>
                                </div>
                            ) : (
                                <>
                                    {/* TABLE */}
                                    <div className="table-responsive">

                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr className="text-center">
                                                    <th>S.No</th>
                                                    <th className="text-center"> Department</th>
                                                    <th className="text-center"> Category Name</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tickets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No Issues category found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tickets.map((t, index) => (
                                                        <tr key={t.category_id} className="text-center">
                                                            <td>{(page - 1) * 10 + index + 1}</td>
                                                            <td className="text-center text-nowrap">
                                                                {t.DepartmentName}
                                                            </td>
                                                            <td className="text-center text-nowrap">
                                                                {t.category_name}
                                                            </td>                                                            <td>
                                                                <span className={`badge ${t.status === "Active" ? "bg-success" : "bg-danger"}`}>
                                                                    {t.status}
                                                                </span>
                                                            </td>

                                                            <td>

                                                                {/* <button
                                                                    className="btn btn-info btn-sm me-2"
                                                                    onClick={() => setSelectedDept(t)}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    View
                                                                </button> */}

                                                                <button
                                                                    className="btn btn-primary btn-sm me-2"
                                                                    onClick={() =>
                                                                        setEditCategory({
                                                                            category_id: t.category_id,
                                                                            category_name: t.category_name,
                                                                            status: t.status
                                                                        })
                                                                    }
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#editModal"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDelete(t.category_id)}
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
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Issues Category View</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {selectedDept ? (
                                                <><p><strong>Department Name:</strong> {selectedDept.DepartmentName}</p>
                                                </>
                                            ) : (
                                                <p>No data</p>
                                            )}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal fade" id="editModal">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h5>Edit Issues Category</h5>
                                            <button
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                id="editModalClose"
                                            ></button>
                                        </div>

                                        <div className="modal-body">

                                            {/* Category Name */}
                                            <div className="form-group mb-3">
                                                <label className="form-label">Issues Category Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter category name"
                                                    value={editCategory.category_name}
                                                    onChange={(e) =>
                                                        setEditCategory({
                                                            ...editCategory,
                                                            category_name: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Status */}
                                            <div className="form-group">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-control"
                                                    value={editCategory.status}
                                                    onChange={(e) =>
                                                        setEditCategory({
                                                            ...editCategory,
                                                            status: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="modal-footer">
                                            <button className="btn btn-danger" data-bs-dismiss="modal">
                                                Cancel
                                            </button>

                                            <button className="btn btn-primary" onClick={handleUpdate}>
                                                Update
                                            </button>
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
