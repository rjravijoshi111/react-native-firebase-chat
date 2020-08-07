import React, {Component} from 'react';
import { View, Keyboard, StyleSheet, Dimensions,Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Form, Item, Input, Label, Icon } from 'native-base';

import globalStyles from '@constant/globalStyle';
import Button from "@component/_CommonButton";
import _BaseComponent from "@component/_BaseComponent";
import { _Header } from "@component/_Header";
import colors from '@constant/colors';
import {validateLogin} from "@config/validation";
import fonts from "@config/fonts";
import APPCONSTANT from "@constant/appConstant";
import Lang from '@config/localization';
import * as AuthService from '@auth/auth.service';
const {height , width} = Dimensions.get("window");

class Login extends _BaseComponent{

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props){
        super(props)
        this.state = {
			email : '',
			password :''
        }
    }

    //=======================================================================
    // SignIn Tap Method
    //=======================================================================

    signInTap = () =>{
        Keyboard.dismiss()
        const { email, password } = this.state
        const fields = { email, password };
		const result = validateLogin(fields);
		
        if(result){
            let data={
                email, password
            }
            
            this.props.userSignIn(data);
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
            <Container style={styles.container}>
				<_Header title={"Login"} />
                <Content style={{flex:1}} bounces={false}>
                        <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
							<Icon type={'Fontisto'} name={"hipchat"} style={{color: "#243747", fontSize: 125 }} size={125} />
                            <Text style={styles.titleStyle}>{"Chat Book"}</Text>
                        </View>
                            <View style={styles.card}>
                                <Form style={styles.formStyle}>
                                
                                <View style={styles.textInputContainer}>
                                    <Item floatingLabel last style={styles.textInputItemStyle}>
                                    <Label style={styles.textInputTitleStyle}>{Lang.TEXTFIELD_LABEL.EMAIL_ID}</Label>
                                    <Input 
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.emailInput = input}
                                        value={this.state.email}
                                        blurOnSubmit={true}
                                        placeholderTextColor={'#fff'}
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
                                        <Icon type={'Entypo'} name={"user"} style={styles.iconStyle} />
                                    </View> 
                                </View>
                                
                                <View style={styles.textInputContainer}>
                                    <Item floatingLabel last style={styles.textInputItemStyle}>
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
                                        returnKeyType={"done"}
                                    />
                                    </Item>
                                    <View style={globalStyles.textFieldIcon}>
                                        <Icon type={'Entypo'} name={"lock"} style={styles.iconStyle}/>
                                    </View> 
                                </View>
                                </Form>
                            </View>
                            <View style={{ marginHorizontal: 20,marginTop:20}}>
                                <Button buttonText="Login" color="#fff" bgColor="#243747" width="100%" onPress={this.signInTap} />
                            </View>
                            <View style={{ marginVertical: 5,marginHorizontal: 20, marginBottom: 20 }}>
                                <Button buttonText="Create Account" color="#fff" bgColor={"#00BBB1"} onPress={()=>this.props.navigation.navigate("SignupScreen")} width="100%" />
                            </View>
                </Content>
            </Container>
        )
    }
}
const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch =>({
    userSignIn: (props) => dispatch(AuthService.userSignIn(props)),
})

export default connect(mapStateToProps,mapDispatchToProps)(Login)

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
        marginTop : 50,
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
    titleStyle:{
        fontSize:30,fontWeight:'900',color:'#00BBB1', marginTop: 10
    }
});