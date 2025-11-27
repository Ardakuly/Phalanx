import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden"> {/* 100% viewport height */}
      
      {/* Left menu */}
      <Sidebar />
      
      {/* Right section → full-height column */}
      <div className="flex flex-col flex-1 ml-0 md:ml-64 h-full">

        {/* Main content area — no page scroll */}
        <div className="flex-1 overflow-hidden"> 
          {children}
        </div>

        {/* Footer permanently visible */}
        <Footer />
      </div>
    </div>
  );
}
