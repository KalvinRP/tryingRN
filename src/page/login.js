import { Link } from "@react-navigation/native";
import { Button, Center, FormControl, Image, Input, Square, Stack } from "native-base";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  })

  const signing = (key, value) => {  
    setLogin({
      ...login,
      [key] : value,
    });
  }

  const LogSubmitted = useMutation(async (e) => {
    try {
      const response = await API.post('/auth/login', login);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.user._id);
      await AsyncStorage.setItem('username', response.data.user.firstName);
      const token = await AsyncStorage.getItem('token')
        if (token !== null) {
      navigation.navigate("Tabs");}
    } catch (error) {
      alert(error.response.data.message)
    }
  });

    return (
        <ScrollView>
        <Center>
            <Image source={require('../../assets/login.png')} alt="loading" style={{width: 280, height: 250, marginTop: 25, marginBottom: 40}} />
        </Center>
            <Text style={{marginLeft: 30, fontSize: 30, fontWeight: '900'}}>Login</Text>
            <FormControl>
    <Square>
      <Stack space={5} w="85%" mt={30}>
        <Stack>
          <Input value={login.email} onChangeText={(value) => signing("email", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Email" />
        </Stack>
        <Stack>
          <Input value={login.password} onChangeText={(value) => signing("password", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Password" />
        </Stack>
      </Stack>
      <Button style={{width: 330, marginTop: 40}} onPress={() => LogSubmitted.mutate()} size="lg" backgroundColor="error.600">Login</Button>
      <View style={{flexDirection: "row", marginTop: 15}}>
      <Text style={{fontSize: 15}}>New User?   </Text>
      <Link to={{screen: "Register"}}><Text style={{color:"orange", textDecorationLine:"underline", fontWeight:'bold', fontSize: 15}}>Register.</Text></Link>
      </View>
    </Square>
        </FormControl>
        </ScrollView>
    )
}