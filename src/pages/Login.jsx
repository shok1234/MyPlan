import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/Auth.css";
import { useTranslation } from "react-i18next";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const login = async () => {
    
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(t("auth.invalidLogin"));
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>MyPlan</h1>
        <h2>{t("auth.welcomeBack")}</h2>
        <p>{t("auth.organizeLife")}</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{t("auth.login")}</h2>

          {errorMsg && (
            <p className="auth-error">{errorMsg}</p>
          )}

          <input
            type="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>
            {t("auth.login")}
          </button>

          <p>
            {t("auth.noAccount")} <Link to="/signup">{t("auth.signup")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}