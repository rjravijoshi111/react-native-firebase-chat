import React, { Component } from 'react';
import {
    AppState,
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import * as GeneralAction from '@general/general.action';
import * as ChatService from '@chat/chat.service';
import * as ChatAction from '@chat/chat.action';
import * as GeneralService from '@general/general.service';
const TAG = "== AuthHandler : "
const Stack = createStackNavigator();
import _BaseComponent from '@component/_BaseComponent';
import {Notifications} from 'react-native-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { navigateToScreen } from '@config/helper';
import messaging from '@react-native-firebase/messaging';


import AuthNavigator from '@screens/auth'
import TabNavigator from './TabNavigator'

export const navigationRef = React.createRef();

class AuthHandler extends _BaseComponent {

    /**
    |--------------------------------------------------
    | constructor
    |--------------------------------------------------
    */

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState
        }
    }

    /**
    |--------------------------------------------------
    | componentDidMount 
    |--------------------------------------------------
    */

    async componentDidMount() {
        this.props.setNavigationReference(navigationRef)
        if(this.props.userData != undefined){
            this.props.getNewUserList();
            this.props.getChatUserList();
        }

        this.createNotificationListeners()

        AppState.addEventListener("change", this._handleAppStateChange);    
        // SplashScreen.hide();
    }

    /**
    |--------------------------------------------------
    | _handleAppStateChange
    |--------------------------------------------------
    */

    _handleAppStateChange = nextAppState => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
            console.log("App has come to the foreground!");
            if(this.props.userData !=  undefined){
                this.props.updateOnlineStatus(true)
            }
            
        }else{
            if(this.props.userData !=  undefined){
                this.props.updateOnlineStatus(false)
            }
        }
        this.setState({ appState: nextAppState });
    };

    /**
    |--------------------------------------------------
    | componentWillUnmount
    |--------------------------------------------------
    */

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    /**
    |--------------------------------------------------
    | createNotificationListeners
    | Notification handle
    |--------------------------------------------------
    */

    async createNotificationListeners() {
        Notifications.registerRemoteNotifications();
        Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
            console.log("Notification opened by device user", notification);
            completion();
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
              'Notification caused app to open from background state:',
              remoteMessage,
            );
        });
      
        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                    if (remoteMessage) {
                        console.log(
                    ' Notification caused app to open from quit state:',
                        remoteMessage,
                    );
                    let data = {
                        name : remoteMessage.data.name,
                        profileImage : remoteMessage.data.profileImage,
                        uid : remoteMessage.data.uid,
                    }
                    this.props.setChatUser(data);
                    navigateToScreen("ChatScreen");
                }
            });

        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = messaging().onMessage((message) => {
            //process data message
            console.log(TAG, "onMessage", JSON.stringify(message));

            Notifications.postLocalNotification({
                body: "Local notification!",
                title: "Local Notification Title",
                userInfo: { }
            });
        });
    }

    /**
    |--------------------------------------------------
    | navigationNotification
    | Navigation to specifica screen
    |--------------------------------------------------
    */

    navigationNotification = (data) => {
        
    }

    /**
    |--------------------------------------------------
    | render
    |--------------------------------------------------
    */

    render() {
        const { } = this.props
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator headerMode="none" initialRouteName={this.props.userData == undefined ? 'AuthNavigator' : 'TabNavigator'}>
                    <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

/**
|--------------------------------------------------
| redux connect
|--------------------------------------------------
*/

const mapStateToProps = state => ({
    userData: state.auth.userData,
    chatUser : state.chat.chatUser,
});

const mapDispatchToProps = dispatch => ({
    setNavigationReference: (data) => dispatch(GeneralAction.setNavigationReference(data)),
    updateOnlineStatus: (props) => dispatch(GeneralService.updateOnlineStatus(props)),
    getNewUserList: () => dispatch(ChatService.getNewUserList()),
    getChatUserList: () => dispatch(ChatService.getChatUserList()),
    setChatUser: (props) => dispatch(ChatAction.setChatUser(props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthHandler);

