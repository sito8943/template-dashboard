import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function About() {
  const { languageState } = useLanguage();

  const { about } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const fetch = useCallback(() => {}, []);

  useEffect(() => {
    // load image and text
    fetch();
  }, []);

  return (
    <article id="about">
      <h3>
        {about.title}{" "}
        <span>
          <Tippy content={about.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
      </h3>
    </article>
  );
}

export default About;
