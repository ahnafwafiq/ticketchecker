import { useState } from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function Participants() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      phone: "",
      email: "",
      institution: "",
      grade: "",
      emergencyContact: "",
    },

    validate: {
      name: (value) => {
        if (!value) return "Name is required.";
      },
      phone: (value) => {
        if (!value) return "Phone is required.";
      },
      email: (value) => {
        if (!value) return "Email is required.";
        return /^\S+@\S+$/.test(value) ? null : "Invalid email.";
      },
      institution: (value) => {
        if (!value) return "Instituion Name is required.";
      },
      grade: (value) => {
        if (!value) return "Grade is required.";
      },
      emergencyContact: (value) => {
        if (!value) return "Emergency contact number is required.";
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

          setLoading(true);
        })}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
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

export default Participants;
