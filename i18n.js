import { I18n } from "i18n-js";

import en from "./locales/en";
import ro from "./locales/ro";

// Set the key-value pairs for the different languages
const translations = {
  en,
  ro,
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = "ro";
i18n.enableFallback = true;

export default i18n;
