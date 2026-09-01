import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Campuses from "./pages/Campuses.jsx";
import Users from "./pages/Users.jsx";
import { getMe } from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChecking(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setChecking(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setView("home");
  }

  if (checking) {
    return <div className="page">Chargement...</div>;
  }

  if (!user) {
    return <Login onLoggedIn={setUser} />;
  }

  if (view === "campuses") {
    return <Campuses onBack={() => setView("home")} />;
  }

  if (view === "users") {
    return <Users onBack={() => setView("home")} />;
  }

  return (
    <Home
      user={user}
      onLogout={handleLogout}
      onNavigateCampuses={() => setView("campuses")}
      onNavigateUsers={() => setView("users")}
    />
  );
}
