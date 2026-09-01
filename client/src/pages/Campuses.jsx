import { useEffect, useState } from "react";
import { listCampuses, createCampus, updateCampus } from "../api.js";

export default function Campuses({ onBack }) {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");

  function loadCampuses() {
    setLoading(true);
    listCampuses()
      .then(setCampuses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadCampuses, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createCampus({ name, city });
      setName("");
      setCity("");
      loadCampuses();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(campus) {
    setEditingId(campus.id);
    setEditName(campus.name);
    setEditCity(campus.city || "");
  }

  async function handleSaveEdit(id) {
    setError("");

    try {
      await updateCampus(id, { name: editName, city: editCity });
      setEditingId(null);
      loadCampuses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(campus) {
    setError("");

    try {
      await updateCampus(campus.id, { isActive: !campus.isActive });
      loadCampuses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>Campus</h1>
        <button onClick={onBack}>Retour</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleCreate} className="inline-form">
        <div className="field">
          <label htmlFor="name">Nom</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="city">Ville</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
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
              <th>Ville</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campuses.map((campus) => (
              <tr key={campus.id}>
                {editingId === campus.id ? (
                  <>
                    <td>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </td>
                    <td>
                      <input value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                    </td>
                    <td>{campus.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => handleSaveEdit(campus.id)}>Enregistrer</button>
                      <button onClick={() => setEditingId(null)}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{campus.name}</td>
                    <td>{campus.city || "-"}</td>
                    <td>{campus.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => startEdit(campus)}>Modifier</button>
                      <button onClick={() => handleToggleActive(campus)}>
                        {campus.isActive ? "Désactiver" : "Activer"}
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
