import React, { Component } from 'react';
import { View, Text,StyleSheet,Image,ToastAndroid } from 'react-native';
import {Button, Container, Header, Content,Item, Input,Icon, Label, Toast} from 'native-base';
import firebase from '../../../lib/firebase'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo';

class Registro extends Component {
    constructor(props){
        super(props)
        

        this.dbRef=firebase.database();
        this.fbAuthRef=firebase.auth();
        this.state={
          icon: "eye-off",
          userId:'',
          email:'',
          password:'',
          passwordR:'',
          nombres:'',
          apellidos:'',
          token:'',
          tipoUsuario:'usuario',
          estado:'activo',
          response:'',

          passIcon:true
        };
        this.getToken();
    }

  render() {
    return (
      <View style={styles.container}>
          <Container style={styles.containerBtn}>
            <Content style={styles.containerBtnC}>
                <Text style={styles.tex}>Registro</Text>
                <Item rounded style={styles.inpu}>
                    <Input placeholder='Nombres' onChangeText={(nombres)=>this.setState({nombres})}/>
                </Item>
                <Item rounded style={styles.inpu} last>
                    <Input placeholder='Apellidos' onChangeText={(apellidos)=>this.setState({apellidos})}/>
                </Item>
                <Item rounded style={styles.inpu} last>
                    <Input placeholder='Correo Electronico' onChangeText={(email)=>this.setState({email})}/>
                </Item>
                <Item rounded style={styles.inpu} last>
                    <Input placeholder='Contraseña' onChangeText={(password)=>this.setState({password})}/>
                </Item>
                <Item rounded style={styles.inpu} last>
                    <Input placeholder='Repetir Contraseña' onChangeText={(passwordR)=>this.setState({passwordR})}/>
                </Item>
                <Button rounded dark style={styles.containerBtnb} onPress={(props)=>this.btnRegistrar()}>
                    <Text style={styles.tex}>Registrarse</Text>
                </Button>
                <Button rounded dark style={styles.containerBtnb} onPress={(props)=>this.btnCancelar()}>
                    <Text style={styles.tex}>Cancelar</Text>
                </Button>
                <Image style={styles.imageSyle} source={require('./../../../../assets/logotk.png')}/>
                <Text style={styles.tex}>Trminos y condiciones</Text>
            </Content>
          </Container>
    </View>
    );
  }

  btnRegistrar(){
    var patron=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if (this.state.email.search(patron)==0){
            if(!this.state.password==''){
                this.state.password==this.state.passwordR?
                    this.guardarDatos()
                :alert('las contraseñas no coninciden')
            }else{
                alert('introdusca la contraseña')
            }
       } else {
        alert("La dirección de email:"+this.state.email+" es incorrecta.");
       }
  }

  async getToken(){
    const { status }=await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if(status!== 'granted'){
        alert('no tienes permisos para notificaciones')
        return;
    }
    let token=await Notifications.getExpoPushTokenAsync();
    this.setState({
        token:token
    })
  }

  async guardarDatos(){
    try{
        await this.fbAuthRef.createUserWithEmailAndPassword(this.state.email,this.state.password)
        this.setState({
            response:"cuenta Creada!",
            userId:this.fbAuthRef.currentUser.uid
        })  
            var userId=''+this.state.userId;
            this.dbRef.ref('usuario/' + userId).set({
                nombre:''+this.state.nombres,
                apellido: this.state.apellidos,
                email: this.state.email,
                password:this.state.password,
                tipo_usuario:this.state.tipoUsuario,
                estado:this.state.estado,
                token:this.state.token,
                imgUrl:"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
            });
            alert(this.state.response)
        ToastAndroid.show(this.state.response+"user Id:"+this.state.userId, ToastAndroid.LONG);
        setTimeout(()=>this.props.navigation.navigate('Login'),1500)
    }catch(error){
        this.setState({
            response:error.toString()
        })
        ToastAndroid.show(this.state.response, ToastAndroid.LONG)
    }
  }

  btnCancelar(){
    this.props.navigation.navigate('Login');
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
        width:100,
        height:100,
        marginTop :30,
    }
  })
  

export default Registro;