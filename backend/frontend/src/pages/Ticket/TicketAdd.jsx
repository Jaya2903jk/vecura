import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ticket.css";

export default function TicketAdd() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");

    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [issues, setIssues] = useState([]);
    const [form, setForm] = useState({
        department: "",
        level1: "",
        subject: "",
        priority: "",
        description: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);

    const [customerSearch, setCustomerSearch] = useState("");
    const [customerResults, setCustomerResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [serviceSearch, setServiceSearch] = useState("");
    const [serviceResults, setServiceResults] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const [qty, setQty] = useState(1);
    const [discount, setDiscount] = useState(0);

    const [serviceList, setServiceList] = useState([]);
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

    const handleCustomerSearch = async (value) => {
        setCustomerSearch(value);

        if (value.length < 2) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://127.0.0.1:8000/api/customers/search?search=${value}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const data = await res.json();
        if (data.status) setCustomerResults(data.data);
    };
    const handleServiceSearch = async (value) => {
        setServiceSearch(value);

        if (value.length < 2) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://127.0.0.1:8000/api/search-service?search=${value}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const data = await res.json();
        if (data.status) setServiceResults(data.data);
    };

    // handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // handle file
    const handleFile = (e) => {
        setForm({ ...form, file: e.target.files[0] });
    };
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:8000/api/departments", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) setDepartments(data.data);
            })
            .catch((err) => console.log(err));
    }, []);
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
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);

                if (data.status) {
                    alert("Ticket created successfully ");
                    navigate("/tickets");
                } else {
                    alert("Error creating ticket ");
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
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label fw-semibold">Department Name <span className="text-danger">*</span></label>
                                            <select
                                                name="DepartmentId"
                                                className="form-control"
                                                value={form.DepartmentId}
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
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Issue Category <span className="text-danger">*</span></label>
                                        <select
                                            name="category"
                                            className="form-control"
                                            value={form.category}
                                            onChange={(e) => {
                                                const categoryId = e.target.value;
                                                setForm({ ...form, category: categoryId, issue: "" });

                                                if (!categoryId) {
                                                    setIssues([]);
                                                    return;
                                                }
                                                const token = localStorage.getItem("token");
                                                fetch(`http://127.0.0.1:8000/api/issues/${categoryId}`, {
                                                    method: "GET",
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                        Accept: "application/json",
                                                    },
                                                })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        if (data.status) setIssues(data.data);
                                                    })
                                                    .catch(err => console.log(err));
                                            }}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.category_id} value={cat.category_id}>
                                                    {cat.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Issue Name <span className="text-danger">*</span></label>
                                        <select
                                            name="issue"
                                            className="form-control"
                                            value={form.issue}
                                            onChange={(e) => setForm({ ...form, issue: e.target.value })}
                                        >
                                            <option value="">Select Issue</option>
                                            {issues.map((iss) => (
                                                <option key={iss.IssueId} value={iss.IssueId}>
                                                    {iss.IssueName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <label className="form-label fw-semibold">Source<span className="text-danger">*</span></label>
                                        <select name="Source" id="Source" className="form-control">
                                            <option value="">Select Any One</option>
                                            <option value="Direct">InBound Call</option>
                                            <option value="Mail">Mail</option>
                                            <option value="Branch">Branch</option>
                                            <option value="Self">OutBound Call</option>
                                            <option value="Legal">Legal Notice</option>
                                            <option value="Consumer">Consumer Forum</option>
                                            <option value="SocialMedia">Social Media</option>
                                            <option value="Help Line">Help Line</option>
                                            <option value="Whatsapp Chat">Whatsapp Chat</option>
                                            <option value="Spark Team">Spark Team</option>
                                            <option value="Call center team">Call center team</option>
                                            <option value="Google Review">Google Review</option>
                                        </select>
                                    </div>
                                    {/* <div className="col-md-4">
                                        <label className="form-label fw-semibold">Subject of Issue</label>
                                        <select
                                            name="level1"
                                            className="form-control"
                                            value={form.level1}
                                            onChange={(e) => setForm({ ...form, level1: e.target.value })}
                                        >
                                            <option value="">Select Level</option>
                                            {levels.map((lvl, idx) => (
                                                <option key={idx} value={lvl.label}>
                                                    {lvl.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                    {form.level1 && (
                                        <>
                                            <div className="col-md-4 position-relative">
                                                <label className="form-label fw-semibold">Customer</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search Customer..."
                                                        value={selectedCustomer ? `${selectedCustomer.RegistrationNo} - ${selectedCustomer.FirstName}` : customerSearch}
                                                        onChange={(e) => !selectedCustomer && handleCustomerSearch(e.target.value)}
                                                        disabled={!!selectedCustomer}
                                                    />
                                                    {selectedCustomer && (
                                                        <button
                                                            className="btn btn-danger"
                                                            type="button"
                                                            onClick={() => {
                                                                setCustomerSearch("");
                                                                setSelectedCustomer(null);
                                                                setCustomerResults([]);
                                                                setForm({ ...form, customer_id: "" });
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                {!selectedCustomer && customerResults.length > 0 && (
                                                    <ul className="list-group w-100 custom-dropdown mt-1">
                                                        {customerResults.map((c) => (
                                                            <li
                                                                key={c.id}
                                                                className="list-group-item d-flex justify-content-between align-items-center custom-item"
                                                                onClick={() => {
                                                                    setSelectedCustomer(c);
                                                                    setCustomerSearch(`${c.RegistrationNo} - ${c.FirstName}`);
                                                                    setCustomerResults([]);
                                                                    setForm({ ...form, customer_id: c.id });
                                                                }}
                                                            >
                                                                {c.RegistrationNo} - {c.FirstName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="col-md-4 mt-3 position-relative">
                                                <label className="form-label fw-semibold">Service</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search Service..."
                                                        value={selectedService ? selectedService.ServiceName : serviceSearch}
                                                        onChange={(e) => !selectedService && handleServiceSearch(e.target.value)}
                                                        disabled={!!selectedService}
                                                    />
                                                    {selectedService && (
                                                        <button
                                                            className="btn btn-danger"
                                                            type="button"
                                                            onClick={() => {
                                                                setServiceSearch("");
                                                                setSelectedService(null);
                                                                setServiceResults([]);
                                                                setForm({ ...form, service_id: "" });
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                {!selectedService && serviceResults.length > 0 && (
                                                    <ul className="list-group w-100 custom-dropdown mt-1">
                                                        {serviceResults.map((s) => (
                                                            <li
                                                                key={s.id}
                                                                className="list-group-item d-flex justify-content-between align-items-center custom-item"
                                                                onClick={() => {
                                                                    setSelectedService(s);
                                                                    setServiceSearch(s.ServiceName);
                                                                    setServiceResults([]);
                                                                    setForm({ ...form, service_id: s.id });
                                                                }}
                                                            >
                                                                {s.ServiceName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="col-md-4 mt-3">
                                                <label className="form-label fw-semibold">Payment Mode</label>
                                                <select
                                                    name="paymentMode"
                                                    className="form-control"
                                                    value={form.paymentMode}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Payment Mode</option>
                                                    <option value="non_loan">Cash | Card | Online</option>
                                                    <option value="loan">Loan</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4 mt-3">
                                                <label className="form-label fw-semibold">Quantity</label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    className="form-control"
                                                    value={form.quantity || ""}
                                                    onChange={handleChange}
                                                    min="1"
                                                    placeholder="Enter quantity"
                                                />
                                            </div>
                                            <div className="col-md-4 mt-3">
                                                <label className="form-label fw-semibold">Discount (%)</label>
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    className="form-control"
                                                    value={form.discount || ""}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="100"
                                                    placeholder="Enter discount percentage"
                                                />
                                            </div>

                                        </>
                                    )}

                                    {/* <div className="col-md-4 mt-3">
                                        <label className="form-label fw-semibold">Priority<span className="text-danger">*</span></label>
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
                                    </div> */}
                                    {/* File Upload */}
                                    <div className="col-md-4 mt-3">
                                        <label className="form-label fw-semibold">Attachment</label>
                                        <input type="file" className="form-control" onChange={handleFile} />
                                    </div>

                                    {/* Description (full-width) */}
                                    <div className="col-md-12 mt-3">
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
                                    className="btn btn-premium  me-2"
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
