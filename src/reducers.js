import { combineReducers } from 'redux'
import {
  USER_LOGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_SIGNUP,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILED,
  USER_LOGOUT,
  MARKER,
  MARKER_LOCATION,
  SAVED_MARKER,
  SAVE_MARKER_FAILED,
  MARKER_CLEAR
} from './actions';
import { AppNavigator } from './navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
const initialNavState = AppNavigator.router.getStateForAction(
  secondAction,
  tempNavState
);

const nav = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
    case USER_SIGNUP_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case USER_LOGOUT:
    case USER_LOGIN:
    case USER_SIGNUP:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}


const initialUserState = {
  token: null,
  user: null,
  error: null
};

const user = (state = initialUserState, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return Object.assign({},state,{
        token: action.token,
        error: null
      });
    case USER_LOGIN_FAILED:
      return Object.assign({},state,{
        token: null,
        error: action.error
      });
    case USER_SIGNUP_SUCCESS:
      return Object.assign({},state,{
        token: action.token,
        error: null
      });
    case USER_SIGNUP_FAILED:
      return Object.assign({},state,{
        token: null,
        error: action.error
      });
    case USER_LOGOUT:
    case USER_LOGIN:
    case USER_SIGNUP:
      return Object.assign({},initialUserState);
    default:
      return state;
  }
}

const initialMarkerState = {
  location: {
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    radius: 0.05,
    locationUpdated: false
  },
  counts: {
    homeless: 0,
    meals: 0,
    clothes: 0
  },
  saved: false,
  error: null
}

const marker = (state = initialMarkerState, action) => {
  switch (action.type) {
    case MARKER.HOMELESS.INCREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          homeless: state.counts.homeless+1
        })
      });
    case MARKER.HOMELESS.DECREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          homeless: Math.max(0,state.counts.homeless-1)
        })
      });
    case MARKER.MEALS.INCREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          meals: state.counts.meals+1
        })
      });
    case MARKER.MEALS.DECREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          meals: Math.max(0,state.counts.meals-1)
        })
      });
    case MARKER.CLOTHES.INCREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          clothes: state.counts.clothes+1
        })
      });
    case MARKER.CLOTHES.DECREMENT:
      return Object.assign({},state,{
        counts: Object.assign({},state.counts,{
          clothes: Math.max(0,state.counts.clothes-1)
        })
      });
    case MARKER_LOCATION:
      return Object.assign({},state,{
        location: Object.assign({},state.location,{
          coordinates: action.location.coordinates,
          radius: action.location.radius,
          locationUpdated: action.location.locationUpdated
        })
      });
    case SAVED_MARKER:
      return Object.assign({},state,{
        saved: true,
        error: null
      });
    case SAVE_MARKER_FAILED:
      return Object.assign({},state,{
        error: action.error
      });
    case MARKER_CLEAR:
      return Object.assign({},state,{
        counts: {
          homeless: 0,
          meals: 0,
          clothes: 0
        },
        saved: false,
        error: null
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  nav,
  user,
  marker
})

export default rootReducer;
