import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    home: "Home",
    book: "Book Now",
  },
  zh: {
    home: "健身舱",
    book: "立即预订",
  }
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
