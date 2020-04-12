import "react-native-gesture-handler";
import React, { useEffect, useState, Component } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Picker,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  Button,
  Alert
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const width_screen = Dimensions.get('window').width;
const height_screen = Dimensions.get('window').height;


async function SubmitLogin(navigation,obj){
	
  if(obj.email == '' || obj.password == '') return;
  let response = await fetch("http://202.43.108.51:8083/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailaddress: obj.email,
      pwd: obj.password,
      organization_id: "trungan",
    }),
  });
  let result = await response.json();
  console.log(obj);
  console.log(result);
  if (result.user.access_token) {
    navigation.navigate("Details", {
      user_id: result.user.user_id,
      displayname: result.user.displayname
    });
  } else {
    Alert.alert(result.user.error_description);
  }
}


function LoginScreen({navigation}){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const obj = {
    email: email,
    password: password
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <View style={styles.logoContainer1}>
          <Image
            style={styles.logo}
            source={{ uri: "https://vidagis.com/uploads/logo-vidagis.png" }}
          ></Image>
          <Text style={styles.title}>Account Information</Text>
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter username/email"
            placeholderTextColor="rgba(255,255,255,0.8)"
            keyboardType="email-address"
            returnKeyType="next"
            autoCorrect={false}
            //onSubmitEditing={() => this.refs.txtPassword.focus()}
            onChangeText={(val) => setEmail(val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            returnKeyType="go"
            secureTextEntry
            autoCorrect={false}
            //ref={"txtPassword"}
            onChangeText={(val) => setPassword(val)}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => SubmitLogin(navigation, obj)}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DetailsScreen({ navigation, route }) {
  const { user_id } = route.params;
  const { displayname } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>user_id: {user_id}</Text>
      <Text>displayname: {displayname}</Text>
      <Button
        title="Go Back"
        //onPress={() => navigation.navigate("Details")}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}


const Stack = createStackNavigator();

export default App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);


  handlePress  = async () =>{ 
    let response = await fetch("http://202.43.108.51:8083/api/asset/status");
    let commits = await response.json();
    setData(commits);
    setLoading(false);
  }
  
  useEffect(() => {
    handlePress();
  },[]);
    
  let serviceItems = data.map((s, i) => {
    return <Picker.Item key={i} value={s.code} label={s.name} />;
  });
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(32, 53, 70)",
    flexDirection: "column",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer1: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 210,
    height: 60,
  },
  title: {
    color: "#f7c744",
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
  infoContainer: {
    //position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    height: 200,
    padding: 20,
    // backgroundColor: 'red'
    width: width_screen
  },
  input: {
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#FFF",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "#f7c744",
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "rgb(32, 53, 70)",
    fontWeight: "bold",
    fontSize: 18,
  },
});