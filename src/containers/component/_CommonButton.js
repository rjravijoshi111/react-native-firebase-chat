import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, Button, Text } from 'native-base';
import colors from '@constant/colors';
import fonts from '@config/fonts';
import imageAssets from '@config/images';

const _CommonButton = (props) => {
    return (
        <TouchableOpacity
            {...props}
            onPress={props.onPress}
            disabled={props.disabled || false}
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                // flexDirection: 'row',
                height: props.height || 45,
                backgroundColor: props.bgColor || colors.primaryColor,
                borderRadius: (props.radius || 22.5),
                elevation: 0,
                paddingVertical: 0,
                // width: 170,
                ...props.style,
            }}
        >
            <Text
                uppercase={false}
                style={{
                    textAlign: "center",
                    color: props.color || colors.white,
                    fontSize: props.fontSize || fonts.fontSize_13,
                    // paddingLeft: 10,
                    fontFamily: props.fontWeight || fonts.fontFamily_medium,
                }}
            >{props.buttonText}
            </Text>
        </TouchableOpacity>
    )
}

export default _CommonButton;