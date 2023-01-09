import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Button, Center, FormControl, Input, Square, Stack } from "native-base";
import { useState } from "react";
import { Text, View } from "react-native";
import { API } from "../config/api";
import { useQuery } from "react-query";

export default function Category() {
    const [data, setData] = useState()    

    const posting = (key, value) => {
      setData({
        ...data,
        [key] : value,
      });  
    }

    const addCat = async (e) => {
      try {
        const token = await AsyncStorage.getItem('token')
  
        const config = {
          headers:{
              'Authorization': `Bearer ${token}`,
          },
        };

        await API.post('/Category', data, config);
        alert("Category added!")
      } catch (error) {
        console.log("Error: " + error.response.data.message)
      }
    };
  
    const { data: catlist, refetch } = useQuery('caCache', async () => {
      const response = await API.get('/Category');
      return response.data;
    });
    
    // let category = ["Homework", "Study", "Workout"]

    let categor = catlist?.map(({ name }) => name)
    if (categor) {refetch()}

    const bgcolor = ["primary.200", "secondary.200", "tertiary.200", "danger.200", "success.200", "rose.200", "muted.200", "info.200", "purple.200", "violet.200", "indigo.200", "teal.200", "amber.200", "blueGray.200", "coolGray.200"]
    const bgset = (n) => categor?.indexOf(n)

    return (
        <View>
            <Text style={{marginLeft: 30, marginTop: 80, fontSize: 30, fontWeight: '900'}}>Add Category</Text>
            <FormControl>
    <Square>
      <Stack space={5} w="85%" mt={30}>
          <Input onChangeText={(value) => posting("name", value)} size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Input Category" />
      </Stack>
      <Button style={{width: 330, marginTop: 25}} onPress={() => addCat()} size="lg" backgroundColor="error.600">Add Category</Button>
    </Square>
        </FormControl>
        <Text style={{marginLeft: 30, marginTop: 80, marginBottom: 20, fontSize: 30, fontWeight: '900'}}>List Category</Text>
      <View flexWrap={"wrap"} flexDirection={"row"} backgroundColor={"blue.400"}>
        {categor?.map((things, index) => (
            <Box rounded="md" key={index} ml={3} my={1} p={2} maxWidth={100} backgroundColor={bgcolor[bgset(things) % 16]}>
                <Center> 
                <Text fontSize="20">{things}</Text>
                </Center>
        </Box>
        ))}
      </View>
        </View>
    )
}