import React, { useMemo } from "react";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

function Pages() {
  const { languageState } = useLanguage();

  const { pages } = useMemo(() => languageState, [languageState]);

  return (
    <section>
      <h2 className="text-4xl"></h2>
    </section>
  );
}

export default Pages;
