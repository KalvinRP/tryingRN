import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "native-base";
import FormNativeBase from "./src/screens/formNativeBase";
import Hello from "./src/screens/hello";
import IncDec from "./src/screens/incDec";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function MyTab() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name == "Hello") {
          iconName = focused ? "ios-home" : "ios-home-outline"
        } else if (route.name == "Form") {
          iconName = focused ? "ios-information-circle" : "ios-information-circle-outline"
        } else if (route.name == "IncDec") {
          iconName = focused ? "ios-list-circle" : "ios-list-circle-outline"
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "grey"
    })}>
      <Tab.Screen name="Hello" component={Hello} />
      <Tab.Screen name="IncDec" component={IncDec} />
      <Tab.Screen name="Form" component={FormNativeBase} />
    </Tab.Navigator>
  )
}

export default function Container() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerMode: "screen",
          headerShown: false,
          headerTintColor: "white",
          headerStyle: { backgroundColor: theme.colors.primary["300"] },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MyTab}
          options={{
            headerShown: false,
            title: "Hello Screen",
          }}
        />
        <Stack.Screen
          name="Home"
          component={Hello}
          options={{
            headerShown: false,
            title: "Hello Screen",
          }}
        />
        <Stack.Screen
          name="IncDec"
          component={IncDec}
          options={{
            headerShown: false,
            title: "Increment Decrement",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}