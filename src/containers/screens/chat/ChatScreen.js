
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, StatusBar} from 'react-native';
import { connect } from 'react-redux';
import { Container, Text, Icon, Header, Left,Right, Body, Title, Subtitle } from 'native-base';
import {_HeaderWithBackButton, _Header} from '@component/_Header';
import _CacheImage from '@component/_CacheImage';
import _BaseComponent from '@component/_BaseComponent';
import colors from '@constant/colors';
import globals from '@constant/globalsConst';
import Lang from '@config/localization';
import fonts from '@config/fonts';
const { height, width } = Dimensions.get("window");
import { GiftedChat, Send, Composer, Bubble, MessageImage } from "react-native-gifted-chat";
import database from '@react-native-firebase/database';
import * as ChatService from '@chat/chat.service';
import * as ChatAction from '@chat/chat.action';
import IconActionSheet from 'react-native-icon-action-sheet'
import { openCamera, openPicker, fileUpload } from '@config/helper';
import Lightbox from 'react-native-lightbox';
import _ from 'lodash';

import moment from 'moment';

let _this = null;
class ChatScreen extends _BaseComponent {

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props) {
        super(props);
        _this = this;
        console.log("ChatScreen-->", JSON.stringify(props));
        console.log("this.generateChatId-->", this.generateChatId());
        this.state = {
            userData: props.userData,
            chatUser: props.chatUser,
            messages: props.chatData[this.generateChatId()] || [],
            image: undefined,
            isLoadingEarlier : true,
            isReceiverOnline : false,
            receiverLastSeen : undefined,
            isTyping: false,
        }
        this.currentPage = 1;
        this.pageSize = 20;
        this.pageOffset = 20;
        
        this.chatRef = this.getRef().child("Chat/" + this.generateChatId());
        this.receiverUserProfile = this.getRef().child("Users/" + props.chatUser.uid);
        this.chatRefData = this.chatRef.orderByChild("order")
        this.onSend = this.onSend.bind(this);

        this.receiverUser = this.getRef().child(`ChatList/${props.userData.uid}/member/${props.chatUser.uid}`);
        this.senderUser = this.getRef().child(`ChatList/${props.chatUser.uid}/member/${props.userData.uid}`);

    }

    static getDerivedStateFromProps(nextProps, previousState){
        return {
        }
    }

    generateChatId() {
        if (this.props.userData.uid > this.props.chatUser.uid) return `${this.props.userData.uid}-${this.props.chatUser.uid}`;
        else return `${this.props.chatUser.uid}-${this.props.userData.uid}`;
    }

    getRef() {
        return database().ref();
    }

    componentDidMount() {
        this.listenForItems(this.chatRefData);
        this.receiverUser.once('value', function (snapshot) {
            if(snapshot.val() != null && snapshot.val() != undefined){
                _this.messageStatusChange(_this.receiverUser);
            }
        });
        this.receiverUserProfileListener()

        this.init=false;
        this.startTyping = _.debounce(function () {
            if (!this.init) return
            this.isTypingFlagUpdate(true)
        }, 500, { 'leading': true, 'trailing': false })
          
        this.stopTyping = _.debounce(function () {
            if (!this.init) return
            this.isTypingFlagUpdate(false)
        }, 1500)
    }

    receiverUserProfileListener(){
        
        this.receiverUserProfile.on('value', function (snapshot) {
            console.log('receiver user detail-->', snapshot.val())
            
            let dt = 'Last seen '
            
            let tempDate = new Date(snapshot.val().lastSeenTimeStamp);
            if(tempDate.getDate() == new Date().getDate()){
                dt += "today"
            }else if(tempDate.getDate() == new Date().getDate() - 1){
                dt += "yesterday"
            // }else if((tempDate.getDate() == new Date().getDate() - 2) || 
            //     (tempDate.getDate() == new Date().getDate() - 3) ||
            //     (tempDate.getDate() == new Date().getDate() - 4) ||
            //     (tempDate.getDate() == new Date().getDate() - 5)){
            //     dt = moment(tempDate).format("dddd")
            }else{
                dt += moment(tempDate).format("DD/MM/YYYY")
            }

            dt += " at " +  moment(tempDate).format("h:mm A")

                
                _this.setState({
                    isReceiverOnline : snapshot.val().isOnline,
                    receiverLastSeen : dt,
                })
            });
    }
    
    messageStatusChange(receiverUserRef){
        if(globals.isInternetConnected){
            receiverUserRef.once('value', function (snapshot) {
                if(snapshot.val() != null || snapshot.val() != undefined){
                    
                    console.log("Sender snapshot value-->", JSON.stringify(snapshot))
                    _this.getRef()
                    .child(`ChatList/${_this.state.userData.uid}/member/${_this.state.chatUser.uid}`)
                    .update({
                        isRead : true
                    })
                }
                
            });
        }else{
            this.props.setMessageRead(this.props.chatUser.uid)
        }
        
        if(globals.isInternetConnected){
            // receiverUserRef.on('child_changed', function (snapshot) {
            receiverUserRef.on('value', function (snapshot) {
                console.log("Sender snapshot child_changed-->", JSON.stringify(snapshot))
                _this.setState({
                    isTyping : snapshot && snapshot.val() && snapshot.val().isTyping || false
                })
                _this.getRef()
                .child(`ChatList/${_this.state.userData.uid}/member/${_this.state.chatUser.uid}`)
                .update({
                    isRead : true
                })
            });
        }else{
            this.props.setMessageRead(this.props.chatUser.uid)
        }
    }

    isTypingFlagUpdate(isTyping){
        
        _this.senderUser
            .once('value', function (snapshot) {
                if(snapshot.val() != undefined && snapshot.val() != null){
                    _this.senderUser
                    .update({
                        isTyping : isTyping
                    })
                }
            })
        
    }

    handler = (snap) =>{
        console.log('snap-->', snap)
        var items = [];
            let index = 0;
            snap.forEach(child =>{
                if(index <= 0){
                    this.lastKey = child.key
                    index++;
                }
                items.push({
                    ...child.val(),
                    user: {
                        _id: child.val().uid,
                        avatar: _this.props.chatUser.profileImage
                    }
                });
            });
            // this.setState({
            //     isLoadingEarlier: false,
            //     messages: items
            // },() => {
                this.props.setChatData(items,this.generateChatId())
            // });
    }

    listenForItems(chatRef) {
        chatRef.on("value",this.handler);

    }

    componentWillUnmount() {
        this.chatRefData.off();
        this.receiverUser.off("child_changed");
        this.receiverUserProfile.off()
    }

    sendFile(chatRecord){
        this.chatRef.push(chatRecord);
        let messageData= {
            text: 'Photo',
            messageType : "image",
        }
        this.chatListUpdate(messageData, chatRecord.createdAt)
    }

    onSend(messages = []) {

        console.log("OnSend", messages.length)
        messages.map((message, index) => {
            var now = new Date().getTime();
            this.chatRef.push({
                _id: now,
                text: message.text,
                createdAt: now,
                uid: this.state.userData.uid,
                image: "",
                fuid: this.props.chatUser.uid,
                order: -1 * now
            });
            if (messages.length - 1 == index) {
                this.chatListUpdate(messages[index], now);
            }
        })
    }

    chatListUpdate = (message, now) => {
        console.log("message-->", message);
        this.receiverUser.once('value', function (snapshot) {
            console.log("Sender snapshot", JSON.stringify(snapshot))
            if (snapshot.val() == null || snapshot.val() == undefined) {
                _this.getRef().child(`ChatList/${_this.state.userData.uid}/member/${_this.props.chatUser.uid}`).set({
                    text: message.text,
                    messageType : message.messageType || '',
                    createdAt: now,
                    uid: _this.props.userData.uid,
                    isRead : true
                })
            } else {
                _this.getRef()
                .child(`ChatList/${_this.state.userData.uid}/member/${_this.props.chatUser.uid}`)
                .update({
                    text: message.text,
                    messageType : message.messageType || '',  
                    createdAt: now,
                    uid: _this.props.userData.uid,
                    isRead : true
                })
            }
        });

        this.senderUser.once('value', function (snapshot) {
            console.log("Reciever snapshot", JSON.stringify(snapshot))
            if (snapshot.val() == null || snapshot.val() == undefined) {
                _this.getRef().child(`ChatList/${_this.props.chatUser.uid}/member/${_this.state.userData.uid}`).set({
                    text: message.text,
                    messageType : message.messageType || '',
                    createdAt: now,
                    uid: _this.state.userData.uid,
                    isRead : false
                })
            } else {
                // let userObj = snapshot.val();
                // let key = Object.keys(userObj)[0]
                _this.getRef()
                .child(`ChatList/${_this.props.chatUser.uid}/member/${_this.state.userData.uid}`)
                .update({
                    text: message.text,
                    messageType : message.messageType || '',
                    createdAt: now,
                    isRead : false,
                    uid: _this.state.userData.uid,
                })
            }
        });
    }


    openMoreOption = () => {
        IconActionSheet.showActionSheetWithOptions(
            {
                cancelButtonIndex: 2,
                tintColor: '#007aff',
                options: [
                    {
                        title: 'Camera',
                        icon: <Icon size={30} family={'Feather'} type={'Feather'} name={'camera'} style={{fontSize: fonts.fontSize_20}} color={'blue'} />,
                        titleTextAlignment: 0,
                    },
                    {
                        title: 'Photos & Video Library',
                        icon: <Icon size={30} family={'FontAwesome'} type={'FontAwesome'} name={'image'} style={{fontSize: fonts.fontSize_20}} color={'red'} />,
                        titleTextAlignment: 0
                    },
                    {
                        title: 'Cancel',
                        titleTextColor: '#fc6c85'
                    }
                ]
            }, (buttonIndex) => this.selectAttachmentIndex(buttonIndex))
    }

    selectAttachmentIndex = async(index) => {
        if(index != 2){
            const options = {
                width: 200,
                height: 200,
                cropping: true,
                mediaType: 'photo',
            }
            let fileURL = '';
            var now = new Date().getTime();
            let chatRecord = {
                _id: now,
                text: '',
                createdAt: now,
                uid: this.state.userData.uid,
                image: '',
                fuid: this.props.chatUser.uid,
                messageType : "image",
                order: -1 * now,
                user: {
                    "_id": this.state.userData.uid,
                    avatar: _this.props.chatUser.profileImage
                }
            }
            if (index == 0) {
                let image = await openCamera(options);
                
                let imageData = {
                    fileName : image.filename,
                    uri : image.path
                }
    
                chatRecord.image = image.path
                this.props.setSingleChatData(chatRecord, this.generateChatId())
                fileURL = await fileUpload(imageData,'attchment');
                chatRecord.image = fileURL;
            } else if(index == 1) {
                let image = await openPicker(options);
    
                let imageData = {
                    fileName : image.filename,
                    uri : image.path
                }
                chatRecord.image = image.path;
                this.props.setSingleChatData(chatRecord,this.generateChatId());
                
                fileURL = await fileUpload(imageData,'attchment');
                chatRecord.image = fileURL;
            }
            this.sendFile(chatRecord);
        }
    }

    renderSend(props) { 
        // console.log('renderSend',props)
        return (
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 15}}>
                    <Text style={{fontSize:14,color:'#407dfe'}}>{"Send"}</Text>
                    {/* <Image source={require('../../assets/send.png')} resizeMode={'center'}/> */}
                </View>
            </Send>
        );
    }

    renderComposer = props => {
        // console.log('renderComposer',props)
        return (
            <View style={styles.composeContainer}>
                <TouchableOpacity style={styles.iconsView} onPress={this.openMoreOption}> 
                    <Icon type={'Entypo'} name={'plus'} style={{fontSize: fonts.fontSize_20, color: colors.chatIconColor}} />
                </TouchableOpacity>
                <Composer {...props} textInputStyle={styles.textInputStyle} />

                {(props.text != "") ?
                    <Send
                        {...props}
                    >
                    <View style={{marginRight: 10, marginBottom: 15}}>
                        <Text style={{fontSize:14,color:'#407dfe'}}>{"Send"}</Text>
                        {/* <Image source={require('../../assets/send.png')} resizeMode={'center'}/> */}
                    </View>
                </Send>
                :
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={styles.iconsView} onPress={() => this.selectAttachmentIndex(0)}> 
                        <Icon type={'Feather'} name={'camera'} style={{fontSize: fonts.fontSize_20, color: colors.chatIconColor}} />
                    </TouchableOpacity>
                    {/* <View style={styles.iconsView}> 
                        <Icon type={'SimpleLineIcons'} name={'microphone'} style={{fontSize: fonts.fontSize_20}} />
                    </View>  */}
                </View>}
            </View>
        );
    }

    renderBubble = props => {
        return (
            <View>
                {/* {this.renderName(props)}
                {this.renderAudio(props)} */}
                <Bubble {...props} />
            </View>
        );
    };
   
    renderMessageImage = props =>{
        let title = props.currentMessage.uid == this.props.userData.uid ? "You" : this.props.chatUser.name
        console.log('isServerURL-->',_.get(props,'currentMessage.image'));
        return(
            <Lightbox  activeProps={{
                style: {
                    flex:1,
                    resizeMode: 'contain',
                },
            }}
            renderHeader={(close) =>{
                return(
                    <_Header 
                        left={
                            <Icon type={'AntDesign'} name={'arrowleft'} style={{fontSize: fonts.fontSize_18, color: colors.white}} onPress={close} />
                        }
                    title={title} />
                )
            }}
            >
                <_CacheImage 
                    source={{ uri: props.currentMessage.image }}
                    style={styles.imageBubbleStyle} resizeMode={'cover'} />
            </Lightbox>
        )
    }

    detectTyping = (text) => {
        if (text!="")
            this.init = true;
        
        this.startTyping()
        this.stopTyping();
    }

    renderFooter = () => {
        if(this.state.isTyping)  {
            return (
                <View style={{margin:10}}>
                    <Text stye={{fontSize:fonts.fontSize_14}}>{"Typing..."}</Text>
                </View>
            )
        } else {
            return null
        }
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render() {
        return (
            <Container>
                {/* <_HeaderWithBackButton
                    title={this.props.chatUser.name || Lang.CHAT.TITLE}
                /> */}

                <Header style={styles.headerContainer} androidStatusBarColor={colors.headerBackgroundColor}>
                    <Left style={{flex: 0.2, alignItems:'center', justifyContent:'center'}}>
                        <Icon type={'AntDesign'} name={'arrowleft'} style={styles.backArrow} onPress={() => this.props.navigation.goBack()} />
                    </Left>
                    <Body style={{alignItems:'center'}}>
                        <Title style={styles.titleStyle}>{this.props.chatUser.name || Lang.CHAT.TITLE}</Title>
                        <Subtitle style={styles.subTitleStyle}>{this.state.isReceiverOnline ? "Online" : this.state.receiverLastSeen || ''}</Subtitle>
                    </Body>
                    <Right style={{flex: 0.2}} />
                </Header>

                <GiftedChat
                    // messages={this.state.messages}
                    messages={this.props.chatData[this.generateChatId()] || []}
                    onSend={this.onSend.bind(this)}
                    isAnimated={true}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    onPressActionButton={this.onPressActionButton}
                    showUserAvatar={false}
                    renderComposer={this.renderComposer}
                    renderBubble={this.renderBubble}
                    renderMessageImage={this.renderMessageImage}
                    renderAvatar={(data) =>{
                        return(
                            <_CacheImage style={styles.profileImage} source={{uri : data.currentMessage.user.avatar != "" ? data.currentMessage.user.avatar : "http://topsdemo.co.in/webservices/farmhand/images/user_placeholder.jpeg"}} />
                        )
                    }}
                    user={{
                        _id: this.state.userData.uid
                    }}
                    renderSend={(props) => this.renderSend(props)}
                    extraData={this.state}
                    onInputTextChanged={this.detectTyping}
                    renderFooter={this.renderFooter}
                    parsePatterns={(linkStyle) => [
                        {
                          pattern: /#(\w+)/,
                          style: linkStyle,
                          onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                        },
                      ]}
                />
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    userData : state.auth.userData,
    chatUser : state.chat.chatUser,
    chatData : state.chat.chatData,
})

const mapDispatchToProps = dispatch => ({
    // onLogin: (user) => dispatch(action_UserLogin(user)),
    // loadingIndicator: (props) => dispatch(action_LoadingIndicator(props)),
    setChatData: (props,id) => dispatch(ChatAction.setChatData(props,id)),
    setMessageRead: (id) => dispatch(ChatService.setMessageRead(id)),
    setChatUser : (props) => dispatch(ChatAction.setChatUser(props)),
    setSingleChatData : (props,id) => dispatch(ChatAction.setSingleChatData(props,id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 6
    },
    composeContainer:{
        flexDirection: 'row',
        backgroundColor : colors.textInputBackgroundColor
    },
    textInputStyle:{
        borderWidth:StyleSheet.hairlineWidth, 
        borderRadius:20, paddingLeft:10, paddingTop:7,
        marginHorizontal:5,
        backgroundColor: colors.chatInputBackGroundColor
    },
    iconsView:{
        width:40, alignItems:'center', justifyContent:'center'
    },
    imageBubbleStyle : {
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
            marginRight:10,
            resizeMode: 'cover'
    },
    headerContainer:{
        backgroundColor: colors.headerBackgroundColor
    },
    titleStyle:{
        color : colors.white, fontWeight:'bold'
    },
    subTitleStyle:{
        color : colors.white, fontWeight:'bold'
    },
    backArrow:{
        fontSize: fonts.fontSize_18, color: colors.white
    }
});       