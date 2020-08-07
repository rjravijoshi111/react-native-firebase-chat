import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import ChatUserList from './ChatUserList';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

export default function HomeNavigator() {

    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="ChatUserList" component={ChatUserList} />
            <Stack.Screen name="ChatScreen" component={ChatScreen}  />
        </Stack.Navigator>
    )
}