import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RegisterScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (!name || !email || !password) return Alert.alert("Missing information", "Complete all fields.");
    if (password.length < 6) return Alert.alert("Password", "Use at least 6 characters.");
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        photoURL: "",
        online: true,
        createdAt: Date.now()
      });
    } catch (e) {
      Alert.alert("Registration failed", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Create account</Text>
      <Text style={styles.subtitle}>Join the conversation.</Text>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:25,backgroundColor:"#fff"},
  logo:{fontSize:31,fontWeight:"800",color:"#075E54",textAlign:"center"},
  subtitle:{textAlign:"center",color:"#777",marginBottom:35,marginTop:8},
  input:{height:55,borderWidth:1,borderColor:"#ddd",borderRadius:12,paddingHorizontal:16,marginBottom:15,fontSize:16},
  button:{height:55,borderRadius:12,backgroundColor:"#075E54",justifyContent:"center",alignItems:"center",marginTop:5,marginBottom:22},
  buttonText:{color:"#fff",fontWeight:"800",fontSize:16},
  link:{textAlign:"center",color:"#075E54",fontWeight:"700"}
});