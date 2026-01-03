import { useSelector } from "react-redux";
import i18n from "./i18n";

export function useTranslate() {
  const locale = useSelector((state) => state.language.locale);

  // Force i18n to use Redux locale
  i18n.locale = locale;

  return (key, params) => i18n.t(key, params);
}
