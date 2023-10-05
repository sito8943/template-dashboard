import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

function Features() {
  const { languageState } = useLanguage();

  const { features } = useMemo(
    () => languageState.texts.pages.home,
    [languageState]
  );

  const [allFeatures, setAllFeatures] = useState([]);

  const fetch = useCallback(() => {}, []);

  useEffect(() => {
    // load features
    fetch();
  }, []);

  const printFeatures = useMemo(() => {}, [allFeatures]);

  return (
    <article id="features">
      <h3>
        {features.title}{" "}
        <span>
          <Tippy content={features.description}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tippy>
        </span>
      </h3>
      <div className="flex gap-2">{printFeatures}</div>
    </article>
  );
}

export default Features;
