import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageProvider";

// contexts
import { useUser } from "../../contexts/UserProvider";

// components

function Home() {
  const navigate = useNavigate();

  const { userState } = useUser();
  const { languageState } = useLanguage();

  useEffect(() => {
    if (!userState.user) navigate("/auth/");
  });

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 flex flex-wrap gap-5">
      <h2>{languageState.texts.analytics.title}</h2>
    </main>
  );
}

export default Home;
