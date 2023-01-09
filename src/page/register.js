import { Link } from "@react-navigation/native";
import { AlertDialog, Button, Center, FormControl, Image, Input, Square, Stack } from "native-base";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { useMutation } from "react-query";
import { API } from "../config/api";

export default function Login({ navigation }) {
  const [data, setData] = useState({
    email: "",
    firstName: "",
    password: "",
  })

  const posting = (key, value) => {  
    setData({
      ...data,
      [key] : value,
    });
  }

  const RegSubmitted = useMutation(async (e) => {
    try {
      await API.post('/auth/register', data);
      navigation.navigate("Login");
      alert("Registration success!")
    } catch (error) {
      AlertDialog.alert("Error: " + error.response.data.message)
    }
  });

    return (
        <ScrollView>
          <KeyboardAvoidingView
      behavior="position">
        <Center>
            <Image source={require('../../assets/login.png')} alt="loading" style={{width: 280, height: 250, marginTop: 25, marginBottom: 40}} />
        </Center>
            <Text style={{marginLeft: 30, fontSize: 30, fontWeight: '900'}}>Register</Text>
            <FormControl>
    <Square>
      <Stack space={5} w="85%" mt={30}>
        <Stack>
          <Input value={data.email} onChangeText={(value) => posting("email", value)} form size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Email" />
        </Stack>
        <Stack>
          <Input value={data.firstName} onChangeText={(value) => posting("firstName", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Username" />
        </Stack>
        <Stack>
          <Input value={data.password} onChangeText={(value) => posting("password", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Password" />
        </Stack>
      </Stack>
      <Button style={{width: 330, marginTop: 40}} onPress={() => RegSubmitted.mutate()} size="lg" backgroundColor="error.600">Register</Button>
      <View style={{flexDirection: "row", marginTop: 15}}>
      <Text style={{fontSize: 15}}>Joined us before?   </Text>
      <Link to={{screen: "Login"}}><Text style={{color:"orange", textDecorationLine:"underline", fontWeight:'bold', fontSize: 15}}>Login.</Text></Link>
      </View>
    </Square>
        </FormControl>
          </KeyboardAvoidingView>
        </ScrollView>
    )
}