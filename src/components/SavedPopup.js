import ReactNative from 'react-native';
import React, { Component } from 'react';
var {
  StyleSheet,
  Text,
  View,
} = ReactNative;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  COLOR_BLUE,
  STANDARD_PADDING,
  COLOR_GRAY
} from '../constants';
import {
} from '../actions';

const styles = StyleSheet.create({
  successOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: COLOR_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: STANDARD_PADDING * 2,
    marginRight: STANDARD_PADDING * 2,
    padding: STANDARD_PADDING,
    borderRadius: 3
  },
  successText: {
    color: '#FFF'
  }
});

class SavedPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.marker.saved != this.props.marker.saved && nextProps.marker.saved === true) {
      this.setState({visible: true});
      setTimeout(() => {
        this.setState({visible: false});
      },1000);
    }
  }

  render() {
    return (
      <View style={[styles.successOverlay,this.state.visible ? {opacity:1} : {opacity:0}]} pointerEvents={this.state.visible ? 'auto' : 'none'}>
        <View style={styles.successMessage}>
          <Text style={styles.successText}>
            Marker Saved!
          </Text>
        </View>
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

  }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(SavedPopup);
