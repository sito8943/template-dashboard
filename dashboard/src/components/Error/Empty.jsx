import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

function Empty() {
  const { languageState } = useLanguage();

  return (
    <div className="flex flex-col w-full min-h-[150px] h-full items-center justify-center gap-3">
      <h3>{languageState.texts.empty.title}</h3>
      <FontAwesomeIcon className="dark:text-white text-4xl" icon={faSadTear} />
    </div>
  );
}

export default Empty;
