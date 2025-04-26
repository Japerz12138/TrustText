import { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResultCard from '../components/ResultCard';


export default function Index() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'waiting' | 'safe' | 'sus' | 'dangerous' ;
    message: string;
  }>({
    status: 'waiting',
    message: 'Enter a message to check for potential fraud!',
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
    if(!text.trim()) {
      setResult({
        status: 'waiting',
        message: 'Please enter a message to analyze',
      });
      return;
    }

    setIsLoading(true);
    try {
      //TODO: Connect to backend here
    } catch (error) {
      setResult({
        status: 'dangerous',
        message: 'Error, Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  //This is the function to test the card, basically looping 4 different status
  const cardTest = async() => {
    const nextIndex = (testIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];

    setTestIndex(nextIndex);

    setResult({
      status: nextStatus,
      message: messageOrder[nextStatus]
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TrustText</Text>
        <Text style={styles.subtitle}>Enter the message you want to analyze</Text>
        
        <ResultCard
          status={result.status}
          message={result.message}
        />

        <Button
          onPress = {cardTest}
          title = "TEST the CARD"
          accessibilityLabel = "Test the card button"
        />
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
  },
});
