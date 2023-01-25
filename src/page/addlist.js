import { Input, Stack, FormControl, Square, Button, TextArea, HStack, ScrollView } from "native-base";
import { Text } from "react-native";
import { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { useQuery } from "react-query";
import { API } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/userContext";

export default function Addlist() {
  // const [state, dispatch] = useContext(UserContext);

  
  const date = new Date(Date.now())

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setData({
      ...data,
      "date": currentDate.getDate() + " " + LocalMonth[(currentDate.getMonth()).toString()] + " " + currentDate.getFullYear()
    })
  };

  const LocalMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: date,
      is24Hour: true,
    });
  };
  
  const [data, setData] = useState({
    name: "",
    category: "",
    date: "",
    desc: "",
    status: "Soon"
  })

  const posting = (key, value) => {
    setData({
      ...data,
      [key]: key === "category" ? [catlist[catlist?.map(e => e.name).indexOf(`${value}`)]._id] : value,
    });
  }
  
  const { data: catlist } = useQuery('catCache', async () => {
    const response = await API.get('/Category');
    return response.data;
  });
  
  if (catlist) {
    var tek = catlist?.map(({ name }) => name) }
    
    const newNote = async (e) => {
      try {
        const token = await AsyncStorage.getItem('token')
  
        const config = {
          headers:{
              'Authorization': `Bearer ${token}`,
          },
        };
  
        await API.post('/List', data, config);
        alert("List added!")
      } catch (error) {
        console.log("Error: " + error.response.data.message)
        alert("Category must be filled.")
      }
    };

  return (
    <ScrollView>
      <Text style={{ marginLeft: 30, marginTop: 80, fontSize: 30, fontWeight: '900' }}>Add List</Text>
      <FormControl>
        <Square>
          <Stack space={5} w="85%" mt={30}>
            <Stack>
              <Input value={data.name} onChangeText={(value) => posting("name", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Name" />
            </Stack>
            <Stack>
              <SelectDropdown buttonStyle={{ backgroundColor: "#e5e5e5", width: "100%", height: 45 }} buttonTextStyle={{ fontSize: 15 }} data={tek} onSelect={(value) => posting("category", value)} defaultButtonText={"Choose Category"} dropdownIconPosition={"right"} />
            </Stack>
            <Button onPress={showMode} backgroundColor={"muted.200"}>
              {data.date !== "" ? <Text fontSize={10}>{data.date}</Text> :
                <HStack>
                  <Ionicons name="calendar-outline" size={24} color="darkslategray"></Ionicons>
                  <Text style={{ textAlign: "left", fontSize: 15 }}>  Choose Date</Text>
                </HStack>}
            </Button>
            <Stack>
              <TextArea value={data.desc} onChangeText={(value) => posting("desc", value)} h="170px" size="lg" bg={"muted.100"} placeholder="Description" />
            </Stack>
          </Stack>
          <Button style={{ width: 330, marginTop: 25 }} onPress={() => newNote()} size="lg" backgroundColor="error.600">Add List</Button>
        </Square>
      </FormControl>
    </ScrollView>
  )
}