import { useState } from "react";
import StudentBoard from "../components/StudentBoard";
import SoftwareBoard from "../components/SoftwareBoard";
import DesignBoard from "../components/DesignBoard";
import CustomBoard from "../components/CustomBoard";
import { useTranslation } from "react-i18next";

import "../styles/Home.css";

export default function Home() {
  const [category, setCategory] = useState("student");
  const { t } = useTranslation();

  return (
    <div className="home">
      <h1 className="title">{t("dashboard")}</h1>

      <div className="cards">
        <div
          className={`card ${category === "student" ? "active" : ""}`}
          onClick={() => setCategory("student")}
        >
          🎓 <h3>{t("student")}</h3>
        </div>

        <div
          className={`card ${category === "software" ? "active" : ""}`}
          onClick={() => setCategory("software")}
        >
          💻 <h3>{t("software")}</h3>
        </div>

        <div
          className={`card ${category === "design" ? "active" : ""}`}
          onClick={() => setCategory("design")}
        >
          🎨 <h3>{t("design")}</h3>
        </div>

        <div
          className={`card ${category === "custom" ? "active" : ""}`}
          onClick={() => setCategory("custom")}
        >
          ⚙️ <h3>{t("custom")}</h3>
        </div>
      </div>

      <div className="board">
        {category === "student" && <StudentBoard />}
        {category === "software" && <SoftwareBoard />}
        {category === "design" && <DesignBoard />}
        {category === "custom" && <CustomBoard />}
      </div>
    </div>
  );
}