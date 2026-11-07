import React from "react";
import { useState } from "react";
import "./Login.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const { loading, handlelogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handlelogin(email, password);
            toast.success("Login successful! 👋");
            navigate("/");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit ={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>

              <p>
                Don't have an account?{" "}
                <Link to="/Register">Register</Link>
            </p>
        </div>
    );
}

export default Login;