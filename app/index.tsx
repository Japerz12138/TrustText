import { useEffect, useState, useLayoutEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResultCard from '../components/ResultCard';
import { useNavigation } from '@react-navigation/native';


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

  //This part is hidding the navigation bar
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerShown: false,
    });
  }, [navigation]);

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

      let summary = '';
      if (sus_score >= 80) {
        summary = 'This message looks dangerous!';
      } else if (sus_score >= 50) {
        summary = 'This message could be suspicious!';
      } else {
        summary = 'Looks safe!';
      }

      setResult({
        status: status,
        score: summary,
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

  const resetState = () => {
    setText('');
    setResult({
      status: 'waiting',
      score: '',
      message: 'Please enter a message to analyze',
    });
    return;
  }

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
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>TrustText</Text>
            <Text style={styles.titleHighlight}>SMS Frad Detector</Text>
            <Text style={styles.subtitle}>Protect yourself from unknown scam messages</Text>
          </View>

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


          {text.trim() !== '' && (
            <TouchableOpacity
              style={styles.subButton}
              onPress={resetState}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          )}


          <View style={styles.flexGrow} />
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={styles.mainButton}
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
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
    padding: 20
  },
  flexGrow: {
    flex: 1
  },
  buttonContainer: {
    marginBottom: 20
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16
  },
  mainButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  subButton: {
    backgroundColor: '#99A0AC',
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