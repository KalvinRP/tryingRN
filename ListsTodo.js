import { Box, Center, HStack, Input, Menu, Pressable, ScrollView, Stack, Text, View, VStack, Button } from "native-base";
import { useState, useEffect, useContext } from "react";
import { Image, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { useQuery, useMutation } from "react-query";
import { API } from "./src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./src/context/userContext";

export default function Listodo({ navigation }) {
    // const [state, dispatch] = useContext(UserContext)
    // console.log(state)
    // const [usname, setName] = useState()
    // const newNote = async () => {
    //     try {
    //       const username = await AsyncStorage.getItem('username')
    //       setName(username)
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     newNote();
    //     // eslint-disable-next-line
    //     }, []);

    const [date, setDate] = useState(new Date(Date.now()));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

//   {selectedDate.getDate() + LocalMonth[(selectedDate.getMonth()).toString()] + selectedDate.getFullYear()}

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: date,
      is24Hour: true,
    });
  };

    const { data: list, refetch } = useQuery('listCache', async () => {
        const response = await API.get('/List?$lookup=*');
        return response.data;
      });

    const bgcolor = ["primary.200", "secondary.200", "tertiary.200", "danger.400", "success.400", "rose.300", "muted.200", "info.200", "purple.200", "violet.200", "indigo.200", "teal.200", "amber.200", "blueGray.200"]

    const truncateText = (text) => {
        if (text.length < 100) {
            return text;
        }

        return text.substring(0, 100) + '\u2026'
    }

    const [del, setDelete] = useState(false)
    const [target, setTarget] = useState(null)

    const LocalMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

    const deleteList = useMutation(async () => {
        try {
                const token = await AsyncStorage.getItem('token')
          
                const config = {
                  headers:{
                      'Authorization': `Bearer ${token}`,
                  },
                };

          await API.delete('/List/' + target, config);
          refetch();
        } catch (error) {
          console.log(error);
        }
      });

    const [check, setCheck] = useState([])
    
    useEffect(() => {
        editStat.mutate()
    }, [check])

    let editStat = useMutation(async () => {
        try {
                const token = await AsyncStorage.getItem('token')
          
                const config = {
                  headers:{
                      'Authorization': `Bearer ${token}`,
                  },
                };

          await API.patch('/List/' + check[0], {"status": check[1] === "Soon" ? "Done" : "Soon"});
          refetch();
        } catch (error) {
          if (error.response.data.message !== "path not found") {console.log(error)}
        }
      });

      const loggingOut = async (e) => {
        try {
            await API.post('/auth/logout',);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('username');
            navigation.navigate("Login");
        } catch (error) {
          alert(error.response.data.message)
        }
      };
    
    return (
        <View>
            <Box flexDirection="row" style={{ marginLeft: 30, marginTop: 50 }}>
                <Box>
                    <Text fontSize="3xl" fontWeight="900">
                        Hi Radif
                    </Text>
                    <Text color="amber.800">
                        {list?.length} {list?.length < 2 ? "List" : "Lists"}
                    </Text>
                </Box>
                <Box>
                    <Menu marginLeft={20} marginTop={10} w="150" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <Image source={require('./assets/Pic.png')} alt="loading" w={50} h={50} marginLeft={160} />
                        </Pressable>;
                    }}>
                        <Pressable>
                            <Menu.Item onPress={() => loggingOut()}>Logout</Menu.Item>
                        </Pressable>
                        <Menu.Item isDisabled>Settings</Menu.Item>
                    </Menu>
                </Box>
            </Box>
            <Center>
                <Stack space={5} w="85%" mt={30}>
                    <Stack>
                        <Input size="lg" variant="outline" bg={"muted.100"} p={2} placeholder="Search List ..." />
                    </Stack>
                    <Stack direction="row">
                        <Button style={{width: "30%"}} onPress={showMode} backgroundColor={"muted.200"}>
                            <HStack>
                                <Ionicons name="calendar-outline" size={16} color="darkslategray"></Ionicons>
                                <Text fontSize={10}>  Choose Date</Text>
                            </HStack>
                        </Button>
                        <SelectDropdown buttonStyle={{width: "30%"}} buttonTextStyle={{fontSize: 10}} data={(Object.values(bgcolor))} onSelect={(selectedItem, index) => {console.log(selectedItem, index)}} defaultButtonText={"Category"} />
                        <Input size="md" w="30%" variant="outline" bg={"muted.200"} p={2} placeholder="Status" />
                    </Stack>
                </Stack>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 100, textAlign: 'center' }}>To Do List</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>

                <ScrollView w="350" h="450">
                    {list?.map((item, index) => (
                        <TouchableOpacity key={index} onLongPress={() => {setDelete(true); setTarget(item._id)}} delayLongPress={250} onPress={() => navigation.push("Detail", { Backcolor: bgcolor[index], list: list[index] })}>
                            <VStack mb={5} py={1} backgroundColor={bgcolor[(index % 16)]} flexDirection="row" w={350} minH={110}>
                                <VStack flex={3} marginLeft={2}>
                                    <Text>{item.category[0].name} - {item.name}</Text>
                                    <Text maxW={260} marginBottom={7}>{truncateText(item.desc)}</Text>
                                    <Box flexDirection="row" marginTop={2} position="absolute" bottom={0}>
                                        <Ionicons name="calendar-outline" size={16} color="darkslategray"></Ionicons>
                                        <Text color={"darkslategray"}> {item.date}</Text>
                                    </Box>
                                </VStack>
                                <VStack flex={1} flexDirection="column">
                                    <Center>
                                        <Box rounded={"xl"} backgroundColor={item.Catcolor} px={1} py={0} marginBottom={2}>
                                            <Text px={1}>
                                            {item.category[0].name}</Text>
                                        </Box>
                                        <TouchableOpacity onPress={() => {setCheck([item._id, item.status])}}>
                                        {
                                            item.status === "Done" ?
                                            <Image source={require('./assets/done.png')} alt="loading" style={{ width: 30, height: 30 }} /> :
                                            <Image source={require('./assets/soon.png')} alt="loading" style={{ width: 30, height: 30 }} />
                                        }
                                        </TouchableOpacity>
                                    </Center>
                                </VStack>
                            </VStack>
                        </TouchableOpacity>
                    )
                    )}
                </ScrollView>
            </Center>

            <Modal
                animationType="fade"
                transparent={true}
                visible={del}
                onRequestClose={() => {
                    setDelete(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Delete this entry?</Text>
                        <HStack space={5} justifyContent="center">
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setDelete(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonAccept]}
                                onPress={() => {deleteList.mutate(); setDelete(false); refetch()}}
                            >
                                <Text style={styles.textStyle}>Delete</Text>
                            </Pressable>
                        </HStack>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = ({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        paddingLeft: 50,
        paddingRight: 50,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        marginTop: 15,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonAccept: {
        backgroundColor: "red",
    },
    buttonCancel: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});