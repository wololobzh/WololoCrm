import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { getMe } from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

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
  }

  if (checking) {
    return <div className="page">Chargement...</div>;
  }

  if (!user) {
    return <Login onLoggedIn={setUser} />;
  }

  return <Home user={user} onLogout={handleLogout} />;
}
