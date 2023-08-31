import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// components
import Form from "./Form/Form";
import List from "../../components/List/List";
import ModelNavigator from "../../components/ModelNavigator/ModelNavigator";

function Users() {
  const location = useLocation();

  const { languageState } = useLanguage();

  const { users } = useMemo(() => {
    return {
      users: languageState.texts.users,
    };
  }, [languageState]);

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 relative overflow-auto">
      <h2>{users.title}</h2>
      <ModelNavigator collection="users" />
      {location.pathname === "/users/list" ||
      location.pathname === "/users/list/" ? (
        <List collection="users" />
      ) : (
        <Form />
      )}
    </main>
  );
}

export default Users;
