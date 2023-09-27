import { Outlet, useParams } from "react-router-dom";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import Handler from "../../components/Error/Handler";
import ModelNavigator from "./components/ModelNavigator";

function Model() {
  const { collection } = useParams();

  const { languageState } = useLanguage();

  return (
    <main className="main-model bg-light-background dark:bg-dark-background w-full rounded-s-xl h-full p-5 relative overflow-auto">
      <h2>{languageState.texts[collection].title}</h2>
      <ModelNavigator collection={collection} />
      <Handler>
        <Outlet />
      </Handler>
    </main>
  );
}

export default Model;
