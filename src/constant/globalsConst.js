import { Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

const globalsConst = {
    isInternetConnected: false,
    height,
    width,
    isIphoneX: Platform.OS === "ios" && (height > 800 || width > 800) ? true : false
};
export default globalsConst;
