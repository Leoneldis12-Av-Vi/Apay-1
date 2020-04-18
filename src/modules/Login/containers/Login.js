import React, { Component } from 'react';
import { View, Text,StyleSheet,Image,ToastAndroid } from 'react-native';
import {Button, Container, Header, Content,Item, Input,Icon, Label} from 'native-base';
import { FontAwesome, Ionicons, AntDesign,Entypo } from '@expo/vector-icons';

import firebase from '../../../lib/firebase'

class Login extends Component {
  constructor(props){
    super(props)

    this.dbRef=firebase.database();
    this.fbAuthRef=firebase.auth();

    this.state={
      icon: "eye-off",
      password:true,
      email:'',
      passwordLog:'',
      response:''
    };
  
  }

  _changeIcon(){
    this.setState(prevState=>({
        icon:prevState.icon=== 'eye'?'eye-off':'eye',
        password:!prevState.password
    }));
  }

  render() {
    const {label,icon,onChange}=this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.imageSyle} source={require('./../../../../assets/logotk.png')}/>
          <Text style={styles.tex}>Login</Text>
          <Container style={styles.containerBtn}>
            <Content style={styles.containerBtnC}>
                <Item rounded style={styles.inpu}>
                    <FontAwesome name='user' size={25}/>
                    <Input placeholder='Usuario' onChangeText={(email)=>this.setState({email})}/>
                </Item>
                <Item rounded style={styles.inpu} last>
                    <Ionicons name='ios-unlock' size={25}/>
                    <Input secureTextEntry={this.state.password} onChangeText={onChange,(passwordLog)=>this.setState({passwordLog})} placeholder='Contraseña'/>
                    <Icon name={this.state.icon} onPress={()=>this._changeIcon()} />
                </Item>
                <Button rounded dark style={styles.containerBtnb} onPress={(props)=>this.btnLogin()}>
                    <Text style={styles.tex}>Iniciar</Text>
                </Button>
                <Text style={styles.tex}>¿No tienes una cuenta? Registrate</Text>
                <Text style={styles.textUrl} onPress={(props)=>this.btnRegistro()}>aquí</Text>
                <Text style={styles.tex}>O inicia sesión con:</Text>
                <AntDesign name='google' size={45} color='#C30907' onPress={()=>alert('click Google')} />
                <Entypo name='twitter-with-circle' size={45} color='#00acee' onPress={()=>alert('click Twitter') }/>
                <Entypo name='facebook-with-circle' size={45} color='#3b5998' onPress={()=>alert('click Facebook') }/>
            </Content>
          </Container>
        
    </View>
    );
  }

  async btnLogin(){
    
    try{
      await this.fbAuthRef.signInWithEmailAndPassword(this.state.email,this.state.passwordLog)
      this.setState({
        response:"usuario logeado"
      })
      

      const naref=this.dbRef.ref().child("usuario").child(this.fbAuthRef.currentUser.uid)
      naref.on('value',(snapshot)=>{
        if(snapshot.val().tipo_usuario=='chofer'){
          ToastAndroid.show("chofer"+this.state.response, ToastAndroid.LONG)
          setTimeout(()=>this.props.navigation.navigate('HomeChofer'),1500)
        }
        else{
          ToastAndroid.show("Usuario"+this.state.response, ToastAndroid.LONG)
          setTimeout(()=>this.props.navigation.navigate('Home'),1500)
        }
      })
      
    }catch(error){
      this.setState({
        response:error.toString()
      })
      ToastAndroid.show(this.state.response, ToastAndroid.LONG)
    }
    
  }

  btnRegistro(){
    this.props.navigation.navigate('Registro');
  }
 
}
const styles=StyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: '#1b2631',
      alignItems: 'center',
      justifyContent: 'center',
  },
  inpu:{
      backgroundColor :'orange',
  },
  containerBtn:{
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding:20,
        alignContent:'center',
        width:300,
        height:20,
  },
  containerBtnC :{
        backgroundColor: 'transparent',
                
  },
  containerBtnb :{
        
        alignContent:'center',
        padding:20,
        height:20,
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

export default Login;