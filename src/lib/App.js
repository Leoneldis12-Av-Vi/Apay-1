import React from 'react';
import { Text, View, Button } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import firebase from './firebaseFCM';

const YOUR_PUSH_TOKEN = '';

export default class AppContainer extends React.Component {
  state = {
    notification: {},
  };

  getuserChofer (){
    var ref = firebase.database().ref("users");
    ref.orderByChild("estado").equalTo("activo").on("child_added", function(snapshot) {
      var newUsuario =snapshot.val();
      alert("tipo"+newUsuario.token_Id);
      //this.sendPushNotification("ExponentPushToken[Xbj6rkLhRC-LGd_y3H0KhJ]");
      const message = {
         to: newUsuario.token_Id,
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

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
     
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  sendPushNotification = async (token) => {
    const message = {

      to: token,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { data: 'goes here' },
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
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
  };
  
  async rToken() {
    alert("funcionando");
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  
    if (status !== 'granted') {
      alert('No notification permissions!');
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    alert("funcionando");
    var userId = "marlson";
    firebase.database().ref('users/' + userId).set({
      token_Id: token
    });
    
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Origin: {this.state.notification.origin}</Text>
          <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
        </View>
        
        <Button
          title={'Agregar token'}
          onPress={() =>this.rToken()}
        />
        <Button title="add" onPress={()=> this.getuserChofer()}></Button>
      </View>
    );
  }
}

/*  TO GET PUSH RECEIPTS, RUN THE FOLLOWING COMMAND IN TERMINAL, WITH THE RECEIPTID SHOWN IN THE CONSOLE LOGS

    curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
      "ids": ["YOUR RECEIPTID STRING HERE"]
      }'

    */

