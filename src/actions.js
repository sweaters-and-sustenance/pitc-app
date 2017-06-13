import ReactNative from 'react-native';
import geolib from 'geolib';
var {
  PermissionsAndroid,
  Platform
} = ReactNative;
import {
  API_URL,
  MAP_CIRCLE_INSET
} from './constants';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';
export const USER_SIGNUP = 'USER_SIGNUP';
export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS';
export const USER_SIGNUP_FAILED = 'USER_SIGNUP_FAILED';
export const USER_LOGOUT = 'USER_LOGOUT';

export const USER_ACCOUNT = 'USER_ACCOUNT';

export const MARKER = {
  HOMELESS: {
    INCREMENT: 'MARKER_HOMELESS_INCREMENT',
    DECREMENT: 'MARKER_HOMELESS_DECREMENT'
  },
  MEALS: {
    INCREMENT: 'MARKER_MEALS_INCREMENT',
    DECREMENT: 'MARKER_MEALS_DECREMENT'
  },
  CLOTHES: {
    INCREMENT: 'MARKER_CLOTHES_INCREMENT',
    DECREMENT: 'MARKER_CLOTHES_DECREMENT'
  }
}
export const MARKER_LOCATION = 'MARKER_LOCATION';
export const SAVED_MARKER = 'SAVED_MARKER';
export const SAVE_MARKER_FAILED = 'SAVE_MARKER_FAILED';
export const MARKER_CLEAR = 'MARKER_CLEAR';

export const userLogout = () => ({type: USER_LOGOUT});

function authenticate(credentials,action,successAction,failureAction) {
  return (dispatch) => {
    fetch(API_URL+'/api/user/'+action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.token) {
        dispatch({type: successAction, token: responseData.token})
      } else if (responseData.error) {
        dispatch({type: failureAction, error: responseData.error})
      } else {
        dispatch({type: failureAction, error: 'Unknown error'})
      }
    })
    .catch((error) => {
      dispatch({type: failureAction, error: error.message})
    })
    .done();
  }
}

function authenticatedRequest(dispatch,getState,action,method,payload,complete,errored) {
  if (getState().user.token) {
    fetch(API_URL+action, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + getState().user.token
      },
      body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.error) {
        errored(responseData.error);
      } else {
        complete(responseData);
      }
    })
    .catch((error) => {
      errored(error.message);
    })
    .done();
  } else {
    errored({'error':'Not logged in'});
  }
}

export const userLogin = (credentials) => {
  return authenticate(credentials,'login',USER_LOGIN_SUCCESS,USER_LOGIN_FAILED);
}

export const userSignup = (credentials) => {
  return authenticate(credentials,'signup',USER_SIGNUP_SUCCESS,USER_SIGNUP_FAILED);
}

export const incrementMarker = (type) => {
  return {
    type: MARKER[type].INCREMENT
  }
}

export const decrementMarker = (type) => {
  return {
    type: MARKER[type].DECREMENT
  }
}

export const setMarkerLocation = (location) => {
  return {
    type: MARKER_LOCATION,
    location: {
      coordinates: {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      },
      region: {
        latitudeDelta: location.region.latitudeDelta,
        longitudeDelta: location.region.longitudeDelta
      },
      locationUpdated: true
    }
  }
}

export const newMarker = () => {
  return (dispatch) => {
    dispatch(clearMarker());
    let watchID;
    const watchLocation = () => {
      watchID = navigator.geolocation.watchPosition((position) => {
        dispatch({
          type: MARKER_LOCATION,
          location: {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            region: {
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            },
            locationUpdated: false
          }
        })
        if (watchID) navigator.geolocation.clearWatch(watchID);
      }, null, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted && this.mounted) watchLocation();
        });
    } else {
      watchLocation();
    }
  }
}

export const clearMarker = () => {
  return {
    type: MARKER_CLEAR
  }
}

export const saveMarker = () => {
  return (dispatch,getState) => {
    const deltaY = geolib.getDistance(
      {
        latitude: getState().marker.location.coordinates.latitude,
        longitude: getState().marker.location.coordinates.longitude
      },
      {
        latitude: getState().marker.location.coordinates.latitude - (getState().marker.location.region.latitudeDelta * MAP_CIRCLE_INSET),
        longitude: getState().marker.location.coordinates.longitude
      }
    );
    const deltaX = geolib.getDistance(
      {
        latitude: getState().marker.location.coordinates.latitude,
        longitude: getState().marker.location.coordinates.longitude
      },
      {
        latitude: getState().marker.location.coordinates.latitude,
        longitude: getState().marker.location.coordinates.longitude - (getState().marker.location.region.longitudeDelta * MAP_CIRCLE_INSET)
      }
    );
    const body = {
      latitude: getState().marker.location.coordinates.latitude,
      longitude: getState().marker.location.coordinates.longitude,
      radius: Math.min(deltaY,deltaX) / 2,
      homeless: getState().marker.counts.homeless,
      meals: getState().marker.counts.meals,
      clothes: getState().marker.counts.clothes
    }
    authenticatedRequest(dispatch,getState,'/api/marker','POST',body,(response) => {
      dispatch({type: SAVED_MARKER})
    },(error) => {
      dispatch({type: SAVE_MARKER_FAILED, error})
    })
  }
}

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}
