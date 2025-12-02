import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { getUser } from "../api/user";

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);
    })();
  }, []);

  if (!user) return null;

  return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />

            {/* RIGHT SIDE */}
            <div className="flex flex-col flex-1 ml-0 md:ml-64 min-h-screen">
                
                {/* Content fills remaining space */}
                <div className="flex-1 pb-16">
                    {children}
                </div>

                {/* Footer always visible at bottom */}
                <Footer />
            </div>
        </div>
  );
}
