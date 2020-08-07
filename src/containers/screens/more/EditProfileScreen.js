import React, {Component} from 'react';
import { View, Keyboard, StyleSheet, Dimensions,Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Form, Item, Input, Textarea, Label, Icon } from 'native-base';

import globalStyles from '@constant/globalStyle';
import images from '@config/images';
import Button from "@component/_CommonButton";
import _BaseComponent from "@component/_BaseComponent";
import { _HeaderWithBackButton } from "@component/_Header";
import colors from '@constant/colors';
import {validateLogin} from "@config/validation";
import APPCONSTANT from "@constant/appConstant";
import Lang from '@config/localization';

import ActionSheet from 'react-native-actionsheet'
import * as MoreService from '@more/more.service';
import fonts from '@config/fonts';
import _ from 'lodash';

import { openCamera, openPicker } from '@config/helper';

const {height , width} = Dimensions.get("window");

class EditProfileScreen extends _BaseComponent{

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props){
        super(props)
        this.state = {
            name : _.get(props, 'userData.name') || '',
            about: _.get(props, 'userData.about') || '',
            profileImage: _.get(props, 'userData.profileImage') || undefined,
        }
    }


    async selectImage(index){
    
        const options = {
            width: 200,
            height: 200,
            cropping: true,
            mediaType: 'photo',
        }
        if(index == 0){

            let image = await openCamera(options);
            this.setState({
                profileImage : image.path
            });
        }else if(index == 1){
            let image = await openPicker(options);
            this.setState({
                profileImage : image.path
            });
        }
    }


    //=======================================================================
    // onPressSave Method
    //=======================================================================

    onPressSave = () =>{
        let data = {
            name : this.state.name,
            about : this.state.about,
            profileImage : this.state.profileImage,
            uid : this.props.userData.uid
        }

        this.props.updateProfile(data);
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render(){
        return(
            <Container>
				<_HeaderWithBackButton title={"EditProfile"} />
                <Content>
                    <View>
                        <View style={styles.rowStyle}>
                            {this.state.profileImage ?
                            <Image source={{uri : this.state.profileImage}} style={styles.profileImageStyle} resizeMode={'contain'} />
                            :<Image source={images.USER_PLACEHOLDER} style={styles.profileImageStyle} resizeMode={'contain'} />}
                            <View style={styles.titleViewStyle}>
                                <Text style={styles.noteStyle}>{"Enter your name and add an optional profile picture"}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{marginLeft:20}} onPress={() => this.ActionSheet.show()}>
                            <Text style={styles.editTextStyle}>{"Edit"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:10}}>
                        <Input
                            style={styles.nameTextInput}
                            value={this.state.name}
                            onChangeText={(val) => this.setState({name : val})}
                        />
                    </View>

                    <View style={{marginTop:30}}>
                    <Text style={styles.aboutTextStyle}>{"ABOUT "}</Text>
                        <Textarea
                            maxLength={400}
                            style={styles.aboutTextInput}
                            value={this.state.about}
                            onChangeText={(val) => this.setState({about : val})}
                        />
                    </View>

                    <View style={{ marginHorizontal: 20,marginTop:30}}>
                        <Button buttonText="Save" color="#fff" bgColor="#243747" width="100%" onPress={this.onPressSave} />
                    </View>
                </Content>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Select Images'}
                    options={['Take photo', 'Choose from Gallery', 'Cancel']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={(index) => this.selectImage(index)}
                    />      
            </Container>
        )
    }
}
const mapStateToProps = (state) => ({
    userData :  state.auth.userData
})

const mapDispatchToProps = dispatch =>({
    updateProfile: (props) => dispatch(MoreService.updateProfile(props)),
})

export default connect(mapStateToProps,mapDispatchToProps)(EditProfileScreen)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    editTextStyle:{
        fontSize: fonts.fontSize_12, color: colors.blueText
    },
    aboutTextStyle:{
        fontSize: fonts.fontSize_12,
        marginHorizontal :20,
        marginBottom:5

    },
    noteStyle:{
        fontSize: fonts.fontSize_13,
        color : colors.textColor
    },
    statusStyle:{
        fontSize: fonts.fontSize_12,
    },
    rowStyle:{
        flexDirection:'row', alignItems:'center', padding:10,
    },
    profileImageStyle:{
        height: 50, width: 50, borderRadius:25,borderWidth: StyleSheet.hairlineWidth
    },
    titleViewStyle:{
        marginLeft:10, flex:1
    },
    nameTextInput:{
        // borderTopWidth:StyleSheet.hairlineWidth,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        height: 35,
        fontSize: fonts.fontSize_12,
        backgroundColor: colors.grayColor,
        paddingLeft:20,
        paddingRight: 20
    },
    aboutTextInput:{
        // borderTopWidth:StyleSheet.hairlineWidth,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        
        fontSize: fonts.fontSize_12,
        backgroundColor: colors.grayColor,
        paddingLeft:20,
        paddingRight: 20
    }
});