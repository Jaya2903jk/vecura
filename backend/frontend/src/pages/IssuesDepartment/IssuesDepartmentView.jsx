import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ticket.css";

export default function TicketAdd() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({
        department: "",
        level1: "",
        subject: "",
        priority: "",
        description: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);
    // handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key]) {
                formData.append(key, form[key]);
            }
        });

        setLoading(true);

        fetch("http://127.0.0.1:8000/api/issue-departments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    alert("Issue department created successfully ");
                    navigate("/issue-departments");
                } else {
                    alert("Error creating issue department ");
                }
            })
            .catch(() => {
                setLoading(false);
                alert("Something went wrong ");
            });
    };

    return (
        <div className="page-inner">
            {/* Header */}
            <div class="page-header">
                <h3 class="fw-bold mb-3">Ticket Department</h3>
                <ul class="breadcrumbs mb-3">
                    <li class="nav-home">
                        <a href="#">
                            <i class="icon-home"></i>
                        </a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>
                    <li class="nav-item">
                        <a href="#"> Ticket Department</a>
                    </li>
                    <li class="separator">
                        <i class="icon-arrow-right"></i>
                    </li>
                    <li class="nav-item">
                        <a href="#">View Ticket Department</a>
                    </li>
                </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">View Ticket Department</div>
                        </div>

                        {/* FORM START */}
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div class="row">
                                    <div class="col-md-6 col-lg-4">
                                        <div class="form-group">
                                            <label for="email2">Department Name</label>
                                            <input
                                                type="email"
                                                class="form-control"
                                                id="email2"
                                                placeholder="Enter Department Name"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-lg-4">
                                        <div class="form-group">
                                            <label for="email2">Department Name</label>
                                            <input
                                                type="email"
                                                class="form-control"
                                                id="email2"
                                                placeholder="Enter Department Name"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* Buttons */}
                            <div className="card-action">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => navigate("/issues-department")}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                        {/* FORM END */}
                    </div>
                </div>
            </div>
        </div>
    );
}
