import { I18n } from "i18n-js";

import en from "./locales/en";
import roCommon from "./locales/ro/common";
import roLogin from "./locales/ro/login";
import roAddProfile from "./locales/ro/profile";
import roResetPassword from "./locales/ro/resetPassword";
import roSignUp from "./locales/ro/signUp";

// Set the key-value pairs for the different languages
const translations = {
  en,
  ro: {
    login: roLogin,
    resetPassword: roResetPassword,
    signUp: roSignUp,
    common: roCommon,
    profile: roAddProfile,
  },
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = "ro";
i18n.enableFallback = true;

export default i18n;
