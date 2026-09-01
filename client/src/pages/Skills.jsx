import { useEffect, useState } from "react";
import { listSkills, createSkill, updateSkill } from "../api.js";

export default function Skills({ onBack }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function loadSkills() {
    setLoading(true);
    listSkills()
      .then(setSkills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadSkills, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createSkill({ name, description });
      setName("");
      setDescription("");
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(skill) {
    setEditingId(skill.id);
    setEditName(skill.name);
    setEditDescription(skill.description || "");
  }

  async function handleSaveEdit(id) {
    setError("");

    try {
      await updateSkill(id, { name: editName, description: editDescription });
      setEditingId(null);
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(skill) {
    setError("");

    try {
      await updateSkill(skill.id, { isActive: !skill.isActive });
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>Compétences</h1>
        <button onClick={onBack}>Retour</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleCreate} className="inline-form">
        <div className="field">
          <label htmlFor="name">Nom</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
              <th>Description</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                {editingId === skill.id ? (
                  <>
                    <td>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </td>
                    <td>
                      <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    </td>
                    <td>{skill.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => handleSaveEdit(skill.id)}>Enregistrer</button>
                      <button onClick={() => setEditingId(null)}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{skill.name}</td>
                    <td>{skill.description || "-"}</td>
                    <td>{skill.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => startEdit(skill)}>Modifier</button>
                      <button onClick={() => handleToggleActive(skill)}>
                        {skill.isActive ? "Désactiver" : "Activer"}
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
