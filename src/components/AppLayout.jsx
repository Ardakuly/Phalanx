import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">{children}</div>
    </div>
  );
}
