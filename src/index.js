/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { YellowBox, View } from 'react-native';
import { StyleProvider } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import globalsConst from '@src/constant/globalsConst';
import NetInfo from "@react-native-community/netinfo";
import { getFcmToken } from '@config/helper';
import { store, persistor } from './reducers';
import ReduxNavigation, { navigationRef } from "./reduxNavigation";
import getTheme from './theme/components';
import commonColor from './theme/variables/commonColor';


class App extends Component {

    constructor(props) {
        super(props);
        YellowBox.ignoreWarnings([
            'Warning:',
            'Warning: Failed',
            '`-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.',
            'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
            'Animated: `useNativeDriver`'
        ]);
        this.state = {
            isLoading: true
        }

        NetInfo.addEventListener(state => {
            this.handleFirstConnectivityChange(state.isConnected)
        });

        NetInfo.fetch().then(state => {
            globalsConst.isInternetConnected = state.isConnected
            this.setState({ isLoading: false })
        });
        getFcmToken()
    }

    handleFirstConnectivityChange = (isConnected) => {
        globalsConst.isInternetConnected = isConnected
    }


    render() {

        if (!this.state.isLoading) {
            return (
                <StyleProvider style={getTheme(commonColor)}>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <ReduxNavigation />
                        </PersistGate>
                    </Provider>
                </StyleProvider>
            )
        }
        return <View />
    }
}

export default App;

