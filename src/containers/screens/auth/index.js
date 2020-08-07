import React, { Component } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
const Stack = createStackNavigator();

export default function HomeNavigator() {

    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
        </Stack.Navigator>
    )
}