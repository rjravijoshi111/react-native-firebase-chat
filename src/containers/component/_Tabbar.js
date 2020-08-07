import React, { Component } from 'react'
import { Keyboard, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { Button, Text, Icon, Footer, FooterTab, Badge, View, } from "native-base";
import images from '@config/images';
import colors from '@constant/colors';
import Lang from '@config/localization';
import fonts from '@config/fonts';
import globalsConst from '@constant/globalsConst';
const { height, width } = Dimensions.get('window');
// import global from '@src/constant/global';

let _ = require('lodash');
class TabBarComponent extends Component {

    constructor(props) {
        super(props)

        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)

        this.state = {
            isVisible: true,
            isCart: false
        }
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
    }

    keyboardWillShow = event => {
        this.setState({
            isVisible: false
        })
    }

    keyboardWillHide = event => {
        this.setState({
            isVisible: true
        })
    }

    render() {
        return this.state.isVisible ?
        <Footer>
            <FooterTab style={{backgroundColor: colors.tabbarBackgroundColor, borderTopWidth: StyleSheet.hairlineWidth}}>
                <TouchableOpacity
                    style={styles.tabStyle}
                    onPress={() => this.props.navigation.navigate('ChatNavigator')}>
                    <Icon type={'Ionicons'} name={'ios-chatbubbles'} style={[styles.tabImage,{color: this.props.state.index == 0 ? colors.primaryColor : colors.tabbarIconColor}]} />
                    <Text style={[styles.tabText, { color: this.props.state.index == 0 ? colors.primaryColor : colors.tabbarIconColor }]}>{'Chat'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabStyle}
                    onPress={() => this.props.navigation.navigate('MoreNavigator')}>
                    <Icon type={'Entypo'} name={'dots-three-horizontal'} style={[styles.tabImage,{color: this.props.state.index == 1 ? colors.primaryColor : colors.tabbarIconColor}]} />
                    <Text style={[styles.tabText, { color: this.props.state.index == 1 ? colors.primaryColor : colors.tabbarIconColor }]}>{'More'}</Text>
                </TouchableOpacity>
                </FooterTab>
            </Footer>
            :
            null
    }
}

const mapStateToProps = state => ({
    
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(TabBarComponent);

const styles = StyleSheet.create({
    tabText: {
        fontFamily: fonts.fontFamily_medium,
        color: colors.tab_text,
        fontSize: fonts.fontSize_10,
        marginTop: 5,
        textTransform: 'capitalize'
    },
    tabStyle:{
        flexDirection: 'column', alignItems: 'center', padding: 5, flex: 1,
    },
    tabImage: {
        fontSize: fonts.fontSize_20
    },
    devider: {
        width: 1,
        // backgroundColor: colors.gray_light_2,
        height: '70%', alignSelf: 'center'
    },
    
});