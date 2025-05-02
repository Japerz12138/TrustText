import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

type ResultType = 'waiting' | 'safe' | 'sus' | 'dangerous';

const suspiciousWords = ['free money', 'urgent', 'click here', 'prize', 'winner'];
const dangerousWords = ['scam', 'fraud', 'hack', 'steal', 'giveaway', 'phishing'];
const safeDomains = ['google.com', 'amazon.com', 'facebook.com', 'youtube.com'];
const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

const normalizeText = (text: string) =>
  text.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();

const detectKeywords = (text: string, keywords: string[]) => {
  const normalized = normalizeText(text);
  return keywords.filter((word) => normalized.includes(word.toLowerCase()));
};

const detectURLs = (text: string) => {
  const urls = text.match(urlRegex) || [];
  return urls.filter((url) => {
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    return !safeDomains.some((safeDomain) => domain.includes(safeDomain));
  });
};

const generateReasons = (
  suspicious: string[],
  dangerous: string[],
  urls: string[]
): string[] => {
  const reasons: string[] = [];

  if (dangerous.length > 0) {
    reasons.push(`Contains risky words like: ${dangerous.join(', ')}. These are common in scams or frauds.`);
  }

  if (urls.length > 0) {
    reasons.push(`Includes URLs like: ${urls.join(', ')}. These might point to untrustworthy sites.`);
  }

  if (suspicious.length > 0) {
    reasons.push(`Suspicious words detected: ${suspicious.join(', ')}. These are frequently used in scams.`);
  }

  if (reasons.length === 0) {
    reasons.push(`The message seems neutral and doesn't show obvious red flags.`);
  }

  return reasons;
};

const computeMessageStatus = (
  suspicious: string[],
  dangerous: string[],
  urls: string[]
): { result: ResultType; reasons: string[]; classification: string } => {
  let result: ResultType = 'safe';
  const reasons = generateReasons(suspicious, dangerous, urls);
  let classification = 'Safe';

  if (dangerous.length > 0 || urls.length > 0) {
    result = 'dangerous';
    classification = 'Dangerous';
  } else if (suspicious.length > 0) {
    result = 'sus';
    classification = 'Suspicious';
  } else {
    result = 'safe';
    classification = 'Safe';
  }

  return { result, reasons, classification };
};

const characterizeWord = (word: string) => {
  return word
    .split('')
    .map((char) => {
      switch (char.toLowerCase()) {
        case 'a': return '@';
        case 's': return '$';
        case 'i': return '!';
        case 'o': return '0';
        case 'e': return '3';
        case 'u': return 'µ';
        case 'g': return '9';
        case 'l': return '1';
        case 'h': return '#';
        case 'c': return '(';
        default: return char;
      }
    })
    .join('') + '!';
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ResultType>('waiting');
  const [history, setHistory] = useState<
    { text: string; reason: string; classification: string; timestamp: string }[]
  >([]);

  const handleCheck = async () => {
    if (!inputText.trim()) {
      Alert.alert('Please enter some text!');
      return;
    }

    setLoading(true);
    setResult('');
    setStatus('waiting');

    try {
      const detectedSuspicious = detectKeywords(inputText, suspiciousWords);
      const detectedDangerous = detectKeywords(inputText, dangerousWords);
      const detectedURLs = detectURLs(inputText);

      const { result: statusResult, reasons, classification } = computeMessageStatus(
        detectedSuspicious,
        detectedDangerous,
        detectedURLs
      );

      setResult(statusResult);
      setStatus(statusResult);

      const timestamp = new Date().toLocaleString();
      setHistory((prev) => [
        {
          text: inputText,
          reason: reasons.join(' | '),
          classification,
          timestamp,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Error:', err);
      setResult('Error checking message.');
      setStatus('dangerous');
    }

    setLoading(false);
  };

  const handleClear = () => {
    setInputText('');
    setResult('');
    setStatus('waiting');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Trust Text Scanner</Text>

        <TextInput
          style={styles.input}
          placeholder="Paste your message here..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#aaa"
          multiline
          maxLength={500}
        />

        <Text style={styles.charCount}>{`${inputText.length} / 500`}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCheck}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Checking...' : 'CHECK'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
          >
            <Text style={styles.buttonText}>CLEAR</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        )}

        {status !== 'waiting' && !loading && (
          <ResultCard
            status={status}
            message={
              status === 'safe'
                ? 'No scam detected. Message looks safe.'
                : status === 'sus'
                ? 'Warning: Suspicious content found.'
                : 'Danger: High-risk message detected.'
            }
          />
        )}

        <View style={styles.visualScanContainer}>
          <Text style={styles.visualScanTitle}>Visual Scan</Text>
          <Text style={styles.visualScanText}>
            {inputText.split(' ').map((word, index) => {
              const lower = word.toLowerCase();
              const isSuspicious = suspiciousWords.some((phrase) => lower.includes(phrase));
              const isDangerous = dangerousWords.some((phrase) => lower.includes(phrase));
              const isUrl = urlRegex.test(word);

              let style;
              if (isDangerous) style = styles.dangerousWord;
              else if (isSuspicious) style = styles.suspiciousWord;
              else if (isUrl) style = styles.urlWord;

              const displayedWord =
                isSuspicious || isDangerous ? characterizeWord(word) : word;

              return (
                <Text key={index} style={style}>
                  {displayedWord + ' '}
                </Text>
              );
            })}
          </Text>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Check History</Text>
          {history.length > 0 ? (
            history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>User Message: {item.text}</Text>
                <Text style={[styles.historyClassification, { color: item.classification === 'Dangerous' ? '#EF4444' : item.classification === 'Suspicious' ? '#FF9800' : '#4CAF50' }]}>
                  Classification: {item.classification}
                </Text>
                <Text style={styles.historyReason}>{item.reason}</Text>
                <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.historyText}>No history yet</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

type ResultCardProps = {
  status: ResultType;
  message: string;
};

const ResultCard: React.FC<ResultCardProps> = ({ status, message }) => {
  const backgroundColor =
    status === 'safe' ? '#4CAF50' : status === 'sus' ? '#FF9800' : '#F44336';

  return (
    <View style={[styles.resultCard, { backgroundColor }]}>
      <Text style={styles.resultCardText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#111',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: '#ff4d4f',
    marginRight: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  visualScanContainer: {
    width: '100%',
    marginTop: 30,
    padding: 10,
  },
  visualScanTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  visualScanText: {
    fontSize: 14,
    color: '#333',
  },
  suspiciousWord: {
    backgroundColor: '#FBBF24',
    color: '#fff',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  dangerousWord: {
    backgroundColor: '#EF4444',
    color: '#fff',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  urlWord: {
    backgroundColor: '#3B82F6',
    color: '#fff',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  historyContainer: {
    width: '100%',
    marginTop: 40,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  historyClassification: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyReason: {
    fontSize: 12,
    color: '#FF4D4F',
  },
  historyTimestamp: {
    fontSize: 10,
    color: '#aaa',
  },
  resultCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  resultCardText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;
