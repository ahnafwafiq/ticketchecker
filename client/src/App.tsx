import "./App.css";
import { useState } from "react";
import { supabase } from "./supabaseClient";
import SignedIn from "./Components/SignedIn";
import SignedOut from "./Components/SignedOut";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {
  const [user, setUser] = useState<any>(null);
  supabase.auth.getSession().then((user) => {
    if (user.data.session?.user) {
      setUser(user.data.session.user);
    }
  });
  return (
    <>
      <MantineProvider>
        {user ? (
          <SignedIn setUser={setUser} />
        ) : (
          <SignedOut setUser={setUser} />
        )}
      </MantineProvider>
    </>
  );
}

export default App;
