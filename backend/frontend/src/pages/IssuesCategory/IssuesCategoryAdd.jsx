
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IssuesMasterAdd() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({
        IssuesName: "",
        Status: "Active",
    });
    const [loading, setLoading] = useState(false);

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
    useEffect(() => {
        fetchDepartments();
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

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        setLoading(true);

        fetch("http://127.0.0.1:8000/api/issues-category", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                DepartmentId: form.DepartmentId,
                category_name: form.IssuesName,
                status: form.Status,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    setAlert({
                        show: true,
                        type: "success",
                        message: "Issues Category created successfully!",
                    });

                    setForm({ IssuesName: "", Status: "Active" });
                    // auto hide + redirect
                    setTimeout(() => {
                        setAlert({ show: false, type: "", message: "" });
                        navigate("/issues-category");
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
                <h3 class="fw-bold mb-3">Issues Category</h3>
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
                        <a href="#"> Issues Category</a>
                    </li>{" "}
                    <li class="separator">
                        {" "}
                        <i class="icon-arrow-right"></i>
                    </li>{" "}
                    <li class="nav-item">
                        {" "}
                        <a href="#">Add Issues Category</a>{" "}
                    </li>{" "}
                </ul>{" "}
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">
                                Add Issues Category
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
                                                onChange={handleChange}
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
                                            <label>Category Name</label>
                                            <input
                                                type="text"
                                                name="IssuesName"
                                                className="form-control"
                                                placeholder="Enter Category Name"
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
                                        navigate("/issues-category")
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
