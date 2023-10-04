import { useMemo } from "react";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import Photo from "./Forms/Photo";
import Security from "./Forms/Security";
import Attribute from "./Forms/Attribute";

function Settings() {
  const { languageState } = useLanguage();

  const settings = useMemo(() => languageState.texts.settings, [languageState]);

  return (
    <main className="main-model dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 relative overflow-auto flex flex-col gap-10">
      <h2 className="text-4xl">{settings.title}</h2>
      <Photo />
      <Attribute attribute="email" />
      <Security />
    </main>
  );
}

export default Settings;
