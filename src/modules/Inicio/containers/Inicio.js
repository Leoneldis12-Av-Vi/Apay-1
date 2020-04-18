import React, { Component } from 'react';
import { Button, View, Text,StyleSheet, Image, Linking} from 'react-native';
//import *as firebase from 'firebase'
import firebase from '../../../lib/firebase'

class Inicio extends Component {

  constructor(props){
    super(props)
    
    this.dbRef=firebase.database();
    this.fbAuthRef=firebase.auth();

    this.state={
      initialView:null,
      userLoaded:false,
      chofer:false,
      st:"sss"
    }
    this.getInitialView()
    this.getInitialView=this.getInitialView.bind(this)
  }

  
  getuserChofer (){
    var ref = this.dbRef.ref("usuario");
    ref.orderByChild("estado").equalTo("activo").on("child_added", function(snapshot) {
      var newUsuario =snapshot.val();
      alert("nombre:"+newUsuario.nombre+" tipo:"+newUsuario.token);
      const message = {
         to: newUsuario.token,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
      };
      const response = fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      const data = response._bodyInit;
    console.log(`Status & Response ID-> ${data}`);
  });

  }

  getInitialView(){
    this.fbAuthRef.onAuthStateChanged((user) => {
      if (user != null) {
        const naref=this.dbRef.ref().child("usuario").child(this.fbAuthRef.currentUser.uid)
        naref.on('value',(snapshot)=>{
          if(snapshot.val().tipo_usuario=='chofer'){
            console.log("estas autentificado");
            this.setState({
               userLoaded:true,
               chofer:true,
            })
          }
          else{
            this.setState({
              userLoaded:true,
              chofer:false,
           })
          }
        })

      }else{
        console.log("no estas autentificado");
        this.setState({
          userLoaded:false,
        })
      }
    });
  }

  render() {
    return (
      <View style={styles.container} onTouchStart={()=>this.loadScreen()}>
          <Text style={styles.tex} onPress={()=>this.getuserChofer()}>APP TK MOTOS</Text>
          <Image style={styles.imageSyle} source={require('./../../../../assets/logotk.png')}/>
          <Text style={styles.tex}>Somos tu mejor opcionss en transporte y delivery</Text>
          <Text style={styles.tex}>al usar la aplicacion aceptas los terminos y condiciones </Text>
          <Text style={styles.textUrl} onPress={()=>this.loadTerms()}>terminos y condiciones</Text>
      </View>
    );
  }

  loadScreen(){
    if(this.state.userLoaded){
      if(this.state.chofer){
        this.props.navigation.navigate('HomeChofer')
      }
      else{
        this.props.navigation.navigate('Home')
      }
    }
    else{
      this.props.navigation.navigate('Login');
    }
    
  }

  loadTerms(){
    var url="https://www.tukuyimas.com/";
    return Linking.openURL(url);
  }

}

const styles=StyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: '#1b2631',
      alignItems: 'center',
      justifyContent: 'center',
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
export default Inicio;