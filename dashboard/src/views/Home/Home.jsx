import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// contexts
import { useUser } from "../../contexts/UserProvider";

// components

function Home() {
  const navigate = useNavigate();

  const { userState } = useUser();

  useEffect(() => {
    if (!userState.user) navigate("/auth/");
  });

  return (
    <main className="dark:bg-dark-background bg-light-background w-full rounded-s-xl h-full p-5 flex flex-wrap gap-5"></main>
  );
}

export default Home;
