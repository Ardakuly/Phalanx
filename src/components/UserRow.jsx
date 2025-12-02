import { changeUserRole, enableUser, disableUser } from "../api/user";

export default function UserRow({ user, onUpdate }) {
  
  const toggleRole = async () => {
    const newRole = user.role === "EMPLOYER" ? "EMPLOYEE" : "EMPLOYER";
    await changeUserRole(user.email, newRole);
    onUpdate({ role: newRole });
  };

  const toggleStatus = async () => {
    if (user.enabled) {
      await disableUser(user.email);
      onUpdate({ enabled: false });
    } else {
      await enableUser(user.email);
      onUpdate({ enabled: true });
    }
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2 font-semibold">{user.role}</td>

      <td className="px-4 py-2 flex gap-2">

        <button
          onClick={toggleRole}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Сделать {user.role === "EMPLOYER" ? "Employee" : "Employer"}
        </button>

        <button
          onClick={toggleStatus}
          className={`px-3 py-1 text-white rounded 
            ${user.enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {user.enabled ? "Отключить" : "Включить"}
        </button>

      </td>
    </tr>
  );
}