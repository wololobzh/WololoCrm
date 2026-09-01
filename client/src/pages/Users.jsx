import { useEffect, useState } from "react";
import { listUsers, createUser, updateUser } from "../api.js";

const ROLES = ["ADMIN", "MANAGER", "USER"];

export default function Users({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [editingId, setEditingId] = useState(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("USER");

  function loadUsers() {
    setLoading(true);
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadUsers, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createUser({ firstname, lastname, email, password, role });
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setRole("USER");
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditFirstname(user.firstname);
    setEditLastname(user.lastname);
    setEditEmail(user.email);
    setEditRole(user.role);
  }

  async function handleSaveEdit(id) {
    setError("");

    try {
      await updateUser(id, {
        firstname: editFirstname,
        lastname: editLastname,
        email: editEmail,
        role: editRole,
      });
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(user) {
    setError("");

    try {
      await updateUser(user.id, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>Utilisateurs</h1>
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
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="role">Rôle</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {editingId === user.id ? (
                  <>
                    <td>
                      <input value={editFirstname} onChange={(e) => setEditFirstname(e.target.value)} />
                    </td>
                    <td>
                      <input value={editLastname} onChange={(e) => setEditLastname(e.target.value)} />
                    </td>
                    <td>
                      <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                    </td>
                    <td>
                      <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{user.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => handleSaveEdit(user.id)}>Enregistrer</button>
                      <button onClick={() => setEditingId(null)}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <button onClick={() => startEdit(user)}>Modifier</button>
                      <button onClick={() => handleToggleActive(user)}>
                        {user.isActive ? "Désactiver" : "Activer"}
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
