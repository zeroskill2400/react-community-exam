import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

function Layout({ children }) {
  const location = useLocation();
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    console.log("[Route]", location.pathname, "currentUser:", user);
  }, [location, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
