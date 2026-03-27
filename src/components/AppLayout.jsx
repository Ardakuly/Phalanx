import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

export default function AppLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading || !user) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

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
