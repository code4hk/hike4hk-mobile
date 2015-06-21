'use strict';

var React = require('react-native');
var MapboxGLMap = require('react-native-mapbox-gl');
var Button = require('react-native-button');

 var {
   AppRegistry,
   StyleSheet,
   View,
   Text,
   TextInput,
   TouchableHighlight,
   NativeModules
 } = React;
 var map = React.createClass({
    watchID: (null: ?number),
    getInitialState() {
     return {
       mapLocation: {
         latitude: 40.72345355209305,
         longitude: -73.99343490600586,
         zoom: 14
        },
        center: {
          latitude: 40.72345355209305,
          longitude: -73.99343490600586
        },
        currentLocation: {
          latitude: 0,
          longitude: 0
        },
        startTime: 0,
        currentTime: 0,
        button_text: "Start",
        distance: 0,
        elevation: 0,
        pastAltitude: 0,
        showsUserLocation: true
      }
   },
   _handlePress(e) {
    if(this.state.button_text==="Start"){
      this.onStart();
      this.setState({showsUserLocation: true, distance:0, button_text: "Stop", startTime: 0, currentTime: 0, elevation: 0});
    }else{
      this.onStop();
      this.setState({showsUserLocation: false});
      this.setState({button_text: "Start"});
    }
   },
   onRegionChange(e) {
     this.setState({mapLocation: e});
   },
   onCenterChange(e) {
     this.setState({center: e});
   },
   timestampChanged(e) {
    if (this.state.startTime===0){
     this.setState({ currentTime: e, startTime: e});
    }else{
      this.setState({currentTime: e})
    }
   },
   onMove(longitude, latitude, altitude){
    if (this.state.currentLocation.latitude!=0 || this.state.currentLocation.longitude!=0){
      this.setState({distance: this.state.distance+dist(latitude, longitude, 
        this.state.currentLocation.latitude, this.state.currentLocation.longitude)});
    }
    console.log("altitude: "+ altitude);
    if (this.state.pastAltitude!==0 && altitude > this.state.pastAltitude){
      this.setState({elevation: this.state.elevation + altitude - this.state.pastAltitude})
    }
    this.setState({currentLocation:{longitude: longitude, latitude: latitude}, pastAltitude: altitude});
   },
   saveToDB(lo, la, al, time){
    fetch("http://elasticsearch-cfublog.rhcloud.com/hiking/location/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        activityId: 2,
        user: "vincent",
        location: lo+", "+la,
        altitude: al,
        time: time
      })
    });
   },
   onStart() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.timestampChanged(position.timestamp)
      var lo = position.coords.longitude, la = position.coords.latitude, al = position.coords.altitude;
      console.log("pos: "+ JSON.stringify(position.coords));
      this.onMove(lo, la, al);
      this.saveToDB(lo, la, al, position.timestamp);
      if (Math.abs(this.state.center.longitude-lo)>0.003||Math.abs(this.state.center.latitude-la)>0.003){
        this.onCenterChange({longitude: lo, latitude: la});
      }
    });
   },
  onStop() {
    navigator.geolocation.clearWatch(this.watchID);
  },
   render: function() {
     return (
       <View style={styles.container}>
         <View style={styles.statSection}>
          <View style={styles.statCell}>
           <Text style={styles.statDigit}>{this.state.distance.toFixed(2)}</Text>
           <Text style={styles.statDesc}>Distance</Text>
          </View>
          <View style={styles.statCell}>
           <Text style={styles.statDigit}>{toHHMMSS(this.state.currentTime-this.state.startTime)}</Text>
           <Text style={styles.statDesc}>Duration</Text>
          </View>
          <View style={styles.statCell}>
           <Text style={styles.statDigit}>{this.state.elevation.toFixed(0)}</Text>
           <Text style={styles.statDesc}>Elevation</Text>
          </View>   
          <View style={styles.statCell}>
           <Text style={styles.statDigit}>{cal(this.state.distance, this.state.elevation).toFixed(0)}</Text>
           <Text style={styles.statDesc}>Calories</Text>
          </View>       
         </View>
        <MapboxGLMap
          accessToken={'sk.eyJ1IjoiY29kZTRoayIsImEiOiJmN2JhYzhhOGMxMmM1ZTI1ZDJlOWRkNGZiYzliZTk4OSJ9.RdPsLMXx2XA0j1yJt2cPOw'} 
          style={styles.map}
          styleURL={'asset://styles/mapbox-streets-v7.json'}
          centerCoordinate={this.state.center}
          zoomLevel={this.state.mapLocation.zoom}
          onRegionChange={this.onRegionChange}
          onRegionWillChange={this.onRegionChange}
          rotateEnabled={false}
          showsUserLocation={this.state.showsUserLocation}/>
          <Button onPress={this._handlePress} style={styles.text}>{this.state.button_text}</Button>
        </View>
     );
   }
 });
 var styles = StyleSheet.create({
   container: {
     flexDirection: 'column',
     flex: 1
   },
   statSection: {
    flexDirection: 'row',
    paddingTop: 30,
    padding: 20,
    flex: 1,
    justifyContent: 'center'
   },
   statCell: {
    padding: 10
   },
   statDigit: {
    fontSize: 30,
    textAlign: 'center'
   },
   statDesc: {
    textAlign: 'center'
   },
   default: {
    flex: 0.5,
    paddingLeft: 10,
    fontSize: 13,
  },
   map: {
     flex: 5,
   },
   text: {
     padding: 20
   }
 });
var dist=function(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return R * c; //to miles
  }

// Converts numeric degrees to radians
var toRad = function(Value) {
    return Value * Math.PI / 180;
}

var toHHMMSS = function (millisec) {
    var sec_num = Math.floor(millisec / 1000);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time;
    if (hours === "00"){
      time = minutes+':'+seconds;
    }else{
      time = hours+':'+minutes+':'+seconds;
    } 
    return time;
}

var cal = function(distance, elevation){
  return 6 * 70 * (distance / 5 + elevation/600);
}

AppRegistry.registerComponent('hike4hk', () => map);
