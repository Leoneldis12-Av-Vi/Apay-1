  
import React, { Component } from 'react';
import {AppLoading} from 'expo'
import { View,StyleSheet, Image, Linking, ScrollView, TouchableWithoutFeedback, FlatList} from 'react-native';
//import *as firebase from 'firebase'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Container, Content, Card, CardItem, Text, Body, Button,Item,Label,Input,Icon,Left,Right,Thumbnail } from "native-base";
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../../lib/firebase'

class HomeChofer extends Component {

  constructor(props){
    super(props)
    
    this.dbRef=firebase.database();
    this.fbAuthRef=firebase.auth();

    this.tasksRef = this.dbRef.ref("/pedido");

    const dataSource = [];
    this.state = {
      dataSource: dataSource,
      selecteditem: null,
      snackbarVisible: false,
      confirmVisible: false,

      nombre:'Anonimo',
      user:'leo',
      pass:'1234',
      isReady:false,
      puntuacion:5,
      keyPedido:'ofer'
    };
  }

  async componentDidMount() {
    this.listenForTasks(this.tasksRef);
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }
  
  createTable = (star) => {
    let falta= 5-star
    let table = []

    // Outer loop to create parent
    if((star<6)&&(star>-1)){
      for (let i = 0; i < star; i++) {
        table.push(<Ionicons name="md-star" size={30} color="orange" />)
      }
      for (let i = 0; i < falta; i++) {
        table.push(<Ionicons name="md-star" size={30} color="black" />)
      }
      return table
    }
  }


  listenForTasks(tasksRef) {
    tasksRef.on("value", dataSnapshot => {
      var tasks = [];
      
      dataSnapshot.forEach(child => {
        tasks.push({
          nombre: child.val().nombre,
          apellido: child.val().apellido,
          imagen:child.val().imagen,
          distancia:child.val().distancia,
          tiempo: child.val().tiempo,
          oferta:child.val().oferta,
          key:child.key
        });
      });

      this.setState({
        dataSource: tasks
      });
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          width: "90%",
          height: 2,
        }}
      >
      </View>
    );
  };

  btnVer(key){
    this.props.navigation.navigate('OfertaChofer',{keyPedido:key})
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
        <View style={styles.container}>
          <ScrollView>
            <FlatList
              data={this.state.dataSource}
              renderItem={({ item }) => (
                <View>
                  <ScrollView horizontal={true}>
                  <Card>
                    <CardItem style={styles.bodyCard}>
                      <View style={styles.imCard}>
                      <Text style={{fontSize:20, color:'red'}} >Traslado</Text>
                        <Image source={{uri: 'https://www.stickpng.com/assets/images/584df2fc6a5ae41a83ddedfd.png'}} style={styles.imageCard}/>
                      </View>
                      <View style={styles.detailsCard} >
                        <Text style={{fontSize:20}} >{item.nombre}</Text>
                        <Text style={{fontSize:15,marginTop:-5}}>{item.apellido}</Text>
                        <Text style={{fontSize:15, color:'red'}}>Ubicacion</Text>
                        <Text style={{fontSize:20,marginTop:-5}}>Calle Camargo #100</Text>
                        <Text style={{fontSize:15,marginTop:-5, color:'red'}}>Destino</Text>
                        <Text style={{fontSize:20,marginTop:-5}}>ssss ssssssssssss s sss</Text>
                        <Text style={{fontSize:20,marginTop:-5}}>{item.key}</Text>
                        <Button style={{alignItems:"center",justifyContent:"center"}} onPress={() => {
                                /* 1. Navigate to the Details route with params */
                                this.props.navigation.navigate('OfertaChofer', {
                                  keyPedido:item.key
                                });
                              }}><Text>ver</Text></Button>
                      </View>
                    </CardItem>
                    <CardItem footer style={styles.footerCard}>
                      <Text style={styles.tcolor}>Distancia desde se Ubicación: </Text>
                      <Text style={styles.tcolor}>2 km</Text>
                      
                      <Right>
                        <Text style={styles.tcolor}>aprox.<Text style={styles.tcolor}>10</Text> min</Text>
                      </Right>
                    </CardItem>
                  </Card>
                  </ScrollView>
                </View>
              )}
              ItemSeparatorComponent={this.renderSeparator}/>
          </ScrollView>
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
  footerCard:{
    backgroundColor:'#151818',
    color:'white'
  },
  imageCard:{
    width : 85,
    height :85,
  },
  bodyCard:{
    backgroundColor:'#c4c4c4',
    flexDirection:'row',
    maxWidth:350,
    minWidth:350
    
  },

  ofertaBig:{
    fontSize: 75,
    marginTop:-20,
  },

  imCard:{
    alignSelf:"flex-start",
  },

  detailsCard:{
    alignSelf:"flex-start",
    paddingLeft:10,
    flex:10,
  },

  tcolor:{
    color : 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  btn:{
    width:'100%',
    justifyContent:'center'
  },
  txtcenter:{
    width:'100%',
    textAlign:'center'  
  },
  contenedor:{
    flex:1,
    justifyContent:'center'
  },

  footer:{
    flex:0.1,
    flexDirection:'row',
    justifyContent:'space-between'
    
  },
  head:{
    flex:0.1,
    flexDirection:'row'
  },
  headerleft:{
    flex:1,
    //backgroundColor:'red'
  },
  headerrigth:{
    flex:0.5,
    backgroundColor:'green'
  },
  body:{
    flex:1,
    //backgroundColor:'aqua',
    alignItems:'center'
  },
  negrita:{
    color:'blue',
    fontWeight:'bold'
  },
  logo:{
    width : 50,
    height :50,
    borderRadius:25,
    resizeMode:'cover'
  }
})
export default HomeChofer;