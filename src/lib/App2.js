import React, { Component } from 'react';
import { Button, View, Text,StyleSheet, Image, Linking, ScrollView, TouchableWithoutFeedback, FlatList} from 'react-native';
//import *as firebase from 'firebase'

import {} from 'native-base'

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
      confirmVisible: false
    };
  }

  componentDidMount() {
    // start listening for firebase updates
    this.listenForTasks(this.tasksRef);
  }

  listenForTasks(tasksRef) {
    tasksRef.on("value", dataSnapshot => {
      var tasks = [];
      dataSnapshot.forEach(child => {
        tasks.push({
          name: child.val().nombre,
          apellido: child.val().apellido,
          imagen:child.val().imagen,
          distancia:child.val().distancia,
          tiempo: child.val().tiempo,
          oferta:child.val().oferta
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
          backgroundColor: "#BBB5B3"
        }}
      >
        <View />
      </View>
    );
  };


  render() {
    return (
        <View style={styles.container}>
          <ScrollView>
            <FlatList
              data={this.state.dataSource}
              renderItem={({ item }) => (
                <View>
                  <ScrollView horizontal={true}>
                      <View>
                        <Text style={styles.item}>{item.name} </Text>
                        <Text style={styles.item}>{item.apellido} </Text>
                      </View>
                  </ScrollView>
                  <ScrollView horizontal={true}>
                      <View>
                        <Text style={styles.item}>{item.name} </Text>
                        <Text style={styles.item}>{item.apellido} </Text>
                      </View>
                  </ScrollView>
                  <ScrollView horizontal={true}>
                      <View>
                        <Text style={styles.item}>{item.name} </Text>
                        <Text style={styles.item}>{item.apellido} </Text>
                      </View>
                  </ScrollView>
                </View>
              )}
              ItemSeparatorComponent={this.renderSeparator}/>
            <Text />
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
export default HomeChofer;