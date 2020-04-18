import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { Container, Header, Content, Input, Item,Button } from 'native-base';
import firebase from '../../../lib/firebase'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location'
import { createStackNavigator } from '@react-navigation/stack';

class OfertaChofer extends Component {
  
  constructor(props){
    super(props)    
    this.dbRef=firebase.database();
    this.fbAuthRef=firebase.auth();
    this.state={
      keyPedido:"",
      latUserInicial:2,
      longUserInicial:2,

      latUserDestino:1,
      longUserDestino:2,

    };


  }

componentDidMount(){
  const { params } = this.props.navigation.state;
  const keyPedido = params ? params.keyPedido : null;
  this.setState({
    keyPedido:keyPedido
  },()=>{
    const naref=this.dbRef.ref().child("pedido").child(this.state.keyPedido)
    naref.on('value',(snapshot)=>{
      console.log("solas"+ snapshot.val().latInicial),
    this.setState({
      latUserInicial:snapshot.val().latInicial,
      longUserInicial:snapshot.val().longInicial,
  
      latUserDestino:snapshot.val().latDestino,
      longUserDestino:snapshot.val().longDestino,

    })
  })
  });
}

  render() {

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.containerMap}>
          <MapView style={styles.map}
          >
          <Marker
              coordinate={{
                latitude:this.state.latUserDestino,
                longitude:this.state.longUserDestino,
              }}
              style={{alignItems: 'center', justifyContent: 'center',}}>
                <Text style={{textAlign:"center", backgroundColor:'rgba(248,149,76,0.7)',borderRadius:10,padding:5}}>Destino</Text>
                <Text style={{fontSize:40}}>📍</Text>
            </Marker>
            <Marker
              coordinate={{
                latitude:this.state.latUserInicial,
                longitude:this.state.longUserInicial,
              }}
              style={{alignItems: 'center', justifyContent: 'center',}}>
                <Text style={{textAlign:"center", backgroundColor:'rgba(248,149,76,0.7)',borderRadius:10,padding:5}}>Ubicacion cliente</Text>
                <Text style={{fontSize:40}}>📍</Text>
            </Marker>

          </MapView>
        </View>
        <View style={styles.containerF}>
          <Container>
            <Content>
             <Item regular>
                <Text>key:{this.state.keyPedido}</Text>
                <Input placeholder="Bs"/>
                <Button success onPress={()=>{alert("oferta enviada"); this.props.navigation.navigate('HomeChofer')}}><Text> ofertar </Text></Button>
                <Button danger onPress={()=>this.props.navigation.navigate('HomeChofer')}><Text> cancelar </Text></Button>
              </Item>
            </Content>
          </Container>
        </View>
    </View>
    );
  }

}

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
  containerF:{
    flex: 1,
    backgroundColor: 'blue',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default OfertaChofer;