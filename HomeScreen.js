import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import ChatScreen from "./ChatScreen";

export default function HomeScreen({ user }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => d.data()).filter(u => u.uid !== user.uid));
  }

  useEffect(() => { loadUsers(); }, []);

  if (selected) return <ChatScreen me={user} other={selected} onBack={() => setSelected(null)} />;

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.welcome}>Hi, {user.email}</Text>
        </View>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.search} placeholder="Search people..." value={search} onChangeText={setSearch} />

      <Text style={styles.section}>People</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.uid}
        ListEmptyComponent={<Text style={styles.empty}>No other users yet. Create another account to test chatting.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.person} onPress={() => setSelected(item)}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name?.[0]?.toUpperCase() || "?"}</Text></View>
            <View style={{flex:1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#fff",paddingTop:55},
  header:{paddingHorizontal:20,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  title:{fontSize:30,fontWeight:"800",color:"#075E54"},
  welcome:{fontSize:12,color:"#777",marginTop:3,maxWidth:260},
  logout:{color:"#d33",fontWeight:"700"},
  search:{margin:18,height:50,borderWidth:1,borderColor:"#ddd",borderRadius:12,paddingHorizontal:16},
  section:{fontWeight:"800",fontSize:18,paddingHorizontal:20,marginBottom:8},
  person:{flexDirection:"row",alignItems:"center",paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:"#eee"},
  avatar:{width:52,height:52,borderRadius:26,backgroundColor:"#075E54",justifyContent:"center",alignItems:"center",marginRight:14},
  avatarText:{color:"#fff",fontSize:20,fontWeight:"800"},
  name:{fontSize:17,fontWeight:"700"},
  email:{fontSize:13,color:"#777",marginTop:3},
  arrow:{fontSize:28,color:"#aaa"},
  empty:{padding:25,textAlign:"center",color:"#777"}
});