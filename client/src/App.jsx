import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Campuses from "./pages/Campuses.jsx";
import Users from "./pages/Users.jsx";
import Promotions from "./pages/Promotions.jsx";
import Students from "./pages/Students.jsx";
import StudentDetail from "./pages/StudentDetail.jsx";
import { getMe } from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState("home");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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

  if (view === "promotions") {
    return <Promotions onBack={() => setView("home")} />;
  }

  if (view === "students") {
    return (
      <Students
        onBack={() => setView("home")}
        onOpenStudent={(id) => {
          setSelectedStudentId(id);
          setView("studentDetail");
        }}
      />
    );
  }

  if (view === "studentDetail") {
    return <StudentDetail studentId={selectedStudentId} onBack={() => setView("students")} />;
  }

  return (
    <Home
      user={user}
      onLogout={handleLogout}
      onNavigateCampuses={() => setView("campuses")}
      onNavigateUsers={() => setView("users")}
      onNavigatePromotions={() => setView("promotions")}
      onNavigateStudents={() => setView("students")}
    />
  );
}
