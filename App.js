
import * as React from 'react';

import { StackNavigator } from 'react-navigation';

import Inicio from './src/modules/Inicio/containers/Inicio';
import Login from './src/modules/Login/containers/Login';
import Registro from './src/modules/Login/containers/Registro';
import Home from './src/modules/Home/containers/Home';
import HomeChofer from './src/modules/HomeChofer/containers/HomeChofer'
import OfertaChofer from './src/modules/OfertaChofer/containers/OfertaChofer';

import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo';
import Constants from 'expo-constants';

const RootStack = StackNavigator(
  {
    Inicio:{
      screen:Inicio,
    },
    Login:{
      screen:Login,
    },
    Registro:{
      screen:Registro,
    },
    Home:{
      screen:Home,
    },
    HomeChofer:{
      screen:HomeChofer,
    },
    OfertaChofer:{
      screen:OfertaChofer, 
    },
  },
  {
    initialRouteName: 'Inicio',
  }
);

export default class App extends React.Component{
  render() {
    return <RootStack />;
  }
}

