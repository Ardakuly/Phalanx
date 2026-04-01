import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getUsers } from "../api/user";
import UserRow from "../components/UserRow";
import { useAuth } from "../context/AuthContext";
import { Users, Shield, UserCheck, Loader2 } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await getUsers();
        setUsers(list);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUserUpdate = (email, updates) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, ...updates } : u));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header page="admin" user={user} />

      <div className="p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              Управление персоналом
            </h1>
            <p className="text-gray-500 font-medium mt-1">Управляйте ролями сотрудников и доступом к системе</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-xl border border-blue-100 flex items-center gap-3">
            <Users className="text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Всего</span>
              <span className="text-xl font-black text-blue-700 leading-none">{users.length}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Сотрудник</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Электронная почта</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Роль</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td colSpan={4} className="px-8 py-10">
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                            </td>
                        </tr>
                    ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">Список сотрудников пуст</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <UserRow
                      key={u.email}
                      user={u}
                      onUpdate={updates => handleUserUpdate(u.email, updates)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
            <UserCheck size={16} className="text-green-500" />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Безопасная панель управления персоналом</p>
          </div>
        </div>
      </div>
    </div>
  );
}