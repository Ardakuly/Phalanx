export default function UserRow({ user, onUpdate }) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.role}</td>
      <td className="px-4 py-2 flex gap-2">
        {user.blocked ? (
          <button
            onClick={() => onUpdate({ blocked: false })}
            className="bg-green-600 text-white px-2 py-1 rounded"
          >
            Unblock
          </button>
        ) : (
          <button
            onClick={() => onUpdate({ blocked: true })}
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            Block
          </button>
        )}

        <button
          onClick={() =>
            onUpdate({ role: user.role === "User" ? "Admin" : "User" })
          }
          className="bg-blue-600 text-white px-2 py-1 rounded"
        >
          Change Role
        </button>
      </td>
    </tr>
  );
}
