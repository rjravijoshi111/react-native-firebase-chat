import React, {Component} from 'react';
import { View, Keyboard, StyleSheet, Dimensions,Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Form, Item, Input, Label, Icon } from 'native-base';

import globalStyles from '@constant/globalStyle';
import Button from "@component/_CommonButton";
import _BaseComponent from "@component/_BaseComponent";
import {_HeaderWithBackButton} from "@component/_Header";
import colors from '@constant/colors';
import {validateRegister} from "@config/validation";
import fonts from "@config/fonts";
import APPCONSTANT from "@constant/appConstant";
import Lang from '@config/localization';
import * as AuthService from '@auth/auth.service';

const {height , width} = Dimensions.get("window");

class Signup extends _BaseComponent {

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props){
        super(props)
        this.state = {
            userList : props.userList || [],
            name : '',
            email : '',
            password : '',
            confirmPassword : ''
        }
    }

    //=======================================================================
    // signUpTap Method
    //=======================================================================

    signUpTap = () =>{

        Keyboard.dismiss();
        const { name, email, password, confirmPassword } = this.state
        const fields = { name, email, password, confirmPassword };
        const result = validateRegister(fields);
        
        if(result){
            let data = { name, email, password };
            this.props.signup(data);
        }
        
    }

    //=======================================================================
    // _focusInput Method
    //=======================================================================

    _focusInput(inputField) {
        this[inputField]._root.focus();
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render(){
        return(
            <Container>
                <_HeaderWithBackButton title={"Register"} />
                <Content>
                    <View style={styles.card}>
                        <Form style={styles.formStyle}>

                             <View style={styles.textInputContainer}>
                                <Item floatingLabel last style={styles.textInputItemStyle}>
                                <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.NAME}</Label>
                                <Input 
                                    style={styles.textInputStyle}
                                    getRef={(input) => this.nameInput = input}
                                    value={this.state.name}
                                    blurOnSubmit={true}
                                    onChangeText={ (text) => this.setState({ name : text }) }
                                    textColor = {colors.textFieldColor}
                                    inputContainerStyle={{paddingLeft:10,paddingRight:10}}
                                    labelTextStyle={{paddingLeft:10,paddingRight:10}}
                                    returnKeyType={"next"}
                                    keyboardType = {"email-address"}
                                    autoCapitalize = 'none'
                                    onSubmitEditing={() => this._focusInput('emailInput')}
                                />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Icon type={'Entypo'} name={"user"} style={styles.iconStyle} />
                                </View> 
                            </View>
                        
                            <View style={styles.textInputContainer}>
                                <Item floatingLabel last style={styles.textInputItemStyle}>
                                <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.EMAIL_ID}</Label>
                                <Input 
                                    style={styles.textInputStyle}
                                    getRef={(input) => this.emailInput = input}
                                    value={this.state.email}
                                    blurOnSubmit={true}
                                    onChangeText={ (text) => this.setState({ email : text }) }
                                    textColor = {colors.textFieldColor}
                                    inputContainerStyle={{paddingLeft:10,paddingRight:10}}
                                    labelTextStyle={{paddingLeft:10,paddingRight:10}}
                                    returnKeyType={"next"}
                                    keyboardType = {"email-address"}
                                    autoCapitalize = 'none'
                                    onSubmitEditing={() => this._focusInput('passwordInput')}
                                />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Icon type={'MaterialIcons'} name={"mail"} style={styles.iconStyle} />
                                </View> 
                            </View>

                            {/* <View style={styles.textInputContainer}>
                                <Item floatingLabel last style={styles.textInputItemStyle}>
                                <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.PHONENUMBER}</Label>
                                <Input 
                                    style={styles.textInputStyle}
                                    getRef={(input) => this.phoneNumberInput = input}
                                    value={this.state.phoneNumber}
                                    blurOnSubmit={true}
                                    onChangeText={ (text) => this.setState({ phoneNumber : text }) }
                                    textColor = {colors.textFieldColor}
                                    inputContainerStyle={{paddingLeft:10,paddingRight:10}}
                                    labelTextStyle={{paddingLeft:10,paddingRight:10}}
                                    returnKeyType={"next"}
                                    keyboardType = {"name-phone-pad"}
                                    autoCapitalize = 'none'
                                    onSubmitEditing={() => this._focusInput('passwordInput')}
                                />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Icon type={'Entypo'} name={"mobile"} style={styles.iconStyle} />
                                </View> 
                            </View> */}
                            
                            <View style={{flex:1,borderBottomWidth:0.5,borderColor:"lightgray"}}>
                                <Item floatingLabel last>
                                <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.PASSWORD}</Label>
                                <Input
                                    style={styles.textInputStyle}
                                    getRef={(input) => this.passwordInput = input}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={ (text) => this.setState({ password : text }) }
                                    textColor = {colors.textFieldColor}
                                    inputContainerStyle={{paddingLeft:10,paddingRight:10}}
                                    labelTextStyle={{paddingLeft:10,paddingRight:10}}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this._focusInput('confirmPasswordInput')}
                                />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Icon type={'Entypo'} name={"lock"} style={styles.iconStyle} />
                                </View> 
                            </View>

                            <View style={{flex:1,borderBottomWidth:0.5,borderColor:"lightgray"}}>
                                <Item floatingLabel last>
                                <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.CONFIRM_PASSWORD}</Label>
                                <Input
                                    style={styles.textInputStyle}
                                    getRef={(input) => this.confirmPasswordInput = input}
                                    value={this.state.confirmPassword}
                                    secureTextEntry={true}
                                    onChangeText={ (text) => this.setState({ confirmPassword : text }) }
                                    textColor = {colors.textFieldColor}
                                    inputContainerStyle={{paddingLeft:10,paddingRight:10}}
                                    labelTextStyle={{paddingLeft:10,paddingRight:10}}
                                    returnKeyType={"done"}
                                />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Icon type={'Entypo'} name={"lock"} style={styles.iconStyle} />
                                </View> 
                            </View>
                        </Form>
                    </View>
                    <View style={{ marginHorizontal: 20,marginTop:20}}>
                        <Button buttonText="Sign up" color="#fff" bgColor="#243747" width="100%" onPress={this.signUpTap} />
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch =>({
    signup : (props) => dispatch(AuthService.signup(props)),
})

export default connect(mapStateToProps,mapDispatchToProps)(Signup)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    card:{
        marginLeft:20,
        marginRight:20,
        backgroundColor:'#fff',
        shadowOffset:{  width: 3,  height: 3,  },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        marginTop : 50
    },
    formStyle:{
        width:'100%',
        flex: 1,
        paddingBottom:40,
        backgroundColor : colors.textInputBackgroundColor,
    },
    textInputContainer:{
        flex:1,borderBottomWidth:0.5,borderColor:'lightgray',
        backgroundColor : colors.textInputBackgroundColor,
    },
    textInputStyle:{
        height:45,
        marginTop:5,
        marginBottom:15,
        width: width - 130,
        borderColor: "gray",
        paddingLeft:5,
        paddingRight:20,
        marginRight:35,
        color : colors.textInputColor,
    },
    textInputItemStyle:{
        backgroundColor : colors.textInputBackgroundColor
    },
    textInputTitleStyle :{
        color : colors.textInputPlaceholderColor
    },
    iconStyle:{
        fontSize: fonts.fontSize_24,
        color : '#8A8A8A'
    },
    loginButtonView:{
        marginTop: -20,
        alignSelf: 'center',
        backgroundColor : 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        height : 40,
        width : 40,
        borderRadius: 20,
    },
});