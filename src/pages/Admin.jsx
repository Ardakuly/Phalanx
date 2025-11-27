import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getUser, getUsers } from "../api/user";
import UserRow from "../components/UserRow";

export default function Admin() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleUserUpdate = (email, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, ...updates } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header page="admin" user={user} />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <UserRow
                  key={u.email}
                  user={u}
                  onUpdate={(updates) => handleUserUpdate(u.email, updates)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}