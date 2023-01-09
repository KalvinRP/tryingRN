import { Button, Center, Image } from "native-base";
import { Text } from "react-native";

export default function Index({ navigation }) {
    return (
        <Center>
            <Image source={require('../../assets/accept-request.png')} alt="loading" style={{width: 250, height: 250, marginTop: 125}} />
            <Image source={require('../../assets/logo.png')} alt="logo" style={{width: 250, height: 75, resizeMode: 'contain'}} />
            <Text>Write and finish your activity</Text>
            <Text>Fast, simple, and easy to use</Text>
                <Button style={{width: 300, marginTop: 150}} onPress={() => navigation.navigate("Login")} size="lg" backgroundColor="error.600">Login</Button>
                <Button style={{width: 300, marginTop: 10}} onPress={() => navigation.navigate("Register")} size="lg" backgroundColor="muted.300">Register</Button>
        </Center>
    )
}