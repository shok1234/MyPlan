import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Settings.css";
import { useTranslation } from "react-i18next";``


export default function Settings(){

const {theme,setTheme}=useContext(ThemeContext);

const { t, i18n } = useTranslation();


return (

<div className="settings-page">


<div className="settings-card">


<h2>
⚙ {t("settings")}
</h2>


{/* Language */}

<div className="settings-section">

<h3>
🌐 {t("language")}
</h3>


<select
value={i18n.language}
onChange={(e)=>i18n.changeLanguage(e.target.value)}
>

<option value="en">
English
</option>

<option value="ku">
Kurdish
</option>

</select>


</div>



<hr />



{/* Appearance */}

<div className="settings-section">


<h3>
🎨 {t("appearance")}
</h3>



<label className="theme-option">

<input
type="radio"
value="system"
checked={theme==="system"}
onChange={()=>setTheme("system")}
/>

System

</label>



<label className="theme-option">

<input
type="radio"
value="dark"
checked={theme==="dark"}
onChange={()=>setTheme("dark")}
/>

Dark

</label>



<label className="theme-option">

<input
type="radio"
value="light"
checked={theme==="light"}
onChange={()=>setTheme("light")}
/>

Light

</label>



</div>



<hr />



{/* About */}


<div className="settings-section">


<h3>
ℹ About
</h3>


<p>
MyPlan
</p>


<p>
Version 1.0.0
</p>


<p>
Developed by
<br/>
<strong>
Shokhan Yousif
</strong>
</p>


</div>



</div>


</div>


)

}