import {
  StyleSheet
} from 'react-native';
import {
  COLOR_BLUE
} from '../constants';

const buttons = StyleSheet.create({
  base: {
    height: 45,
    borderRadius: 3,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: COLOR_BLUE,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLOR_BLUE
  },
  primaryText: {
    color: '#FFFFFF',
    alignSelf: 'center'
  },
  secondaryText: {
    color: COLOR_BLUE,
    alignSelf: 'center'
  }
});
export default buttons;
