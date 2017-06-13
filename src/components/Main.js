import ReactNative from 'react-native';
import React, { Component } from 'react';
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
  Image
} = ReactNative;
import {
  buttons,
  misc,
  inputs
} from '../styles';
import {
  COLOR_BLUE,
  STANDARD_PADDING,
  MAP_CIRCLE_INSET,
  COLOR_GRAY,
  COLOR_BROWN
} from '../constants';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_ACCOUNT,
  setMarkerLocation,
  newMarker,
  clearMarker,
  saveMarker
} from '../actions';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import NumberControl from './NumberControl';
import SavedPopup from './SavedPopup';
import { bindActionCreators } from 'redux';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  mapContainer: {
    flex: 0.45,
    width: '100%',
    borderWidth: 0,
    marginBottom: STANDARD_PADDING
  },
  map: {
    flex: 1
  },
  mapOverlay: {
    position: 'absolute',
    top: (((1 - MAP_CIRCLE_INSET) / 2) * 100) + '%',
    bottom: (((1 - MAP_CIRCLE_INSET) / 2) * 100) + '%',
    resizeMode: 'contain',
    width: '100%',
    height: (MAP_CIRCLE_INSET * 100) + '%',
    flex: 1,
    opacity: 0.5
  },
  controls: {
    flex: 0.45,
    width: '100%',
  },
  buttonRow: {
    flex: 0.75,
    flexDirection: 'row',
    margin: STANDARD_PADDING
  },
  markButton: {
    flex: 0.25,
    margin: STANDARD_PADDING
  },
  markButtonText: {
    fontSize: STANDARD_PADDING * 2
  },
  helpText: {
    flex: 0.1,
    marginLeft: STANDARD_PADDING,
    marginRight: STANDARD_PADDING,
    marginBottom: STANDARD_PADDING,
    fontSize: STANDARD_PADDING
  }
});

class Main extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button title="Logout" onPress={() => navigation.dispatch({type:USER_LOGIN})} />
      ),
      title: 'Sweaters & Sustenance',
      headerBackTitleStyle: {
        color: COLOR_BLUE
      },
      // headerTintColor: '#fff'
    }
  }

  constructor(props) {
    super(props);
    this.regionChanged = this.regionChanged.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    this.props.newMarker();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.marker.saved != this.props.marker.saved && nextProps.marker.saved === true) {
      setTimeout(() => {
        this.props.clearMarker();
      },1000);
    }
  }

  regionChanged(data) {
    this.props.setMarkerLocation({
      coordinates: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      region: {
        latitudeDelta: data.latitudeDelta,
        longitudeDelta: data.longitudeDelta
      }
    });
  }

  saveData() {
    this.props.saveMarker();
  }

  render() {
    return (
      <View style={[styles.container,misc.container]}>
        <View style={[styles.mapContainer]}>
          <MapView
            style={styles.map}
              initialRegion={{
                latitude:  this.props.marker.location.coordinates.latitude,
                longitude: this.props.marker.location.coordinates.longitude,
                latitudeDelta: this.props.marker.location.region.latitudeDelta,
                longitudeDelta: this.props.marker.location.region.longitudeDelta
              }}
              showsUserLocation={true}
              onRegionChange={this.regionChanged}
            />
          <Image
            source={require('../../assets/img/circle.png')}
            style={[styles.mapOverlay]}
            pointerEvents="none"
          />
        </View>
        <View style={styles.controls}>
          <View style={styles.buttonRow}>
            <NumberControl type="HOMELESS" label="Homeless Count" />
            <NumberControl type="MEALS" label="Meals Count" />
            <NumberControl type="CLOTHES" label="Clothes Count" />
          </View>
          <TouchableHighlight style={[buttons.base,buttons.primary,styles.markButton]} onPress={this.saveData} underlayColor={COLOR_GRAY} >
            <Text style={[buttons.primaryText,styles.markButtonText]}>Save Data</Text>
          </TouchableHighlight>
        </View>
        <Text style={[styles.helpText]}>Drag and zoom the map so that the area you are in fits within the circle. Then use the three counters to record how many homeless individuals you see, how many meals you hand out, and how many articles of clothing you distribute.</Text>
        <SavedPopup />
      </View>
    );
  }
}

const stateToProps = (state) => {
  return {
    user: state.user,
    marker: state.marker
  }
}

const dispatchToProps = (dispatch) => {
  return bindActionCreators({
    setMarkerLocation,
    newMarker,
    clearMarker,
    saveMarker
  }, dispatch)
}

export default connect(stateToProps, dispatchToProps)(Main);
