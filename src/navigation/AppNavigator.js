import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Main from '../screens/Main';
import Chat from '../screens/Chat';
import HoSo from '../screens/HoSo';
import ChinhSuaHoSo from '../screens/ChinhSuaHoSo';
import DoiMatKhau from '../screens/DoiMatKhau';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={'Plash'}
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Signup'}
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Main'}
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Chat'}
          component={Chat}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name={'HoSo'}
          component={HoSo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'ChinhSuaHoSo'}
          component={ChinhSuaHoSo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'DoiMatKhau'}
          component={DoiMatKhau}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
