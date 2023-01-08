import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

export function Profile(){
    return (
        <Flex align="center">
            <Box mr="4" textAlign="right">
                <Text>Natalia Lima</Text>
                <Text color="gray.300" fontSize="small">
                    alimadeoliveiranatalia@gmail.com
                </Text>
            </Box>
            <Avatar size="md" name="Natalia Lima" src="https://github.com/alimadeoliveiranatalia.png"/>
        </Flex>
    )
}