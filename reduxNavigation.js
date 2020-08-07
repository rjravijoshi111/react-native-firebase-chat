import React, { Component } from "react";
import { BackHandler, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { SkypeIndicator } from 'react-native-indicators';
import colors from '@constant/colors';
import * as GeneralAction from "@general/general.action";
// import globalsConst from '@constant/globalsConst';
import Navigator from "./containers/navigator";
// import { drawer } from "./containers/navigator/AppNavigator";

// export function navigate(name, params) {
//     navigationRef.current.navigate(name, params);
// }

class ReduxNavigation extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }


    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }


    onBackPress = () => {
        const { isDrawerOpen, dispatch, navigation } = this.props;
        let isClose = true;
    };

    render() {
        const { nav, dispatch } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Navigator state={nav} dispatch={dispatch} />
                {this.props.isLoading && <View style={styles.loadingIndicator}>
                    <SkypeIndicator color={colors.primaryColor} animating={this.props.isLoading} size={50} />
                </View>}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.general.isLoading,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ReduxNavigation);

const styles = StyleSheet.create({
    loadingIndicator: {
        height: '100%',
        width: '100%',
        backgroundColor: colors.loadingIndicatorBGColor,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1
    },
    // progressTextStyle: {
    //     fontSize: global.fontSize_13,
    //     fontWeight: 'bold',
    //     fontFamily: global.fontFamily_semi_bold,
    //     color: colors.primaryColor
    // }
})