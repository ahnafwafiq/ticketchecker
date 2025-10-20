import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function SignedOut() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => {
        if (!value) return "Email is required.";
        return /^\S+@\S+$/.test(value) ? null : "Invalid email.";
      },
      password: (value) => {
        if (!value) return "Password is required.";
      },
    },
  });
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          if (!values.email) {
            form.setErrors({ email: "Email is Required." });
            setLoading(false);
            return;
          }
          if (!values.password) {
            form.setErrors({ password: "Password is Required." });
            setLoading(false);
            return;
          }
          setLoading(true);
          supabase.auth
            .signInWithPassword({
              email: values.email,
              password: values.password,
            })
            .then((e) => {
              if (e.error) {
                form.setErrors({ password: e.error.message });
              }
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setLoading(false);
              form.setErrors({ password: e.error.message });
            });
        })}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Password"
          type="password"
          placeholder="ABCabc123@#&"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Group justify="flex-end" mt="md">
          <Button loading={loading} type="submit">
            Sign In
          </Button>
        </Group>
      </form>
    </>
  );
}

export default SignedOut;
