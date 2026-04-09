
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IssuesMasterAdd() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [approvalFlow, setApprovalFlow] = useState([]);
    const [approvalFlowStatus, setApprovalFlowStatus] = useState({});
    const [approvalFlowNote, setApprovalFlowNote] = useState({});

    // Now safe to create approvalFlowData
    const approvalFlowData = approvalFlow.map((roleId, index) => ({
        roleId,
        levelOrder: index + 1,
        levelName: `Level ${index + 1}`,
        status: approvalFlowStatus[roleId] || 'Pending',
        note: approvalFlowNote[roleId] || ''
    }));
    const [form, setForm] = useState({
        DepartmentId: "",
        CategoryId: "",
        IssueName: "",
        Status: "Active",
    });
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        type: "", // success | danger
        message: "",
    });
    const handleDepartmentChange = (e) => {
        const deptId = e.target.value;
        setSelectedDept(deptId);
        setForm(prev => ({
            ...prev,
            DepartmentId: deptId,
            CategoryId: "" // reset category
        }));

        fetchCategories(deptId);
    };
    useEffect(() => {
        fetchDepartments();
        // fetchCategories();
        fetchRoles();

    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://127.0.0.1:8000/api/departments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setDepartments(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async (departmentId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://127.0.0.1:8000/api/categories-list?department_id=${departmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setCategories(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://127.0.0.1:8000/api/roles", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setRolesList(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };
    // handle input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = approvalFlow.indexOf(active.id);
            const newIndex = approvalFlow.indexOf(over.id);

            setApprovalFlow(arrayMove(approvalFlow, oldIndex, newIndex));
        }
    };

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token missing. Please login again.");
            navigate("/login");
            return;
        }

        // const levels = {
        //     Level1Role: approvalFlow[0] || null,
        //     Level2Role: approvalFlow[1] || null,
        //     Level3Role: approvalFlow[2] || null,
        //     Level4Role: approvalFlow[3] || null,
        //     Level5Role: approvalFlow[4] || null,
        // };

        setLoading(true);

        fetch("http://127.0.0.1:8000/api/issues-master", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                DepartmentId: form.DepartmentId,
                CategoryId: form.CategoryId,
                IssueName: form.IssueName,
                Status: form.Status === "Active" ? 1 : 0,
                // ...levels,
                approvalFlow: approvalFlowData,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    setAlert({
                        show: true,
                        type: "success",
                        message: "Issue created successfully!",
                    });

                    setForm({
                        DepartmentId: "",
                        CategoryId: "",
                        IssueName: "",
                        Status: "Active",
                    });
                    setApprovalFlow([]);

                    setTimeout(() => {
                        setAlert({ show: false, type: "", message: "" });
                        navigate("/issues-master"); //
                    }, 2000);
                } else {
                    setAlert({
                        show: true,
                        type: "danger",
                        message: data.message || "Error creating issue",
                    });
                }
            })
            .catch(() => {
                setLoading(false);

                setAlert({
                    show: true,
                    type: "danger",
                    message: "Something went wrong!",
                });
            });
    };

    return (
        <div className="page-inner">
            {/* Header */}
            <div class="page-header">
                <h3 class="fw-bold mb-3">Ticket Issues Master</h3>
                <ul class="breadcrumbs mb-3">
                    <li class="nav-home">
                        <a href="#">
                            {" "}
                            <i class="icon-home"></i>
                        </a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>{" "}
                    <li class="nav-item">
                        <a href="#"> Ticket Issues Master</a>
                    </li>{" "}
                    <li class="separator">
                        {" "}
                        <i class="icon-arrow-right"></i>
                    </li>{" "}
                    <li class="nav-item">
                        {" "}
                        <a href="#">Add Issues Master</a>{" "}
                    </li>{" "}
                </ul>{" "}
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">
                                Add Ticket Issues Master
                            </div>
                        </div>
                        {alert.show && alert.type === "success" && (
                            <div className="m-3 p-3 border-start border-5 border-success bg-light rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-check-circle-fill text-success me-2 fs-4"></i>
                                    <div>
                                        <strong className="text-success">
                                            Success!
                                        </strong>
                                        <div>{alert.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto"
                                        onClick={() =>
                                            setAlert({ ...alert, show: false })
                                        }
                                    ></button>
                                </div>
                            </div>
                        )}

                        {alert.show && alert.type === "danger" && (
                            <div className="m-3 p-3 border-start border-5 border-danger bg-light rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-x-circle-fill text-danger me-2 fs-4"></i>
                                    <div>
                                        <strong className="text-danger">
                                            Error!
                                        </strong>
                                        <div>{alert.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto"
                                        onClick={() =>
                                            setAlert({ ...alert, show: false })
                                        }
                                    ></button>
                                </div>
                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Department Name</label>
                                            <select
                                                name="DepartmentId"
                                                className="form-control"
                                                value={form.DepartmentId}
                                                // onChange={handleChange}
                                                onChange={(e) => {
                                                    handleChange(e);               // update form
                                                    handleDepartmentChange(e);     // fetch categories
                                                }}
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.Departmentid} value={dept.Departmentid}>
                                                        {dept.DepartmentName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Issues Category</label>
                                            <select
                                                name="CategoryId"
                                                className="form-control"
                                                value={form.CategoryId}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Issues Name</label>
                                            <input
                                                type="text"
                                                name="IssueName"
                                                className="form-control"
                                                placeholder="Enter Issue Name"
                                                value={form.IssueName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Status</label>
                                            <select
                                                name="Status"
                                                className="form-control"
                                                value={form.Status}
                                                onChange={handleChange}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6  col-lg-4">
                                        <div className="form-group">
                                            <label>Add Role</label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val && !approvalFlow.includes(val)) {
                                                        setApprovalFlow([...approvalFlow, val]);
                                                    }
                                                }}
                                            >
                                                <option value="">Select Role</option>
                                                {rolesList.map((r) => (
                                                    <option key={r.UserGroupID} value={r.UserGroupID}>
                                                        {r.UserGroupName}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>

                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h6>Approval Flow</h6>

                                    {approvalFlow.length === 0 && (
                                        <p className="text-muted small">No roles added yet. Please select roles above.</p>
                                    )}

                                    {approvalFlow.map((roleId, index) => {
                                        const role = rolesList.find(r => r.UserGroupID === roleId);
                                        const roleName = role ? role.UserGroupName : roleId;

                                        return (
                                            <div key={roleId} className="border p-1 mb-1">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="small"><strong>Lvl {index + 1}:</strong> {roleName}</span>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-sm"
                                                            onClick={() => {
                                                                if (index === 0) return;
                                                                const arr = [...approvalFlow];
                                                                [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
                                                                setApprovalFlow(arr);
                                                            }}
                                                            disabled={index === 0}
                                                        >↑</button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-sm"
                                                            onClick={() => {
                                                                if (index === approvalFlow.length - 1) return;
                                                                const arr = [...approvalFlow];
                                                                [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
                                                                setApprovalFlow(arr);
                                                            }}
                                                            disabled={index === approvalFlow.length - 1}
                                                        >↓</button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => setApprovalFlow(approvalFlow.filter((_, i) => i !== index))}
                                                        >✕</button>
                                                    </div>
                                                </div>

                                                <div className="mb-1">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={approvalFlowStatus[roleId] || 'Pending'}
                                                        onChange={(e) => setApprovalFlowStatus({ ...approvalFlowStatus, [roleId]: e.target.value })}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Accepted">Accepted</option>
                                                        <option value="Verified">Verified</option>
                                                        <option value="Approved">Approved</option>
                                                    </select>
                                                </div>

                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={approvalFlowNote[roleId] || ''}
                                                    onChange={(e) => setApprovalFlowNote({ ...approvalFlowNote, [roleId]: e.target.value })}
                                                    placeholder="Add note"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="card-action">
                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        navigate("/issues-master")
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
