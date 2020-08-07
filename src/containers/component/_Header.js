import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { View, Icon, Text, Header, Left, Body, Right } from 'native-base';
import colors from '@constant/colors';
import fonts from '@config/fonts';
import { useNavigation } from '@react-navigation/native';

export const _Header = (props) => {
    return( 
        <Header style={styles.headerContainer} androidStatusBarColor={colors.headerBackgroundColor} >
            {props.left ? 
            <Left style={{flex: 0.2,alignItems:'center', justifyContent:'center'}}>{props.left}</Left> : <Left style={{flex: 0.2}}/>}
            <Body style={{alignItems:'center'}}>
                <Text style={styles.titleColor}>{props.title || ''}</Text>
            </Body>
            {props.right ?
            <Right style={{flex: 0.2,alignItems:'center', justifyContent:'center'}} >{ props.right }</Right> : <Right style={{flex: 0.2}} />}
        </Header>
    )
}

export const _HeaderWithBackButton = (props) => {
    const navigation = useNavigation();
    return( 
        <Header style={styles.headerContainer} androidStatusBarColor={colors.headerBackgroundColor}>
            <Left style={{flex: 0.2, alignItems:'center', justifyContent:'center'}}>
                <Icon type={'AntDesign'} name={'arrowleft'} style={{fontSize: fonts.fontSize_18, color: colors.white}} onPress={() => navigation.goBack()} />
            </Left>
            <Body style={{alignItems:'center'}}>
                <Text style={styles.titleColor}>{props.title || ''}</Text>
            </Body>
            <Right style={{flex: 0.2}} />
        </Header>
    )
}

const styles= StyleSheet.create({
    headerContainer:{
        // backgroundColor: colors.headerBackgroundColor
    },
    titleColor:{
        color : colors.white, fontSize: fonts.fontSize_16, fontWeight:'bold'
    }
})