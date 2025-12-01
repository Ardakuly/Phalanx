import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getUser } from "../api/user";

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);
    })();
  }, []);

  if (!user) return null; // wait until loaded

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />     {/* ⬅ user injected */}
      <div className="flex-1 ml-0 md:ml-64">{children}</div>
    </div>
  );
}
