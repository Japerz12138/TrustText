import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResultCard from '../components/ResultCard';


export default function Index() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'waiting' | 'safe' | 'sus' | 'dangerous';
    score: string;
    message: string;
  }>({
    status: 'waiting',
    score: '',
    message: 'Enter a message from a stranger to check for potential fraud!',
  });

  //Test Code starts
  const [testIndex, setTestIndex] = useState(0);

  const statusOrder = ['waiting', 'safe', 'sus', 'dangerous'] as const;
  const messageOrder = {
    waiting: "I'm Tired!",
    safe: "LOOKS FINE!",
    sus: "AmongUS",
    dangerous: "LMAO!"
  };

  //Test Code Ends, make sure delete in production

  const analyzingText = async () => {

    if (!text.trim()) {
      setResult({
        status: 'waiting',
        score: '',
        message: 'Please enter a message to analyze',
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      const { status, sus_score, explanation } = data;
  
      setResult({
        status: status,
        score: `Risk Score: ${sus_score}%`,
        message: `${explanation.join('\n')}`,
      });
    } catch (error) {
      //console.error(error);
      setResult({
        status: 'dangerous',
        score: '',
        message: 'Error, Please try again',
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  //This is the function to test the card, basically looping 4 different status
  // const cardTest = async () => {
  //   const nextIndex = (testIndex + 1) % statusOrder.length;
  //   const nextStatus = statusOrder[nextIndex];

  //   setTestIndex(nextIndex);

  //   setResult({
  //     status: nextStatus,
  //     message: messageOrder[nextStatus]
  //   });
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TrustText</Text>
        <Text style={styles.subtitle}>Enter the message from a stranger to detect if it's a scam.</Text>

        <TextInput
          style={styles.inputBox}
          multiline
          numberOfLines={4}
          value={text}
          onChangeText={setText}
          placeholder="Paste your SMS message here..."
          placeholderTextColor="#9CA3AF"
          clearButtonMode="always"
        />

        <ResultCard
          status={result.status}
          score={result.score}
          message={result.message}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={analyzingText}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Check Message</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  content: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
