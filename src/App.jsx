import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./services/supabaseClient";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


import "./App.css";

export default function App() {
  const [open, setOpen] = useState(true);
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "system"
);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("SESSION:", session);
  useEffect(() => {

  let appliedTheme = theme;

  if (theme === "system") {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    appliedTheme = systemDark ? "dark" : "light";
  }


  document.documentElement.dataset.theme = appliedTheme;


  localStorage.setItem(
    "theme",
    theme
  );


}, [theme]);
 useEffect(() => {

    if (theme !== "system") return;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const update = () => {
      document.documentElement.dataset.theme =
        media.matches ? "dark" : "light";
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };

  }, [theme]);

  // Not logged in
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  

  // Logged in
  return (
    <div className="app">
      <Sidebar open={open} setOpen={setOpen} />

      <main className={`main ${open ? "open" : "closed"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}