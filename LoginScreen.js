import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email || !password) return Alert.alert("Missing information", "Enter your email and password.");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      Alert.alert("Login failed", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ChatApp</Text>
      <Text style={styles.subtitle}>Simple. Private. Connected.</Text>

      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.link}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:25,backgroundColor:"#fff"},
  logo:{fontSize:42,fontWeight:"800",color:"#075E54",textAlign:"center"},
  subtitle:{textAlign:"center",color:"#777",marginBottom:35,marginTop:8},
  input:{height:55,borderWidth:1,borderColor:"#ddd",borderRadius:12,paddingHorizontal:16,marginBottom:15,fontSize:16},
  button:{height:55,borderRadius:12,backgroundColor:"#075E54",justifyContent:"center",alignItems:"center",marginTop:5,marginBottom:22},
  buttonText:{color:"#fff",fontWeight:"800",fontSize:16},
  link:{textAlign:"center",color:"#075E54",fontWeight:"700"}
});