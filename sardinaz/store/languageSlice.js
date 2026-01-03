import { createSlice } from "@reduxjs/toolkit";
import i18n from "../localization/i18n";

const normalizeLocale = (locale) => {
  if (locale.startsWith("zh")) {
    if (locale.includes("Hant")) return "zh-Hant";
    return "zh-Hans";
  }
  return "en";
};

const initialState = {
  locale: i18n.locale,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const normalized = normalizeLocale(action.payload);
      state.locale = normalized;
      i18n.locale = normalized;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
