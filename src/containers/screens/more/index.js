import React, { Component } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import MoreOptionScreen from './MoreOptionScreen';
import EditProfileScreen from './EditProfileScreen';
const Stack = createStackNavigator();

export default function HomeNavigator() {

    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="MoreOptionScreen" component={MoreOptionScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        </Stack.Navigator>
    )
}