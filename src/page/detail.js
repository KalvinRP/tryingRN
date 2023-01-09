import { Center, Box, Image, ScrollView } from "native-base";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Detail({ route }) {
    const { list, Backcolor } = route.params;

    const Fetched = list
    const Backcoloring = Backcolor

    return (
        <View>
            <ScrollView>
            <Center>
            <Box rounded={"xl"} backgroundColor={Backcoloring} minHeight={700} style={{marginTop: 10, marginBottom: 10, paddingBottom: 80, width: 350}}>
                <Text style={{maxWidth: 230, marginLeft: 30, marginTop: 40, fontSize: 30, fontWeight: '900'}}>{Fetched.category[0].name} - {Fetched.name}</Text>
                <Box position={"absolute"} right={5} top={2} rounded="md" ml={3} my={1} py={2} px={4} maxWidth={150} backgroundColor={"fuchsia.300"}>
                {
                    Fetched.status === "Done" ? 
                    <Image source={require('../../assets/done.png')} alt="loading" style={{position: "absolute", right: 15, top: 50, width: 40, height: 40}} /> :
                    <Image source={require('../../assets/soon.png')} alt="loading" style={{position: "absolute", right: 15, top: 50, width: 40, height: 40}} />
                }
                    <Center> 
                        <Text fontSize="20">{Fetched.category[0].name}</Text>
                    </Center>
                </Box>
                <Text style={{textAlign: "justify", marginLeft: 30, marginRight: 30, marginTop: 60, fontSize: 18}}>{Fetched.desc}</Text>
            </Box>
            <Box flexDirection="row" marginTop={2} position="absolute" bottom={5} left={10}>
                <Ionicons name="calendar-outline" size={16} color="darkslategray"></Ionicons>
                <Text style={{fontSize: 13, color: "darkslategrey"}}>   {Fetched.date}</Text>
            </Box>
            </Center>
        </ScrollView>
        </View>
    )
}