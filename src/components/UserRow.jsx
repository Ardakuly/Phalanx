import { changeUserRole, enableUser, disableUser } from "../api/user";
import { User, Shield, UserX, UserCheck, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UserRow({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  
  const toggleRole = async () => {
    setLoading(true);
    try {
      const newRole = user.role === "EMPLOYER" ? "EMPLOYEE" : "EMPLOYER";
      await changeUserRole(user.email, newRole);
      onUpdate({ role: newRole });
      toast.success("Роль успешно изменена");
    } catch (e) {
      toast.error("Ошибка при смене роли");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    setLoading(true);
    try {
      if (user.enabled) {
        await disableUser(user.email);
        onUpdate({ enabled: false });
        toast.info("Доступ сотрудника ограничен");
      } else {
        await enableUser(user.email);
        onUpdate({ enabled: true });
        toast.success("Доступ сотрудника восстановлен");
      }
    } catch (e) {
        toast.error("Ошибка при смене статуса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="group hover:bg-blue-50/30 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110 shadow-sm ${user.enabled ? 'bg-blue-600' : 'bg-gray-400'}`}>
            <User size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${user.enabled ? 'text-green-600' : 'text-red-500'}`}>
                {user.enabled ? 'Активен' : 'Отключен'}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <span className="text-gray-500 font-medium font-mono text-sm">{user.email}</span>
      </td>
      <td className="px-8 py-5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${user.role === 'EMPLOYER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {user.role === 'EMPLOYER' ? <Shield size={12} /> : null}
          {user.role === 'EMPLOYER' ? 'Администратор' : 'Сотрудник'}
        </div>
      </td>

      <td className="px-8 py-5 text-right whitespace-nowrap">
        <div className="inline-flex gap-2">
          <button
            disabled={loading}
            onClick={toggleRole}
            title={user.role === "EMPLOYER" ? "Сделать сотрудником" : "Сделать админом"}
            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Shield size={18} />}
          </button>

          <button
            disabled={loading}
            onClick={toggleStatus}
            className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50
              ${user.enabled 
                ? "bg-red-50 text-red-500 hover:bg-red-600 hover:text-white" 
                : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"}`}
          >
            {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
          </button>
        </div>
      </td>
    </tr>
  );
}