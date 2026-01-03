import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import translations from "./translations";

// Normalize device locale → translation locale
const normalizeLocale = (locale) => {
  if (!locale) return "en";

  if (locale.startsWith("zh")) {
    if (locale.includes("HK") || locale.includes("TW") || locale.includes("Hant")) {
      return "zh-Hant";
    }
    return "zh-Hans";
  }

  return "en";
};

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.locale = normalizeLocale(Localization.locale);

export default i18n;
