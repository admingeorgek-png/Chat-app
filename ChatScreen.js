import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function chatId(a,b) {
  return [a,b].sort().join("_");
}

export default function ChatScreen({ me, other, onBack }) {
  const id = chatId(me.uid, other.uid);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "chats", id, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, snap => setMessages(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, [id]);

  async function send() {
    const value = text.trim();
    if (!value) return;
    setText("");
    await addDoc(collection(db, "chats", id, "messages"), {
      text: value,
      senderId: me.uid,
      receiverId: other.uid,
      createdAt: serverTimestamp()
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <View style={styles.avatar}><Text style={styles.avatarText}>{other.name?.[0]?.toUpperCase() || "?"}</Text></View>
        <View style={{flex:1}}>
          <Text style={styles.name}>{other.name}</Text>
          <Text style={styles.status}>{other.online ? "online" : "offline"}</Text>
        </View>
      </View>

      <FlatList
        style={styles.messages}
        contentContainerStyle={{padding:16}}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const mine = item.senderId === me.uid;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={mine ? styles.mineText : styles.theirText}>{item.text}</Text>
            </View>
          );
        }}
      />

      <View style={styles.composer}>
        <TextInput style={styles.input} placeholder="Message" value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={styles.send} onPress={send}><Text style={styles.sendText}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#efeae2"},
  header:{height:90,paddingTop:35,paddingHorizontal:12,backgroundColor:"#075E54",flexDirection:"row",alignItems:"center"},
  back:{color:"#fff",fontSize:40,width:35,lineHeight:35},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:"#fff",justifyContent:"center",alignItems:"center",marginRight:12},
  avatarText:{color:"#075E54",fontSize:18,fontWeight:"800"},
  name:{color:"#fff",fontSize:17,fontWeight:"800"},
  status:{color:"#d5eee9",fontSize:12,marginTop:2},
  messages:{flex:1},
  bubble:{maxWidth:"78%",paddingHorizontal:13,paddingVertical:9,borderRadius:12,marginBottom:8},
  mine:{alignSelf:"flex-end",backgroundColor:"#d9fdd3"},
  theirs:{alignSelf:"flex-start",backgroundColor:"#fff"},
  mineText:{color:"#111",fontSize:15},
  theirText:{color:"#111",fontSize:15},
  composer:{flexDirection:"row",padding:8,backgroundColor:"#f0f0f0",alignItems:"flex-end"},
  input:{flex:1,minHeight:45,maxHeight:110,backgroundColor:"#fff",borderRadius:22,paddingHorizontal:16,paddingVertical:10,fontSize:15},
  send:{width:45,height:45,borderRadius:23,backgroundColor:"#075E54",justifyContent:"center",alignItems:"center",marginLeft:7},
  sendText:{color:"#fff",fontSize:21}
});