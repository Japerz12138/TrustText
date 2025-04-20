import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function CheckMessage() {
  const [smsToCheck, setSmsToCheck] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/check_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sms: smsToCheck }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setResult("Error contacting server.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Check if your message is spam or ham</Text>
      <TextInput
        placeholder="Enter your message"
        value={smsToCheck}
        onChangeText={setSmsToCheck}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Check Message" onPress={handleCheck} />

      {result ? <Text style={{ marginTop: 20 }}>{result}</Text> : null}
    </View>
  );
}
