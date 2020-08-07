import { Dimensions, } from 'react-native';

const { height, width } = Dimensions.get('window');

const matrix = {
    height,
    width,
    marginHorizontal: width * 0.05
}
export default matrix; 
