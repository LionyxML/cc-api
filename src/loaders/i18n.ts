import { I18n } from "i18n";
import path from "path";

const i18n = new I18n();
i18n.configure({
  locales: ["en", "pt"],
  defaultLocale: process.env.LOCALE || "en",
  directory: path.join("./", "./src/locales"),
});

export default i18n.__;
