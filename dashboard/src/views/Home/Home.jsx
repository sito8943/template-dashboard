import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// contexts
import { useUser } from "../../contexts/UserProvider";
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import PieComponent from "./Anaylitics/PieComponent";

function Home() {
  const navigate = useNavigate();

  const { userState } = useUser();
  const { languageState } = useLanguage();

  useEffect(() => {
    if (!userState.user) navigate("/auth/");
  }, [userState]);

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 flex flex-col gap-5 relative">
      <h2>{languageState.texts.analytics.title}</h2>
      <PieComponent />
    </main>
  );
}

export default Home;
