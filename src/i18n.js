import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import ku from "./locales/ku/translation.json";


i18n
.use(initReactI18next)
.init({

resources: {
  en: {
    translation: en,
  },

  ku: {
    translation: ku,
  },
},


lng: localStorage.getItem("language") || "en",

fallbackLng: "en",


interpolation: {
  escapeValue: false,
},


});


// Change direction immediately when language changes
i18n.on("languageChanged", (lng)=>{

  localStorage.setItem("language", lng);


  if(lng === "ku"){
    document.documentElement.dir = "rtl";
  }
  else{
    document.documentElement.dir = "ltr";
  }

});


// Set initial direction when app starts
if(i18n.language === "ku"){
  document.documentElement.dir = "rtl";
}
else{
  document.documentElement.dir = "ltr";
}


export default i18n;