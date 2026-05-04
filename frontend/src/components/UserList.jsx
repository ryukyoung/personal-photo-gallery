function UserList({ users }) {
  return (
    <section>
      <h2>User List</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UserList;
