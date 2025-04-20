import React, { useState } from "react";
import { Text, View, TextInput, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";


export default function Index() {
  const [sms, setSms] = useState("");
  const [msgClass, setMsgClass] = useState("ham");
  const [feedback, setFeedback] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<string[]>([]);
  const router = useRouter();






  const fetchMessagesByClass = async (type: "ham" | "spam") => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/messages_by_class?class=${type}`);
      const data = await response.json();
      const messages = data.map((msg: any) => msg[2]); // msg[2] = sms text
      setFilteredMessages(messages);
    } catch (err) {
      setFilteredMessages(["Error fetching messages."]);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to Trust Text</Text>

      

      


      {feedback ? <Text style={{ marginTop: 10 }}>{feedback}</Text> : null}

      <View style={{ marginVertical: 20 }}>
        <Button title="Show All Ham Messages" onPress={() => fetchMessagesByClass("ham")} />
        <View style={{ height: 10 }} />
        <Button title="Show All Spam Messages" onPress={() => fetchMessagesByClass("spam")} />
        <View style={{ height: 10 }} />
        <Button title="Check Message" onPress={() => router.push("/check")} />

      </View>

      {filteredMessages.length > 0 && (
        <View style={{ width: "100%" }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Filtered Messages:</Text>
          {filteredMessages.map((msg, index) => (
            <Text key={index} style={{ marginBottom: 5 }}>
              • {msg}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
