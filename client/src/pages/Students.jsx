import { useEffect, useState } from "react";
import { listStudents, createStudent, listCampuses, listPromotions } from "../api.js";

export default function Students({ onOpenStudent, onBack }) {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterCampusId, setFilterCampusId] = useState("");
  const [filterPromotionId, setFilterPromotionId] = useState("");
  const [search, setSearch] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [campusId, setCampusId] = useState("");
  const [promotionId, setPromotionId] = useState("");

  const activeCampuses = campuses.filter((c) => c.isActive);
  const activePromotions = promotions.filter((p) => p.isActive);

  function loadStudents() {
    setLoading(true);
    listStudents({ campusId: filterCampusId, promotionId: filterPromotionId, search })
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    Promise.all([listCampuses(), listPromotions()])
      .then(([camps, promos]) => {
        setCampuses(camps);
        setPromotions(promos);
      })
      .catch((err) => setError(err.message));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadStudents, [filterCampusId, filterPromotionId, search]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createStudent({ firstname, lastname, email, campusId, promotionId });
      setFirstname("");
      setLastname("");
      setEmail("");
      setCampusId("");
      setPromotionId("");
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>Apprenants</h1>
        <button onClick={onBack}>Retour</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleCreate} className="inline-form">
        <div className="field">
          <label htmlFor="firstname">Prénom</label>
          <input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="lastname">Nom</label>
          <input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="campus">Campus</label>
          <select id="campus" value={campusId} onChange={(e) => setCampusId(e.target.value)} required>
            <option value="">-</option>
            {activeCampuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="promotion">Promotion</label>
          <select id="promotion" value={promotionId} onChange={(e) => setPromotionId(e.target.value)} required>
            <option value="">-</option>
            {activePromotions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </form>

      <div className="inline-form">
        <div className="field">
          <label htmlFor="filterCampus">Filtre campus</label>
          <select id="filterCampus" value={filterCampusId} onChange={(e) => setFilterCampusId(e.target.value)}>
            <option value="">Tous</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filterPromotion">Filtre promotion</label>
          <select
            id="filterPromotion"
            value={filterPromotionId}
            onChange={(e) => setFilterPromotionId(e.target.value)}
          >
            <option value="">Toutes</option>
            {promotions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="search">Recherche</label>
          <input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, prénom, email"
          />
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Campus</th>
              <th>Promotion</th>
              <th>Alerte</th>
              <th>Abandon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.lastname}</td>
                <td>{student.firstname}</td>
                <td>{student.email || "-"}</td>
                <td>{student.campus?.name}</td>
                <td>{student.promotion?.name}</td>
                <td>{student.isAlerte ? "Oui" : "Non"}</td>
                <td>{student.isAbandon ? "Oui" : "Non"}</td>
                <td>
                  <button onClick={() => onOpenStudent(student.id)}>Ouvrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
