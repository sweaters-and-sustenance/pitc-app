import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import Login from '../components/Login';
import Main from '../components/Main';

export const AppNavigator = StackNavigator({
  Login: { screen: Login },
  Main: { screen: Main },
},{
    mode: 'modal',
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
