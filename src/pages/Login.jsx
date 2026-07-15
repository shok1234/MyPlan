import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Invalid email or password");
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>MyPlan</h1>
        <h2>Welcome Back</h2>
        <p>Organize your life smarter.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Login</h2>

          {errorMsg && (
            <p className="auth-error">{errorMsg}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>

          <p>
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}