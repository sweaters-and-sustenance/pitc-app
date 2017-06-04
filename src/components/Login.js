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
  TextInput
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: STANDARD_PADDING * 4,
    padding: STANDARD_PADDING,
  },
  title: {
    fontSize: STANDARD_PADDING * 3,
    alignSelf: 'center',
    marginBottom: STANDARD_PADDING * 1.5
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
      <View style={[styles.container,misc.container]}>
        <View>
          <Text style={styles.title}>Login on Create Account</Text>
        </View>
        { this.props.user.error != null &&
          <View style={[styles.errorContainer]}>
            <Text style={styles.errorText}>{this.props.user.error}</Text>
          </View>
        }
        <View>
          <TextInput autoFocus={true} keyboardType="email-address" autoCapitalize="none" placeholder="Email" style={inputs.base} onChangeText={(email) => this.setState({email})} />
        </View>
        <View>
          <TextInput placeholder="Password" secureTextEntry={true} style={inputs.base} onChangeText={(password) => this.setState({password})} />
        </View>
        <View>
          <TouchableHighlight style={[buttons.base,buttons.primary,styles.button]} onPress={this.signup} underlayColor={COLOR_GRAY}>
            <Text style={buttons.primaryText}>Signup</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[buttons.base,buttons.secondary,styles.button]} onPress={this.login} underlayColor={COLOR_GRAY}>
            <Text style={buttons.secondaryText}>Login</Text>
          </TouchableHighlight>
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
