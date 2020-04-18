import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { Container, Header, Content, Input, Item,Button } from 'native-base';
import firebase from '../../../lib/firebase'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -19.0500970197085;
const LONGITUDE = -65.2636922197085;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

class Home extends Component {
  
  constructor(props){
    super(props)
    
    this.dbRef=firebase.database();
    this.fbAuthRef=firebase.auth();

    this.state={
      region:null,
      latmks:-19.0500970197085,
      longmks:-65.2636922197085,
      a:'0',
      ubistart:'',

      emailCurrent:'',
      idCurrent:this.fbAuthRef.currentUser.uid,
      nameCurrentUser:'',
      lastNameCurrentUser:'',
      tokenCurrentUser:'',

      latInicial:'',
      longInicial:'',
      dirInicial:'Ubicacion actual',

      latDestino:'',
      longDestino:'',
      dirDestino:'Destino',

      titleMarker:"Estas aqui",

    };

    this.onMapPress = this.onMapPress.bind(this);
    this.getDirections();
    
    setInterval(()=>this._getLocationAsync(),2000);
  }

  _getLocationAsync= async()=>{
    let {status}=await Permissions.askAsync(Permissions.LOCATION)
    if(status!=='granted')
      console.log('Permisos denegados');
    let location= await Location.getCurrentPositionAsync({enableHighAccuracy:true})

    let region={
      latitude:location.coords.latitude,
      longitude:location.coords.longitude,
      latitudeDelta:0.0122,
      longitudeDelta:0.0122,
    }

    this.dbRef.ref('usuario/' + '8hmr2K2p04VIdcJeCeKq1zXY5dn2').update({
      latC:location.coords.latitude,
      longC: location.coords.longitude,
  });

    this.setState({region:region,
    latmks:location.coords.latitude,
    longmks:location.coords.longitude

  },function(){
    this.getDirections()})
  }

  onMapPress(e) {
    let l=e.nativeEvent.coordinate.latitude;
    let lg=e.nativeEvent.coordinate.longitude;
    console.log("latttt:"+l+" logggggg:"+lg)
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
      this.setState({
        ubistart:respJson.results[0].formatted_address
      })
    }catch(error){
      alert(error.toString())
    }
  }

   componentDidMount(){
     const naref=this.dbRef.ref().child("usuario").child(this.state.idCurrent)
      naref.on('value',(snapshot)=>{
      this.setState({
        nameCurrentUser:snapshot.val().nombre,
        lastNameCurrentUser:snapshot.val().apellido,
        tokenCurrentUser:snapshot.val().token,
      })
    })
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.containerMap}>

          <MapView provider={this.props.provider} style={styles.map}
          initialRegion={this.state.region}
          onLongPress	={this.onMapPress}
        >
            <Marker
              coordinate={{
                latitude:this.state.latmks,
                longitude:this.state.longmks,
              }}
              style={{alignItems: 'center',
              justifyContent: 'center',}}
            >
              <Text style={{textAlign:"center", backgroundColor:'rgba(248,149,76,0.7)',borderRadius:10,padding:5}}>{this.state.titleMarker}</Text>
              <Text style={{fontSize:40}}>📍</Text>
            </Marker>
        </MapView>

        </View>
        <View style={styles.containerF}>
            <Container>
            <Content>
              <Text>{this.state.nameCurrentUser+" "+this.state.lastNameCurrentUser}</Text>
              <Text>Ubicación Actual</Text>
              <Item regular>
                <Input placeholder={this.state.dirInicial} disabled />
                <Button success onPress={()=>this.loadPosInicial()}><Text> Success </Text></Button>
              </Item>
              <Text>Destino</Text>
              <Item regular>
                <Input placeholder={this.state.dirDestino} disabled />
                <Button success onPress={()=>this.loadDestino()}><Text> Success </Text></Button>
              </Item>
              <Button onPress={(props)=>this.btnPedir()} block dark>
                <Text style={styles.tex}>Pedir</Text>
              </Button>
            </Content>
          </Container>
            {//<Button title="Users List" onPress={() => this.getU()}  color="#19AC52" />
            <Button title="Cerrar sesion" onPress={() => this.logOut()} color="#19AC52" />
            }
        </View>
    </View>
    );
  }

  btnPedir(){
    if(this.state.latInicial!=''){
      if(this.state.latDestino!=''){
        console.log("inicial")
        console.log(this.state.latInicial+"latitud"+ this.state.longInicial)
        console.log("destino")
        console.log(this.state.latDestino+" longitud"+ this.state.longDestino)
        alert("idUser: "+this.state.idCurrent+ " token: "+this.state.tokenCurrentUser+" nombre:"+this.state.nameCurrentUser+" Apellido: "+this.state.lastNameCurrentUser)
        var newPostKey=firebase.database().ref().child("pedido").push().key;
        this.dbRef.ref('pedido/' + newPostKey).set({
          nombre:this.state.nameCurrentUser,
          apellido: this.state.lastNameCurrentUser,
          token:this.state.tokenCurrentUser,
          latInicial:this.state.latInicial,
          longInicial:this.state.longInicial,
          latDestino:this.state.latDestino,
          longDestino:this.state.longDestino,
      });
      }else{
        alert('Debe introducir la Ubicacion De Destino')
      }
    }else{
      alert('Debe introducir la Ubicacion actual')
    }
    
  }

  loadPosInicial(){
    this.setState({
      latInicial:this.state.latmks,
      longInicial:this.state.longmks,
      dirInicial:this.state.ubistart,
      titleMarker:"A donde quieres ir?"
    })
  }
  loadDestino(){
    this.setState({
      latDestino:this.state.latmks,
      longDestino:this.state.longmks,
      dirDestino:this.state.ubistart,
    })
  }

  logOut(){
    firebase.auth().signOut().then(()=> {
      return this.props.navigation.navigate('Inicio');
    }).catch(function(error) {
      alert(error.toString())
    });
  }

}

Home.propTypes = {
  provider: ProviderPropType,
};

const styles=StyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: '#1b2631',
      alignItems: 'center',
      justifyContent: 'center',
  },

  containerMap:{
    flex: 7,
    backgroundColor: 'red',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  containerF:{
    flex: 3,
    backgroundColor: 'blue',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  tex:{
      color: 'white',
  },
  textUrl:{
      color: 'blue',
  },
  imageSyle:{
      width:200,
      height:200,
      marginTop :30,
  }
})

export default Home;