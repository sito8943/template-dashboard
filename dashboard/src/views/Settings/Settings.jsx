import { useMemo } from "react";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import Security from "./Forms/Security";
import Attribute from "./Forms/Attribute";

function Settings() {
  const { languageState } = useLanguage();

  const settings = useMemo(() => languageState.texts.settings, [languageState]);

  return (
    <div className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 relative overflow-auto">
      <h2>{settings.title}</h2>
      <Attribute attribute="email" />
      <Security />
    </div>
  );
}

export default Settings;
