import React, { Component } from 'react';
import AppWithNavigationState from '../navigators/AppNavigator';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <AppWithNavigationState />
    );
  }
}


const stateToProps = (state) => {
  return {
    nav: state.nav,
  }
}


export default connect(stateToProps)(App)
