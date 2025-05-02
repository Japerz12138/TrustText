import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000';
  } else if (Platform.OS === 'android') {
    return 'http://192.168.50.96:5000';
  } else {
    return 'http://192.168.50.96:5000';
  }
};

export default getBaseURL;
