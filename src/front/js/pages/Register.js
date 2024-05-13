import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (email, password) => {
        console.log(email, password)
        const resp = await fetch(process.env.BACKEND_URL + "/api/register", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "password": password })
        });
        console.log(resp);
        if (!resp.ok) throw Error("There was a problem in the signup request");

        const data = await resp.json();
        navigate("/login");
        return data;
    };

    return (
        <div className="auth-container">
            <div className="container form-body">
                <h1 className="title">Create your account</h1>
                <div className="input-group">
                    <label className="label-form" htmlFor="email">E-mail</label>
                    <input
                        type="text"
                        id="email"
                        className="input-form"
                        placeholder="Enter e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="label-form" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="input-form"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => handleSubmit(email, password)}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Register;
