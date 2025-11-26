export default function Input({ label, type = "text", value, onChange, name }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-sm text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}
