import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { InputForm } from "../components/Input";
import api from "../services/api";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [errors, setErros] = useState ({name: null, email:null})

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);

  const isValidFormData = () => {
    if (!name) {
      setErros({name: 'É necessário informar o Nome'})
      return false
    }

    if (!email) {
      setErros({email: 'É necessário informar o Email'})
      return false
    }

    if(clients.some(client => client.email === email && client._id !== id)){
      setErros({email: 'Email ja usado'})
      return
    }

    setErros({})
    return true
  }

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if (!isValidFormData()) return

    try {
      const response = await api.post('/clients', {name, email})

      setClients(
        clients.concat({ name, email })
      );
      setName("");
      setEmail("");
      toggleFormState()
    } catch (error) {
      console.log(error)
    }
  };

  const handleSubmitUpdateClient = async (e) => {
    e.preventDefault();

    if(!isValidFormData()) return

    try {
      await api.put(`/clients/${id}` / {name, email})
      setClients(clients.map(client => client._id == id ? {name, email, _id: id} : client));
      setId(null);
      setName("");
      setEmail("");
      toggleFormState()
    } catch (error) {
      console.log(error)
    }
  };

  const handleShowUpdateClientForm = (client) => {
    setId(client._id)
    setName(client.name)
    setEmail(client.email)
    setIsFormOpen(true)
  }

  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`/clients/${_id}`)
      setClients(clients.filter(client => client._id !== _id));
    } catch (error) {
      console.log(error)
    }
  };

  const handleChangeName = (text) => {
    setName(text);
  };

  const handleChangeEmail = (email) => {
    setEmail(email);
  };

  const toggleFormState = () => {
    setIsFormOpen(!isFormOpen)
  }

  useEffect(() => {
    api.get('/clients').then(({data}) => {
      setClients(data.data)
    })
  },[])

  return (
    <Box margin="1rem">
      <Flex color="white" justifyContent="space-between" margin="4">
        <Text color="black" fontSize="2xl">
          Lista de Clientes
        </Text>
        <Button colorScheme="blue" onClick={toggleFormState}>{isFormOpen ? '-' : '+'}</Button>
      </Flex>

      { isFormOpen && (<VStack margin="1rem" as="form" onSubmit={id ? handleSubmitUpdateClient : handleSubmitCreateClient}>
        <InputForm
          label="Nome"
          name="nome"
          value={name}
          type="text"
          onChange={(e) => handleChangeName(e.target.value)}
          error={errors.name}
        />

        <InputForm
          label="Email"
          name="email"
          value={email}
          type="email"
          onChange={(e) => handleChangeEmail(e.target.value)}
          error={errors.email}
        />

        <Button
          fontSize="sm"
          alignSelf="flex-end"
          bgColor="blue.400"
          textColor="white"
          type="submit"
        >
          {id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </VStack>)}

      <TableContainer>
        <Table variant="simple" marginY='4'>
          <Thead bgColor="blue.400">
            <Tr>
              <Th textColor="white">Name</Th>
              <Th textColor="white">Email</Th>
              <Th textColor="white">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client._id}>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td>
                  <Flex justifyContent="space-between">
                    <Button
                      size="sm"
                      fontSize="smaller"
                      colorScheme="yellow"
                      mr="2"
                      onClick={() => handleShowUpdateClientForm(client)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      fontSize="smaller"
                      colorScheme="red"
                      onClick={() => handleDeleteClient(client._id)}
                    >
                      Remover
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
