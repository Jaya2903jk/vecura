// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function TicketAdd() {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({
//         DepartmentName: "",
//     });

//     const [loading, setLoading] = useState(false);

//     // handle input
//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value
//         });
//     };

//     // submit
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const token = localStorage.getItem("token");

//         setLoading(true);

//         fetch("http://127.0.0.1:8000/api/issue-departments", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//                 Accept: "application/json"
//             },
//             body: JSON.stringify({
//                 DepartmentName: form.DepartmentName
//             }),
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setLoading(false);

//                 if (data.status) {
//                     alert("Department created successfully");
//                     navigate("/issue-departments");
//                 } else {
//                     alert("Error creating department");
//                 }
//             })
//             .catch(() => {
//                 setLoading(false);
//                 alert("Something went wrong");
//             });
//     };

//         return (
//             <div className="page-inner">
//                 {/* Header */}
//                 <div class="page-header">
//                     <h3 class="fw-bold mb-3">Ticket Department</h3>
//                     <ul class="breadcrumbs mb-3">
//                         <li class="nav-home">
//                             <a href="#">
//                                 <i class="icon-home"></i>
//                             </a>
//                         </li>
//                         <li class="separator">
//                             <i class="icon-arrow-right"></i>
//                         </li>
//                         <li class="nav-item">
//                             <a href="#"> Ticket Department</a>
//                         </li>
//                         <li class="separator">
//                             <i class="icon-arrow-right"></i>
//                         </li>
//                         <li class="nav-item">
//                             <a href="#">Add Ticket Department</a>
//                         </li>
//                     </ul>
//                 </div>

//                 <div className="row">
//                     <div className="col-md-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <div className="card-title">Add Ticket Department</div>
//                             </div>
//                             <form onSubmit={handleSubmit}>
//                                 <div className="card-body">
//                                     <div className="row">
//                                         <div class="col-md-6 col-lg-4">
//                                             <div class="form-group">
//                                                 <label for="email2">Department Name</label>
//                                                 <input
//                                                     type="text"
//                                                     name="DepartmentName"
//                                                     className="form-control"
//                                                     id="email2"
//                                                     placeholder="Enter Department Name"
//                                                     value={form.DepartmentName}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="card-action">
//                                     <button
//                                         type="submit"
//                                         className="btn btn-premium  me-2"
//                                         disabled={loading}
//                                     >
//                                         {loading ? "Submitting..." : "Submit"}
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-danger"
//                                         onClick={() => navigate("/issues-department")}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                             {/* FORM END */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketAdd() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        DepartmentName: "",
    });

    const [loading, setLoading] = useState(false);

    // ✅ Alert state
    const [alert, setAlert] = useState({
        show: false,
        type: "", // success | danger
        message: ""
    });

    // handle input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
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
                Accept: "application/json"
            },
            body: JSON.stringify({
                DepartmentName: form.DepartmentName
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    // ✅ Success
                    setAlert({
                        show: true,
                        type: "success",
                        message: "Department created successfully!"
                    });

                    setForm({ DepartmentName: "" });

                    // auto hide + redirect
                    setTimeout(() => {
                        setAlert({ show: false, type: "", message: "" });
                        navigate("/issue-departments");
                    }, 2000);

                } else {
                    // ❌ API error
                    setAlert({
                        show: true,
                        type: "danger",
                        message: data.message || "Error creating department"
                    });
                }
            })
            .catch(() => {
                setLoading(false);

                // ❌ Network error
                setAlert({
                    show: true,
                    type: "danger",
                    message: "Something went wrong!"
                });
            });
    };

    return (
        <div className="page-inner">

            {/* Header */}
            <div class="page-header">
                <h3 class="fw-bold mb-3">Ticket Department</h3><ul class="breadcrumbs mb-3">
                    <li class="nav-home">
                        <a href="#">                                 <i class="icon-home"></i>
                        </a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>                         <li class="nav-item">
                        <a href="#"> Ticket Department</a>
                    </li>                         <li class="separator">                             <i class="icon-arrow-right"></i>
                    </li>                         <li class="nav-item">                             <a href="#">Add Ticket Department</a>                         </li>                     </ul>                 </div>


            <div className="row">
                <div className="col-md-12">
                    <div className="card">

                        <div className="card-header">
                            <div className="card-title">Add Ticket Department</div>
                        </div>
                        {alert.show && alert.type === "success" && (
                            <div className="m-3 p-3 border-start border-5 border-success bg-light rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-check-circle-fill text-success me-2 fs-4"></i>
                                    <div>
                                        <strong className="text-success">Success!</strong>
                                        <div>{alert.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto"
                                        onClick={() => setAlert({ ...alert, show: false })}
                                    ></button>
                                </div>
                            </div>
                        )}

                        {alert.show && alert.type === "danger" && (
                            <div className="m-3 p-3 border-start border-5 border-danger bg-light rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-x-circle-fill text-danger me-2 fs-4"></i>
                                    <div>
                                        <strong className="text-danger">Error!</strong>
                                        <div>{alert.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto"
                                        onClick={() => setAlert({ ...alert, show: false })}
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
                                    onClick={() => navigate("/issues-department")}
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
