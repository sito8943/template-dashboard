import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);

  const fetch = useCallback(() => {}, []);

  useEffect(() => {
    // load all products and group by types
    fetch();
  }, []);

  const printProducts = useMemo(() => {}, [products]);
  const printTypes = useMemo(() => {}, []);

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
      <div className="flex gap-2">{printTypes}</div>
      <div className="flex gap-2">{printProducts}</div>
    </article>
  );
}

export default Hero;
