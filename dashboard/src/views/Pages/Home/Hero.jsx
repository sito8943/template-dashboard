import React, { useMemo } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function Hero() {
  const { languageState } = useLanguage();

  const { hero } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  return (
    <article id="hero">
      <h3>
        {hero.title}{" "}
        <span>
          <Tippy content={hero.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
        
      </h3>
    </article>
  );
}

export default Hero;
