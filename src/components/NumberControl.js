import ReactNative from 'react-native';
import React, { Component } from 'react';
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} = ReactNative;
import {
  STANDARD_PADDING
} from '../constants'
import {
  incrementMarker,
  decrementMarker
} from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  labelText: {
    alignSelf: 'center',
    flex: 0.1
  },
  directionButton: {
    flex: 0.3,
    justifyContent: 'center',
    padding: 0
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3
  },
  outputText: {
    alignSelf: 'center',
    fontSize: STANDARD_PADDING * 4,
  },
  arrow: {
    resizeMode: 'contain',
    width: null,
    height: null,
    flex: 1,
    margin: STANDARD_PADDING
  }
});

class NumberControl extends Component {
  constructor(props) {
    super(props)
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.props.incrementMarker(this.props.type);
  }

  decrement() {
    this.props.decrementMarker(this.props.type);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.labelText]}>
          { this.props.label }
        </Text>
        <TouchableHighlight style={[styles.directionButton]} onPress={this.increment} underlayColor="rgba(0,0,0,0)">
          <Image
            source={require('../../assets/img/arrow_up.png')}
            style={[styles.arrow]}
          />
        </TouchableHighlight>
        <View style={[styles.textWrapper]}>
          <Text style={[styles.outputText]}>
            { this.props.marker.counts[this.props.type.toLowerCase()] }
          </Text>
        </View>
        <TouchableHighlight style={[styles.directionButton]} onPress={this.decrement} underlayColor="rgba(0,0,0,0)">
          <Image
            source={require('../../assets/img/arrow_down.png')}
            style={[styles.arrow]}
          />
        </TouchableHighlight>
      </View>
    )
  }
}

const stateToProps = (state) => {
  return {
    marker: state.marker
  }
}

const dispatchToProps = (dispatch) => {
  return bindActionCreators({
    incrementMarker,
    decrementMarker
  }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(NumberControl)
