import { useEffect, useState } from "react";
import { listPromotions, createPromotion, updatePromotion, listCampuses, listUsers } from "../api.js";

function toDateInputValue(value) {
  return value ? value.slice(0, 10) : "";
}

export default function Promotions({ onBack }) {
  const [promotions, setPromotions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [campusId, setCampusId] = useState("");
  const [managerUserId, setManagerUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCampusId, setEditCampusId] = useState("");
  const [editManagerUserId, setEditManagerUserId] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  const activeCampuses = campuses.filter((c) => c.isActive);
  const activeUsers = users.filter((u) => u.isActive);

  function loadAll() {
    setLoading(true);
    Promise.all([listPromotions(), listCampuses(), listUsers()])
      .then(([promos, camps, us]) => {
        setPromotions(promos);
        setCampuses(camps);
        setUsers(us);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createPromotion({
        name,
        campusId,
        managerUserId,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      setName("");
      setCampusId("");
      setManagerUserId("");
      setStartDate("");
      setEndDate("");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(promotion) {
    setEditingId(promotion.id);
    setEditName(promotion.name);
    setEditCampusId(promotion.campusId);
    setEditManagerUserId(promotion.managerUserId);
    setEditStartDate(toDateInputValue(promotion.startDate));
    setEditEndDate(toDateInputValue(promotion.endDate));
  }

  async function handleSaveEdit(id) {
    setError("");

    try {
      await updatePromotion(id, {
        name: editName,
        campusId: editCampusId,
        managerUserId: editManagerUserId,
        startDate: editStartDate || null,
        endDate: editEndDate || null,
      });
      setEditingId(null);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(promotion) {
    setError("");

    try {
      await updatePromotion(promotion.id, { isActive: !promotion.isActive });
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>Promotions</h1>
        <button onClick={onBack}>Retour</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleCreate} className="inline-form">
        <div className="field">
          <label htmlFor="name">Nom</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
          <label htmlFor="manager">Responsable</label>
          <select id="manager" value={managerUserId} onChange={(e) => setManagerUserId(e.target.value)} required>
            <option value="">-</option>
            {activeUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstname} {u.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="start">Début</label>
          <input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="end">Fin</label>
          <input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="submit">Ajouter</button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Campus</th>
              <th>Responsable</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                {editingId === promotion.id ? (
                  <>
                    <td>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </td>
                    <td>
                      <select value={editCampusId} onChange={(e) => setEditCampusId(e.target.value)}>
                        {activeCampuses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={editManagerUserId} onChange={(e) => setEditManagerUserId(e.target.value)}>
                        {activeUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.firstname} {u.lastname}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                    </td>
                    <td>
                      <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                    </td>
                    <td>{promotion.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => handleSaveEdit(promotion.id)}>Enregistrer</button>
                      <button onClick={() => setEditingId(null)}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{promotion.name}</td>
                    <td>{promotion.campus?.name}</td>
                    <td>
                      {promotion.manager?.firstname} {promotion.manager?.lastname}
                    </td>
                    <td>{toDateInputValue(promotion.startDate) || "-"}</td>
                    <td>{toDateInputValue(promotion.endDate) || "-"}</td>
                    <td>{promotion.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => startEdit(promotion)}>Modifier</button>
                      <button onClick={() => handleToggleActive(promotion)}>
                        {promotion.isActive ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
