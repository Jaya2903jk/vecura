import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketAdd() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        department: "",
        level1: "",
        subject: "",
        priority: "",
        description: "",
        file: null
    });

    const [loading, setLoading] = useState(false);

    // handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // handle file
    const handleFile = (e) => {
        setForm({ ...form, file: e.target.files[0] });
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

        fetch("http://127.0.0.1:8000/api/tickets", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);

                if (data.status) {
                    alert("Ticket created successfully ✅");
                    navigate("/tickets");
                } else {
                    alert("Error creating ticket ❌");
                }
            })
            .catch(() => {
                setLoading(false);
                alert("Something went wrong ❌");
            });
    };

    return (
        <div className="page-inner">

            {/* Header */}
            <div class="page-header">
              <h3 class="fw-bold mb-3">Ticket</h3>
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
                  <a href="#">Ticket</a>
                </li>
                <li class="separator">
                  <i class="icon-arrow-right"></i>
                </li>
                <li class="nav-item">
                  <a href="#">Raise Ticket</a>
                </li>
              </ul>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">

                        <div className="card-header">
                            <div className="card-title">Raise Ticket</div>
                        </div>

                        {/* FORM START */}
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            className="form-control"
                                            value={form.department}
                                            onChange={handleChange}
                                            placeholder="Enter department"
                                            required
                                        />
                                    </div>

                                    {/* Level */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Category / Level</label>
                                        <input
                                            type="text"
                                            name="level1"
                                            className="form-control"
                                            value={form.level1}
                                            onChange={handleChange}
                                            placeholder="Enter issue category"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="Brief subject of the issue"
                                            required
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Priority</label>
                                        <select
                                            name="priority"
                                            className="form-control"
                                            value={form.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>

                                        {/* Selected Badge Preview */}
                                        {/* {form.priority && (
                                            <div className="mt-2">
                                                <span className={`badge
                ${form.priority === "Low" ? "bg-success" : ""}
                ${form.priority === "Medium" ? "bg-warning text-dark" : ""}
                ${form.priority === "High" ? "bg-danger" : ""}
            `}>
                                                    {form.priority} Priority
                                                </span>
                                            </div>
                                        )} */}
                                    </div>

                                    {/* File Upload */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Attachment</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleFile}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="5"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Describe your issue in detail..."
                                        ></textarea>
                                    </div>


                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="card-action">
                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => navigate("/ticket")}
                                >
                                    Cancel
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
