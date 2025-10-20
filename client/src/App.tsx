import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import SignedIn from "./Components/SignedIn";
import SignedOut from "./Components/SignedOut";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { socket } from "./socket";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Web Socket connection
    socket.on("connect", () => {
      console.log("Web Socket Connected ✅");
    });

    // Check current session on mount
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);
      setSession(data?.session);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes (sign in, sign out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <MantineProvider>
        {session ? <SignedIn /> : <SignedOut />}
      </MantineProvider>
    </>
  );
}

export default App;
