import { useState } from "react";
import { supabase } from "../supabaseClient";

interface Props {
  setUser: React.Dispatch<any>;
}
function SignedIn({ setUser }: Props) {
  const [error, setError] = useState<string>("");
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = (
            e.currentTarget.elements.namedItem("email") as HTMLInputElement
          ).value;
          const password = (
            e.currentTarget.elements.namedItem("password") as HTMLInputElement
          ).value;
          if (!email) {
            setError("Please provide a valid password");
          }
          if (!password) {
            setError("Please Provide a Valid Password");
          }
          supabase.auth
            .signInWithPassword({
              email,
              password,
            })
            .then((e) => {
              if (e.error) {
                setError(e.error.message);
              }
              setUser(e.data.session?.user);
            })
            .catch((e) => {
              console.log(e);
              setError(e.error.message);
            });
        }}
      >
        <input type="email" name="email" id="email" />
        <input type="password" name="password" id="password" />
        <button type="submit"></button>
        {error ? <p>{error}</p> : null}
      </form>
    </>
  );
}

export default SignedIn;
