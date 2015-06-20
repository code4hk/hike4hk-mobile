'use strict';

var React = require('react-native');
var MapboxGLMap = require('react-native-mapbox-gl');

 var {
   AppRegistry,
   StyleSheet,
   View,
   Text,
   TextInput,
   StatusBarIOS,
   TouchableHighlight,
   NativeModules
 } = React;

 var map = React.createClass({
    watchID: (null: ?number),
    getInitialState() {
     return {
       mapLocation: {
         latitude: 0,
         longitude: 0,
         zoom: 12
        },
        center: {
          latitude: 40.72345355209305,
          longitude: -73.99343490600586
        },
        direction: 30
      }
   },
   onRegionChange(e) {
     this.setState({ mapLocation: e});
   },
   onCenterChange(e) {
     this.setState({ center: e});
   },
   componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lo = position.coords.longitude, la = position.coords.latitude;
      if (Math.abs(this.state.center.longitude-lo)>0.001||Math.abs(this.state.center.latitude-la)>0.001){
        this.onCenterChange({longitude: lo, latitude: la});
      }
    });
   },
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  },
   render: function() {
     StatusBarIOS.setHidden(true)
     return (
       <View style={styles.container}>
         <TextInput
          autoCapitalize='none'
          placeholder='Search a place'
          autoCorrect={false}
          style={styles.default}/>
        <MapboxGLMap
          accessToken={'sk.eyJ1IjoiY29kZTRoayIsImEiOiJmN2JhYzhhOGMxMmM1ZTI1ZDJlOWRkNGZiYzliZTk4OSJ9.RdPsLMXx2XA0j1yJt2cPOw'} 
          style={styles.map}
          styleURL={'asset://styles/mapbox-streets-v7.json'}
          centerCoordinate={this.state.center}
          // direction={this.state.direction}
          zoomLevel={this.state.mapLocation.zoom}
          onRegionChange={this.onRegionChange}
          onRegionWillChange={this.onRegionChange}
          rotateEnabled={false}
          showsUserLocation={true}/>
          <Text>direction: {this.state.direction}</Text>
          <Text>Latitude: {this.state.mapLocation.latitude}</Text>
          <Text>Longitude: {this.state.mapLocation.longitude}</Text>
          <Text>zoom level: {this.state.mapLocation.zoom}</Text>
        </View>
     );
   }
 });

 var styles = StyleSheet.create({
   container: {
     flexDirection: 'column',
     flex: 1
   },
   default: {
    flex: 0.5,
    paddingLeft: 10,
    fontSize: 13,
  },
   map: {
     flex:5,
   },
   text: {
     padding: 20
   }
 });

AppRegistry.registerComponent('hike4hk', () => map);
