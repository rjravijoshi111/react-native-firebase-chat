import React, {Component} from 'react';
import { View, Keyboard, StyleSheet, Dimensions,Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Form, Item, Input, Label, Icon } from 'native-base';

import images from '@config/images';
import _CacheImage from '@component/_CacheImage';
import Button from "@component/_CommonButton";
import _BaseComponent from "@component/_BaseComponent";
import { _Header } from "@component/_Header";
import colors from '@constant/colors';
import {validateLogin} from "@config/validation";
import APPCONSTANT from "@constant/appConstant";
import Lang from '@config/localization';
import * as AuthService from '@auth/auth.service';
import * as GeneralAction from '@general/general.action';
import fonts from '@config/fonts';
import _ from 'lodash';

const {height , width} = Dimensions.get("window");
class MoreOptionScreen extends _BaseComponent{

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props){
        super(props)
        this.state = {
        }
    }

    //=======================================================================
    // getDerivedStateFromProps Method
    //=======================================================================

    static getDerivedStateFromProps(nextProps, previousState){

        return {
        }
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render(){
        const { userData } = this.props;
        return(
            <Container>
				<_Header title={"More"} />
                <Content>
                    <TouchableOpacity style={styles.rowStyle} onPress={() => this.props.navigation.navigate('EditProfileScreen')}>
                    {_.get(userData,'profileImage') ? <_CacheImage source={{uri : _.get(userData,'profileImage')}} style={styles.profileImageStyle} resizeMode={'contain'} />
                        :
                    <Image source={images.USER_PLACEHOLDER} style={styles.profileImageStyle} resizeMode={'contain'} />}
                        <View style={styles.titleViewStyle}>
                            <Text style={styles.nameStyle}>{_.get(userData,'name') || ''}</Text>
                            <Text style={styles.statusStyle}>{_.get(userData,'about') || '' }</Text>
                        </View>
                        <View>
                            <Icon type={'Entypo'} name={'chevron-right'} style={{fontSize: fonts.fontSize_20, color: colors.tabbarIconColor}} />
                        </View>
                    </TouchableOpacity>
                    

                    

                    <View style={{ marginHorizontal: 20,marginTop:50}}>
                        <Button buttonText="Logout" color="#fff" bgColor={colors.redColor} width="100%" onPress={() => this.props.logout()} />
                    </View>
                </Content>
            </Container>
        )
    }
}
const mapStateToProps = (state) => ({
    userData : state.auth.userData,
})

const mapDispatchToProps = dispatch =>({
    userSignIn: (user) => dispatch(AuthService.userSignIn(user)),
    logout: (props) => dispatch(AuthService.logout(props)),
})

export default connect(mapStateToProps,mapDispatchToProps)(MoreOptionScreen)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    nameStyle:{
        fontSize: fonts.fontSize_14, fontWeight:'bold',
        color : colors.textColor
    },
    statusStyle:{
        fontSize: fonts.fontSize_12,
        color : colors.textColor
    },
    rowStyle:{
        flexDirection:'row', alignItems:'center', padding:10, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.borderColor
    },
    profileImageStyle:{
        height: 50, width: 50, borderRadius:25, borderWidth: StyleSheet.hairlineWidth,
        
    },
    titleViewStyle:{
        marginLeft:10,
         flex:1, justifyContent:'center'
    },
    radioButtonView:{
        flexDirection:'row', alignItems:'center', justifyContent:'center'
    },
    radioButtonTextStyle:{
        fontSize: fonts.fontSize_12, color: colors.textColor, marginLeft:10
    }
});