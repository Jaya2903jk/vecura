
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IssuesMasterAdd() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        DepartmentName: "",
        IssuesCategory: "",
        IssuesName: "",
        Status: "Active",
    });
    const [approvalFlow, setApprovalFlow] = useState([]);
    const [loading, setLoading] = useState(false);
    const rolesList = [
        "Admin",
        "Centre / Branch",
        "Warehouse",
        "Consultant / Doctor",
        "Branch Manager",
        "Call Centre",
        "Accounts",
        "Corporate",
    ];
    const [alert, setAlert] = useState({
        show: false,
        type: "", // success | danger
        message: "",
    });

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

        setLoading(true);

        fetch("http://127.0.0.1:8000/api/issue-departments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                DepartmentName: form.DepartmentName,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    setAlert({
                        show: true,
                        type: "success",
                        message: "Department created successfully!",
                    });

                    setForm({ DepartmentName: "" });

                    // auto hide + redirect
                    setTimeout(() => {
                        setAlert({ show: false, type: "", message: "" });
                        navigate("/issues-department");
                    }, 2000);
                } else {
                    setAlert({
                        show: true,
                        type: "danger",
                        message: data.message || "Error creating department",
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
                                            <input
                                                type="text"
                                                name="DepartmentName"
                                                className="form-control"
                                                placeholder="Enter Department Name"
                                                value={form.DepartmentName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Issues Category</label>
                                            <select
                                                name="IssuesCategory"
                                                className="form-control"
                                                value={form.IssuesCategory}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Customer">Customer</option>
                                                <option value="Internal">Internal</option>
                                                <option value="Technical">Technical</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Issues Name</label>
                                            <input
                                                type="text"
                                                name="IssuesName"
                                                className="form-control"
                                                placeholder="Enter Issue Name"
                                                value={form.IssuesName}
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
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label>Add Approval Role</label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value && !approvalFlow.includes(value)) {
                                                        setApprovalFlow([...approvalFlow, value]);
                                                    }
                                                }}
                                            >
                                                <option value="">Select Role</option>
                                                {rolesList.map((role, i) => (
                                                    <option key={i} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-3">
                                    <label><b>Approval Flow (Level Order)</b></label>

                                    {approvalFlow.length === 0 && (
                                        <div className="text-muted">No roles added</div>
                                    )}

                                    {approvalFlow.map((role, index) => (
                                        <div
                                            key={index}
                                            className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                                        >
                                            <span>
                                                <b>Level {index + 1}</b> - {role}
                                            </span>

                                            <div>
                                                {/* UP */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-light me-1"
                                                    disabled={index === 0}
                                                    onClick={() => {
                                                        const newFlow = [...approvalFlow];
                                                        [newFlow[index - 1], newFlow[index]] =
                                                            [newFlow[index], newFlow[index - 1]];
                                                        setApprovalFlow(newFlow);
                                                    }}
                                                >
                                                    ↑
                                                </button>

                                                {/* DOWN */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-light me-1"
                                                    disabled={index === approvalFlow.length - 1}
                                                    onClick={() => {
                                                        const newFlow = [...approvalFlow];
                                                        [newFlow[index + 1], newFlow[index]] =
                                                            [newFlow[index], newFlow[index + 1]];
                                                        setApprovalFlow(newFlow);
                                                    }}
                                                >
                                                    ↓
                                                </button>

                                                {/* REMOVE */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        setApprovalFlow(
                                                            approvalFlow.filter((_, i) => i !== index)
                                                        )
                                                    }
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
                                        navigate("/issues-department")
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
