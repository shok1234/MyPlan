import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system"
  );


  useEffect(() => {

    const root = document.documentElement;

    if(theme === "dark"){
      root.setAttribute("data-theme","dark");
    }

    else if(theme === "light"){
      root.setAttribute("data-theme","light");
    }

    else {

      const dark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;


      root.setAttribute(
        "data-theme",
        dark ? "dark" : "light"
      );
    }


    localStorage.setItem("theme",theme);


  },[theme]);


  return (
    <ThemeContext.Provider value={{theme,setTheme}}>
      {children}
    </ThemeContext.Provider>
  );

}