import "./index.css";
import Layout from "./layouts/Layout";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./libs/supabase";
import { useUserStore } from "./stores/userStore";

function App() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        useUserStore.getState().setUser(session.user);
      } else {
        useUserStore.getState().clearUser();
      }
    });
  }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
