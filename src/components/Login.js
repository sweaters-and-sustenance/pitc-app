import ReactNative from 'react-native';
import {
  buttons,
  misc,
  inputs
} from '../styles';
import {
  STANDARD_PADDING,
  COLOR_GRAY,
  COLOR_SALMON
} from '../constants';
import React, { Component } from 'react';
import {
  userLogin,
  userLogout,
  userSignup
} from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  StatusBar
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: null,
    height: null,
    flex: 1,
  },
  foregroundContainer: {
    // justifyContent: 'center',
    marginTop: STANDARD_PADDING * 4,
    padding: STANDARD_PADDING,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  title: {
    fontSize: STANDARD_PADDING * 3,
    alignSelf: 'center',
    marginBottom: STANDARD_PADDING * 1.5
  },
  logo: {
    resizeMode: 'contain',
    width: null,
    height: null,
    flex: 0.2
  },
  form: {
    flex: 0.8
  },
  button: {
    marginBottom: STANDARD_PADDING
  },
  errorContainer: {
    backgroundColor: COLOR_SALMON,
    padding: STANDARD_PADDING,
    marginBottom: STANDARD_PADDING,
    borderRadius: 3
  },
  errorText: {
    color: '#fff'
  }
});

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      'email': null,
      'password': null
    }
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  signup() {
    this.props.userSignup({
      email: this.state.email,
      password: this.state.password
    })
  }

  login() {
    this.props.userLogin({
      email: this.state.email,
      password: this.state.password
    })
  }

  render() {
    return (
      <View style={[styles.container]}>
        <StatusBar
          barStyle="light-content"
          />
        <Image style={styles.backgroundImage} source={require('../../assets/img/wood.jpg')} />
        <View style={[styles.foregroundContainer]}>
          <Image style={[styles.row,styles.logo]} source={require('../../assets/img/white_logo.png')} />
          <View style={[styles.form]}>
            { this.props.user.error != null &&
              <View style={[styles.row,styles.errorContainer]}>
                <Text style={styles.errorText}>{this.props.user.error}</Text>
              </View>
            }
            <View style={[styles.row]}>
              <TextInput autoFocus={true} keyboardType="email-address" autoCapitalize="none" placeholder="Email" style={inputs.base} onChangeText={(email) => this.setState({email})} />
            </View>
            <View style={[styles.row]}>
              <TextInput placeholder="Password" secureTextEntry={true} style={inputs.base} onChangeText={(password) => this.setState({password})} />
            </View>
            <View style={[styles.row]}>
              <TouchableHighlight style={[buttons.base,buttons.primary,styles.button]} onPress={this.signup} underlayColor={COLOR_GRAY}>
                <Text style={buttons.primaryText}>Signup</Text>
              </TouchableHighlight>
              <TouchableHighlight style={[buttons.base,buttons.secondary,styles.button]} onPress={this.login} underlayColor={COLOR_GRAY}>
                <Text style={buttons.secondaryText}>Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Login.navigationOptions = {
  header: null
}

const stateToProps = (state) => {
  return {
    user: state.user
  }
}

const dispatchToProps = (dispatch) => {
  return bindActionCreators({
    userLogin,
    userSignup,
    userLogout,
  }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(Login)
