import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { Input } from "../../components/forms/Input";
import Link from "next/link";
import { appendErrors, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";

interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome Obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória').min(6,'No mínimo 6 caracteres'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], 'As senhas precisam ser iguais')
});
export default function CreateUser(){
    const router = useRouter();
    const createUser = useMutation(async (user: CreateUserFormData) => {
        const response = await api.post('users', {
            user: {
                ...user,
                created_at: new Date(),
            }
        });
        return response.data.user;
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        }
    });
    const { register, handleSubmit, formState : { errors, isSubmitting } } = useForm<CreateUserFormData>({
        resolver: yupResolver(createUserFormSchema)
    });

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await createUser.mutateAsync(values);
        router.push('/users');
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />
                <Box
                    as="form"
                    flex="1"
                    borderRadius={8}
                    bg="gray.800"
                    p={["6","8"]}
                    onSubmit={handleSubmit(handleCreateUser)}
                >
                   <Heading size="lg" fontWeight="normal">Create New User</Heading>
                   <Divider my="6" borderColor="gray.700" />
                   <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
                            <Input 
                              type="name"
                              label="Full Name"
                              {...errors.name}
                              {...register("name")}
                            />
                            <Input
                              type="email" 
                              label="E-mail"
                              {...errors.email}
                              {...register("email")}
                            />
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
                            <Input
                              type="password"
                              label="Password"
                              {...errors.password}
                              {...register("password")}
                            />
                            <Input
                             type="password"
                             label="Password confirmation"
                             {...errors.password_confirmation}
                             {...register("password_confirmation")}
                            />
                        </SimpleGrid>
                    </VStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users">
                                <Button as="a" colorScheme="whiteAlpha">Cancel</Button>
                            </Link>
                            <Button type="submit"colorScheme="pink" isLoading={isSubmitting}>Save</Button>
                        </HStack>
                    </Flex> 
                </Box>
            </Flex>
        </Box>
    )
}