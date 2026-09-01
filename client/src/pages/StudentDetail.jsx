import { useEffect, useState } from "react";
import { getStudent, updateStudent, listCampuses, listPromotions } from "../api.js";

export default function StudentDetail({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([getStudent(studentId), listCampuses(), listPromotions()])
      .then(([s, camps, promos]) => {
        setStudent(s);
        setForm(s);
        setCampuses(camps);
        setPromotions(promos);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [studentId]);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setHyppo(field, value) {
    setForm((prev) => ({
      ...prev,
      isHyppoAccepted: field === "isHyppoAccepted" ? value : value ? false : prev.isHyppoAccepted,
      isHyppoRefused: field === "isHyppoRefused" ? value : value ? false : prev.isHyppoRefused,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const updated = await updateStudent(studentId, {
        firstname: form.firstname,
        lastname: form.lastname,
        phone: form.phone || "",
        email: form.email || "",
        discordLogin: form.discordLogin || "",
        city: form.city || "",
        campusId: form.campusId,
        promotionId: form.promotionId,
        isAlerte: form.isAlerte,
        isAbandon: form.isAbandon,
        isHyppoAccepted: form.isHyppoAccepted,
        isHyppoRefused: form.isHyppoRefused,
        isFinancementOk: form.isFinancementOk,
        isAdminStatusOk: form.isAdminStatusOk,
        isMaterialSetupOk: form.isMaterialSetupOk,
        isEmployabilityInitialised: form.isEmployabilityInitialised,
      });
      setStudent(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <div className="page wide">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="page wide">
      <div className="top-bar">
        <h1>
          {student.firstname} {student.lastname}
        </h1>
        <button onClick={onBack}>Retour</button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSave}>
        <h2>Identité</h2>
        <div className="grid-form">
          <div className="field">
            <label>Prénom</label>
            <input value={form.firstname} onChange={(e) => setField("firstname", e.target.value)} required />
          </div>
          <div className="field">
            <label>Nom</label>
            <input value={form.lastname} onChange={(e) => setField("lastname", e.target.value)} required />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.phone || ""} onChange={(e) => setField("phone", e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email || ""} onChange={(e) => setField("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Discord</label>
            <input value={form.discordLogin || ""} onChange={(e) => setField("discordLogin", e.target.value)} />
          </div>
          <div className="field">
            <label>Ville</label>
            <input value={form.city || ""} onChange={(e) => setField("city", e.target.value)} />
          </div>
          <div className="field">
            <label>Campus</label>
            <select value={form.campusId} onChange={(e) => setField("campusId", e.target.value)} required>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Promotion</label>
            <select value={form.promotionId} onChange={(e) => setField("promotionId", e.target.value)} required>
              {promotions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2>Statut</h2>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={form.isAlerte}
              onChange={(e) => setField("isAlerte", e.target.checked)}
            />
            Alerte
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isAbandon}
              onChange={(e) => setField("isAbandon", e.target.checked)}
            />
            Abandon
          </label>
        </div>

        <h3>Hippocamp</h3>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={form.isHyppoAccepted}
              onChange={(e) => setHyppo("isHyppoAccepted", e.target.checked)}
            />
            Accepté
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isHyppoRefused}
              onChange={(e) => setHyppo("isHyppoRefused", e.target.checked)}
            />
            Refusé
          </label>
        </div>

        <h3>Onboarding</h3>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={form.isFinancementOk}
              onChange={(e) => setField("isFinancementOk", e.target.checked)}
            />
            Financement OK
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isAdminStatusOk}
              onChange={(e) => setField("isAdminStatusOk", e.target.checked)}
            />
            Administratif OK
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isMaterialSetupOk}
              onChange={(e) => setField("isMaterialSetupOk", e.target.checked)}
            />
            Matériel configuré
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isEmployabilityInitialised}
              onChange={(e) => setField("isEmployabilityInitialised", e.target.checked)}
            />
            Employabilité initialisée
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
