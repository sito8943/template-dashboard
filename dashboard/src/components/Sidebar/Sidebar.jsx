import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faIndustry,
  faProjectDiagram,
  faHome,
  faUser,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// styles
import styles from "./styles.module.css";

function Sidebar() {
  const location = useLocation();

  const { languageState } = useLanguage();

  const icons = useMemo(
    () => ({
      home: faHome,
      users: faUser,
      settings: faGear,
      mipymes: faIndustry,
      projects: faProjectDiagram,
      events: faCalendar,
      logout: faArrowRightFromBracket,
    }),
    []
  );

  const printActions = useCallback(() => {
    const parsedLocation = location.pathname.split("/");
    return languageState.texts.sidebar.actions.map((action) => (
      <Link
        to={action.to}
        key={action.id}
        className={`${
          `/${parsedLocation[1]}` === action.to ||
          `/${parsedLocation[1]}/` === action.to
            ? "text-white bg-primary"
            : "dark:text-white hover:text-white hover:bg-primary"
        }  flex items-center gap-3 justify-start transition py-2 px-2`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <FontAwesomeIcon className="text-md" icon={icons[action.id]} />
        </div>
        <span>{action.label}</span>
      </Link>
    ));
  }, [languageState, icons, location]);

  return (
    <div className={`${styles.sidebar}`}>
      <div className={`${styles.header}`}>
        <Link to="/">
          <h2 className="ml-[8px]">Template Dashboard</h2>
        </Link>
      </div>
      <div className="flex flex-col">{printActions()}</div>
    </div>
  );
}

export default Sidebar;
