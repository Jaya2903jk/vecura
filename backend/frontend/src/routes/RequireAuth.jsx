// src/routes/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function RequireAuth({ children }) {
    return isLoggedIn() ? children : <Navigate to="/" />;
}
