import { useEffect, useState } from "react";
import { Button, Group, Table, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { socket } from "../socket";
import { supabase } from "../supabaseClient";
import { MdContactEmergency, MdDelete } from "react-icons/md";

function Participants() {
  const [loading, setLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const handleCreationSuccess = (data: {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone: string;
    institution: string;
    grade: string;
    emergencyContact: string;
    createdAt: Date;
    createdBy: string;
  }) => {
    setParticipants((prev) => [...prev, data]);
    setLoading(false);
  };
  const handleQueryResult = (data: any[]) => {
    setParticipants(data);
  };
  useEffect(() => {
    socket.on(`creationSuccess`, handleCreationSuccess);
    socket.on("queryResult", handleQueryResult);
    supabase.auth.getSession().then((session) => {
      socket.emit(`participantsQuery`, {
        admin: session.data.session?.user.id,
      });
    });
    return () => {
      socket.off("creationSuccess", handleCreationSuccess);
      socket.off("queryResult", handleQueryResult);
    };
  }, []);
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

  const tableRows = participants.map((row) => (
    <Table.Tr key={row.uid}>
      <Table.Td>{row.uid}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
      <Table.Td>{row.institution}</Table.Td>
      <Table.Td>{row.grade}</Table.Td>
      <Table.Td>
        <MdContactEmergency
          onClick={() =>
            window.alert(`Emergency Contact: ${row.emergencyContact}`)
          }
        />
      </Table.Td>
      <Table.Td>
        <MdDelete
          onClick={() =>
            socket.emit("deleteParticipant", {
              uid: row.uid,
              createdBy: row.createdBy,
            })
          }
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true);
          const session = await supabase.auth.getSession();
          if (session.data.session) {
            socket.emit("addParticipant", {
              ...values,
              createdBy: session.data.session?.user.id,
            });
          }
        })}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Elon Musk"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Phone"
          placeholder="01234-567890"
          key={form.key("phone")}
          {...form.getInputProps("phone")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Instutitions"
          placeholder="XYZ School and College"
          key={form.key("institution")}
          {...form.getInputProps("institution")}
        />
        <TextInput
          withAsterisk
          label="Grade"
          placeholder="Class 11"
          key={form.key("grade")}
          {...form.getInputProps("grade")}
        />
        <TextInput
          withAsterisk
          label="Emergency Contact"
          placeholder="01234-567890"
          key={form.key("emergencyContact")}
          {...form.getInputProps("emergencyContact")}
        />

        <Group justify="flex-end" mt="md">
          <Button loading={loading} type="submit">
            Add Participant
          </Button>
        </Group>
      </form>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Institution</Table.Th>
            <Table.Th>Grade</Table.Th>
            <Table.Th>Emergency Contact</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{tableRows}</Table.Tbody>
      </Table>
    </>
  );
}

export default Participants;
