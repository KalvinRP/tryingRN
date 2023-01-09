import React, { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import Index from "./src/page/index"
import Login from "./src/page/login"
import Register from "./src/page/register"
import Listodo from "./ListsTodo";
import Category from "./src/page/category";
import Addlist from "./src/page/addlist";
import Detail from "./src/page/detail";
// import { Container } from "react-dom";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserContext, { UserContextProvider } from "./src/context/userContext";
import { API, setAuthToken } from "./src/config/api";

export default function App() {
  const Stack = createStackNavigator();
  const Client = new QueryClient();
  // const [state, dispatch] = useContext(UserContext)

  const checkUser = async () => {
    try {
      const thing = await AsyncStorage.getItem('token')
      if (thing !== "") {
        setAuthToken(thing);
      }

      const response = await API.post('/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${thing}`
        }
      });

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      let payload = response;

      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log("Error on authentication:", error);
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, []);

  return (
    <UserContextProvider>
      <QueryClientProvider client={Client}>
        <NativeBaseProvider>
          <StatusBar style="light" backgroundColor="black" />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen options={{ headerShown: false }} name="Index" component={Index} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
              <Stack.Screen name="Detail" component={Detail} />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </UserContextProvider>
  );
};

function Tabs() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name == "Lists") {
          iconName = focused ? "list" : "list-outline"
        } else if (route.name == "Category") {
          iconName = focused ? "folder" : "folder-outline"
        } else if (route.name == "Addlist") {
          iconName = focused ? "add-circle" : "add-circle-outline"
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "grey"
    })}>
      <Tab.Screen options={{ headerShown: false, unmountOnBlur: true }} name="Lists" component={Listodo} />
      <Tab.Screen options={{ headerShown: false, unmountOnBlur: true }} name="Category" component={Category} />
      <Tab.Screen options={{ headerShown: false, unmountOnBlur: true }} name="Addlist" component={Addlist} />
    </Tab.Navigator>
  )
}