import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; //https://icons.expo.fyi/Index

type ResultType = 'waiting' | 'safe' | 'sus' | 'dangerous';

interface ResultCardProps {
    status: ResultType;
    score: string;
    message: string;
}

export default function ResultCard({ status, score, message }: ResultCardProps) {
    const colorPicker = () => {
        switch (status) {
            case 'safe':
                return ['#34D399', '#10B981'];
            case 'sus':
                return ['#FBBF24', '#F59E0B'];
            case 'dangerous':
                return ['#EF4444', '#DC2626'];
            default:
                return ['#9CA3AF', '#6B7280'];
        }
    };

    const iconPicker = () => {
        switch (status) {
            case 'safe':
                return 'shield-check';
            case 'sus':
                return 'shield-alert';
            case 'dangerous':
                return 'shield-off';
            default:
                return 'shield-outline';
        }
    };

    const labelPicker = () => {
        switch (status) {
            case 'safe':
                return 'SAFE';
            case 'sus':
                return 'SUSPICIOUS';
            case 'dangerous':
                return 'DANGEROUS';
            default:
                return 'STANDBY';
        }
    };

    return (
        <LinearGradient
            colors={colorPicker()} //It... works fine, so leave it till I find a better way doing this
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={styles.backgroundLabel}>
                {labelPicker()}
            </Text>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name={iconPicker()}
                    size={32}
                    color='white'
                    style={styles.icon} />
                <View style={styles.textContent}>
                    <Text style={styles.score}>{score}</Text>
                    <View style={styles.messageContainer}>
                        <View style={styles.line} />
                        <Text style={styles.message}>{message}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

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
        alignItems: 'flex-start',
    },
    textContent: {
        flex: 1,
        flexDirection: 'column',
    },
    icon: {
        marginRight: 12,
        marginTop: 4,
    },
    score: {
        color: 'white',
        fontSize: 25,
        fontWeight: '700',
        marginRight: 12,
        marginBottom: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    line: {
        width: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginRight: 8,
        alignSelf: 'stretch',
    },
    message: {
        color: 'white',
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
    },
    backgroundLabel: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        fontSize: 48,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1,
    }
});