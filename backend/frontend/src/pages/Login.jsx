
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // small smooth delay for UX
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e6f7ff, #f5fff9)",
      }}
    >
      {/* FULL SCREEN LOADER */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 fw-medium">Signing you in...</p>
          </div>
        </div>
      )}

      {/* LOGIN CARD */}
      <div
        className="p-4 shadow-lg"
        style={{
          width: "380px",
          borderRadius: "16px",
          background: "#ffffff",
          border: "1px solid #e8f0fe",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "#e6f7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              color: "#0d6efd",
              fontWeight: "bold",
            }}
          >
            V
          </div>

          <h4 className="mt-3 mb-1" style={{ fontWeight: 600 }}>
            Vecura Wellness
          </h4>
          <p className="text-muted" style={{ fontSize: "13px" }}>
            Medical Appointment & Wellness Portal
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: "13px" }}>
            {error}
          </div>
        )}

        {/* INPUTS */}
        <input
          className="form-control mb-3"
          placeholder="User ID / User Code"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={{ borderRadius: "10px", height: "45px" }}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderRadius: "10px", height: "45px" }}
        />

        {/* BUTTON */}
        <button
          className="btn w-100"
          onClick={handleLogin}
          disabled={loading}
          style={{
            height: "45px",
            borderRadius: "10px",
            background: "#0d6efd",
            fontWeight: 500,
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p
          className="text-center mt-3 mb-0 text-muted"
          style={{ fontSize: "12px" }}
        >
          © {new Date().getFullYear()} Vecura Wellness
        </p>
      </div>
    </div>
  );
}
