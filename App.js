import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [register, setRegister] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#075E54" /></View>;
  }

  if (user) return <HomeScreen user={user} />;

  return register
    ? <RegisterScreen onLogin={() => setRegister(false)} />
    : <LoginScreen onRegister={() => setRegister(true)} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" }
});