import { useMemo } from "react";
import { Link } from "react-router-dom";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-regular-svg-icons";

function NotFound() {
  const { languageState } = useLanguage();
  const { buttons } = useMemo(() => {
    return { buttons: languageState.texts.buttons };
  }, [languageState]);

  return (
    <main className="w-full h-screen flex items-center justify-center flex-col gap-5">
      <FontAwesomeIcon
        icon={faSadTear}
        className="dark:text-white text-7xl appear"
      />
      <h2 className="text-center appear">404 - NOT FOUND</h2>
      <Link to="/" className="primary button appear">
        {buttons.goHome}
      </Link>
    </main>
  );
}

export default NotFound;
