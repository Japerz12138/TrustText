import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ResultType = 'waiting' | 'safe' | 'sus' | 'dangerous';

interface ResultCardProps {
  status: ResultType;
  message: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ status, message }) => {
  const getGradientColors = (): [string, string] => {
    switch (status) {
      case 'safe': return ['#34D399', '#10B981'];
      case 'sus': return ['#FBBF24', '#F59E0B'];
      case 'dangerous': return ['#EF4444', '#DC2626'];
      default: return ['#9CA3AF', '#6B7280'];
    }
  };

  const getIcon = (): "shield-check" | "shield-alert" | "shield-off" | "shield-outline" => {
    switch (status) {
      case 'safe': return 'shield-check';
      case 'sus': return 'shield-alert';
      case 'dangerous': return 'shield-off';
      default: return 'shield-outline';
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.content}>
        <MaterialCommunityIcons name={getIcon()} size={32} color="white" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </LinearGradient>
  );
};

export default ResultCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
});
