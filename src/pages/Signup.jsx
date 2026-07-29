import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styles/Auth.css";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { t } = useTranslation();

  const handleSignup = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg(t("auth.accountCreated"));
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1>MyPlan</h1>
        <h2>{t("auth.startPlanning")}</h2>

        <p>
         {t("auth.buildHabits")}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>{t("auth.createAccount")}</h2>

          {errorMsg && (
            <p className="auth-error">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="auth-success">{successMsg}</p>
          )}

          <input
            type="text"
            placeholder={t("auth.fullName")}
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={handleSignup}>
            {t("auth.signup")}
          </button>

          <p>
            {t("auth.haveAccount")}{" "}
            <Link to="/login">{t("auth.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}