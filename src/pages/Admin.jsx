import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getUser, getUsers } from "../api/user";
import UserRow from "../components/UserRow";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);

      // 🔥 block employee access
      if (data.role !== "EMPLOYER") {
        navigate("/products");      // redirect non-admin user
        return;
      }

      const list = await getUsers();
      setUsers(list);
    })();
  }, []);

  const handleUserUpdate = (email, updates) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, ...updates } : u));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header page="admin" user={user} />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Название</th>
                <th className="px-4 py-2">Почта</th>
                <th className="px-4 py-2">Роль</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <UserRow
                  key={u.email}
                  user={u}
                  onUpdate={updates => handleUserUpdate(u.email, updates)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}