
import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatNavigator from '@screens/chat'
import MoreNavigator from '@screens/more'

import _Tabbar from '@component/_Tabbar';

const TAG = "== Tab navigator : "
const Tab = createBottomTabNavigator();

export default function App({ navigation, route }) {

    function getTabBarVisible(route) {

        const routeName = route.state
            ? route.state.routes[route.state.index].name
            : route.params?.screen || 'ChatUserList';

        if (routeName === 'ChatUserList' || routeName === 'MoreOptionScreen') {
            return true;
        }
        return false;
    }

    return (
        <Tab.Navigator
            tabBar={props => <_Tabbar {...props} />}
            tabBarOptions={{
                activeTintColor: '#000',
                inactiveTintColor: '#848585',
            }}>
            <Tab.Screen name="ChatNavigator" component={ChatNavigator}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisible(route)
                })} />
            <Tab.Screen name="MoreNavigator" component={MoreNavigator}
                options={({ route }) => ({
                    tabBarVisible: getTabBarVisible(route)
                })}
            />
        </Tab.Navigator>
    );
}