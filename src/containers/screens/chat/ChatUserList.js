import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container, Text, Icon, Header, Body, Left, Right, Title, Item, Input} from 'native-base';
import {_Header} from '@component/_Header';
import _CacheImage from '@component/_CacheImage';
import _BaseComponent from '@component/_BaseComponent';
import colors from '@constant/colors';
import Lang from '@config/localization';
import IMAGES from '@config/images';
import fonts from '@config/fonts';
import Modal from 'react-native-modalbox';
import { setDate } from '@config/helper';
import * as ChatAction from '@chat/chat.action';
import * as AuthService from '@auth/auth.service';

const {height , width} = Dimensions.get("window");

var _ = require('lodash');

import moment from 'moment';

let _this = null;
class ChatUserList extends _BaseComponent {

    //=======================================================================
    // constructor Method
    //=======================================================================

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props){
        super(props);
        _this = this;
        console.log("ChatUserList-->",JSON.stringify(props));
        this.state = {
            name: "",
            uid: null,
            email: "",
            userList : props.chatUserlist || [],
            isNewUserModelVisible : false,
            newContactSearchText : '',
            allUserList : props.allUser,
        }
    }   

    static getDerivedStateFromProps(nextProps, previousState){
        return {
        }
    }
    
    navigateToChatScreen(data){
        this.setState({
            isNewUserModelVisible : false
        },() =>{
            this.props.setChatUser(data);
            this.props.navigation.navigate("ChatScreen");
        });
    }

    _renderItem = ({item}) => {
        if(_.get(this.props,'userData.uid') == item.uid)
            return null
        return (
            <TouchableOpacity style={styles.userRow} onPress={() => this.navigateToChatScreen(item)}>
                <View style={styles.profileContainer}>
                {(item.profileImage != undefined && item.profileImage != null && item.profileImage != '') ?
                    <_CacheImage style={styles.profileImage} source={{uri : item.profileImage}} />
                    :
                    <Image source={IMAGES.USER_PLACEHOLDER} style={styles.profileImage} />}
                    <View style={{flex:1,paddingLeft:10,}}>
                        <Text style={[styles.profileName,{fontWeight: (!item.isRead) ? "bold" : "normal"}]}>{item.name}</Text>
                        <View style={{flexDirection:'row', alignItems:'center', marginTop:3}}>
                            {item.messageType == 'image' && <Icon type={'Entypo'} name={'camera'} style={{fontSize: fonts.fontSize_15,  marginLeft:6}} />}
                            <Text numberOfLines={1} style={[styles.msgText,{fontWeight: (!item.isRead) ? "bold" : "normal"}]}>{(item.isTyping) ? 'Typing...' : item.text}</Text>
                        </View>
                        
                    </View>
                    <View style={{paddingHorizontal:5}}>
                        <Text style={[styles.msgText,{fontWeight: (!item.isRead) ? "bold" : "normal"}]}>{setDate(item.createdAt)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    ListEmptyComponent = () =>{
        return(
            <View style={{height:height - 200, alignItems: 'center',justifyContent:'center'}}>
                <Text>{"No message in your inbox, yet!"}</Text>
            </View>
        )
    }

    _rendernewUserItem = ({item}) => {
        if(_.get(this.props,'userData.uid') == item.uid)
            return null 
        return(
            <TouchableOpacity style={styles.userRow} onPress={() => this.navigateToChatScreen(item)}>
                <View style={styles.profileContainer}>
                {(item.profileImage != undefined && item.profileImage != null && item.profileImage != '') ?
                    <_CacheImage style={styles.profileImage} source={{uri : item.profileImage}} />
                    :
                    <Image source={IMAGES.USER_PLACEHOLDER} style={styles.profileImage} />}
                    <View style={{flex:1,paddingLeft:10}}>
                        <Text style={[styles.profileName,{fontWeight: "normal"}]}>{item.name}</Text>
                        <Text style={[styles.msgText,{fontWeight: "normal"}]}>{item.about}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    onChangeTextSearchNewContact = (val) =>{
        let allUserList = []
        if(val != ""){
            allUserList = this.props.allUser.filter(item => {      
                const itemData = `${item.name.toUpperCase()}`
                
                 const textData = val.toUpperCase();
                  
                 return itemData.indexOf(textData) > -1;    
              });
        }else{
            allUserList = this.props.allUser;
        }

        this.setState({
            newContactSearchText : val,
            allUserList
        })
    }


    newUserListModel = () =>{
        return(
            <Modal 
                isOpen={this.state.isNewUserModelVisible} 
                onClosed={() => this.setState({ isNewUserModelVisible: false })}
                position='bottom'
                coverScreen={true}
                backButtonClose
                style={{height: height - 50,
                    backgroundColor: colors.transparent,
                    justifyContent: 'flex-end',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20}}
                >
                <Container>
                    <View style={styles.topViewStyle} />
                    <Header noShadow style={{borderBottomWidth:0, backgroundColor: colors.white,borderTopLeftRadius: 16,
                    borderTopRightRadius: 16}} >
                        <Left style={{flex:.2}} />
                        <Body>
                            <Title>{"New Chat"}</Title>
                        </Body>
                        <Right style={{flex:.2}}>
                            <TouchableOpacity onPress={() => this.setState({isNewUserModelVisible : false})}>
                                <Text>{"Cancel"}</Text>
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    <Header searchBar rounded style={{ height:50, paddingTop:0, backgroundColor: colors.white}} >
                        <Item style={{marginBottom:10}}>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" value={this.state.newContactSearchText} onChangeText={this.onChangeTextSearchNewContact} />
                        </Item>
                        
                        
                    </Header>

                    <FlatList
                        data={this.state.allUserList}
                        renderItem={this._rendernewUserItem}
                        keyExtractor={(item,index) => index.toString()}
                        extraData={this.state}
                        ListEmptyComponent={this.ListEmptyComponent}
                    />
                </Container>
            </Modal>
        )
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render(){
        console.log('this.props.myRecentUserChatList-->',JSON.stringify(this.props.myRecentUserChatList));
        return(
            <Container>
                <_Header 
                    title={Lang.CHAT.TITLE}
                    right={
                        <Icon type={'MaterialCommunityIcons'} name={'square-edit-outline'} style={{fontSize: fonts.fontSize_20, color: colors.white}} onPress={() => this.setState({isNewUserModelVisible: true})} />
                    }
                />
                <View style={{flex:1}}>
                    <FlatList
                        data={_.orderBy(this.props.myRecentUserChatList,['date'],['desc'])}
                        renderItem={this._renderItem}
                        keyExtractor={(item,index) => index.toString()}
                        extraData={this.state}
                        ListEmptyComponent={this.ListEmptyComponent}
                    />
                </View>
                {this.newUserListModel()}
            </Container>
        )
    }
}
const mapStateToProps = (state) => ({
    userData : state.auth.userData,
    allUser : state.chat.allUser,
    myRecentUserChatList : state.chat.myRecentUserChatList,
})

const mapDispatchToProps = dispatch =>({
    setChatUser: (props) => dispatch(ChatAction.setChatUser(props)),
})

export default connect(mapStateToProps,mapDispatchToProps)(ChatUserList)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 6,
        marginBottom: 8
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 6
    },
    profileName: {
        marginLeft: 6,
        fontSize: 16,
        color : colors.textColor
    },
    msgText: {
        marginLeft: 6,
        fontSize: fonts.fontSize_10,
        color : colors.textColor
    },
    userRow:{
        borderBottomWidth: StyleSheet.hairlineWidth,borderBottomColor: colors.borderColor
    },
    topViewStyle: {
        alignSelf: 'center',
        backgroundColor: colors.black,
        width: 50,
        height: 5,
        borderRadius: 25,
        marginTop:20
    },
});