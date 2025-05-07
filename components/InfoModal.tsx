import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function InfoModal({ isVisible, onClose }: InfoModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>About TrustText</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Version</Text>
            <Text style={styles.sectionText}>1.0.0</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal Information</Text>
            <Text style={styles.sectionText}>
              © 2025 TrustText. All rights reserved.
            </Text>
            <Text style={styles.sectionText}>
              This app is designed to help detect potential SMS fraud but should not be considered as definitive legal or security advice. Always exercise caution with suspicious messages.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Dataset Source</Text>
            <Link style={styles.sectionLink} href={'https://github.com/vinit9638/SMS-scam-detection-dataset'}>https://github.com/vinit9638/SMS-scam-detection-dataset</Link>
            <Link style={styles.sectionLink} href={'https://archive.ics.uci.edu/dataset/228/sms+spam+collection'}>https://archive.ics.uci.edu/dataset/228/sms+spam+collection</Link>
            
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developers</Text>
            <Text style={styles.sectionText}>
              Created by Jack, Ken, XinJin and Amna
            </Text>
            <Text style={styles.sectionText}>
              Information Retrival - Spring 2025
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  sectionLink: {
    color: '#3B82F6'
  },
});