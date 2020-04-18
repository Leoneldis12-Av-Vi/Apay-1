import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
} from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -19.0500970197085;
const LONGITUDE = -65.2636922197085;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

class CustomMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      latmks:-19.0500970197085,
      longmks:-65.2636922197085,
      a:'0',
      ubistart:'',
      ubiend:'',
    };
  /*  marcador={
      lm:
    }*/
    this.onMapPress = this.onMapPress.bind(this);
  }
  


 onMapPress(e) {
    let l=e.nativeEvent.coordinate.latitude;
    let lg=e.nativeEvent.coordinate.longitude;
    console.log("l:"+l+" log:"+lg)
   this.setState({
     latmks:l,
     longmks:lg,
   },function(){
    console.log(this.state.latmks+"loddddddl: "+this.state.longmks)
    this.getDirections()
   });
  }

  async getDirections(){
    try{
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latmks},%20${this.state.longmks}&key=AIzaSyDoPbcihgNhicROECP6ToDPI8bK8VBP7S0`);
      const respJson = await resp.json();
      console.log(respJson.results[0].formatted_address)
      this.setState({
        ubistart:respJson.results[0].formatted_address
      })
    }catch(error){
      //console.log('Error: ',error)
      alert(error.toString())
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onLongPress	={this.onMapPress}
        >
            <Marker
              coordinate={{
                latitude:this.state.latmks,
                longitude:this.state.longmks,
              }}
            />

        </MapView>
        <View style={styles.buttonContainer}>
          <Button
            title='ju'
            onPress={()=>alert(this.state.latmks+"j"+this.state.longmks)}

          />
          <TouchableOpacity

            style={styles.bubble}
          >

            <Text>{this.state.ubistart}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Home.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default CustomMarkers;	