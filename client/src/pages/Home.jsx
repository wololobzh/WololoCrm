export default function Home({ user, onLogout }) {
  return (
    <div className="page">
      <div className="top-bar">
        <h1>WololoCrm</h1>
        <button onClick={onLogout}>Se déconnecter</button>
      </div>
      <p>
        Bonjour <strong>{user.firstname} {user.lastname}</strong>
      </p>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
    </div>
  );
}
