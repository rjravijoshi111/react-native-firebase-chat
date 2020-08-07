import React from 'react';
import { View, Button, Text } from 'native-base';
import colors from '@constant/colors';

import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
const CacheImage = createImageProgress(FastImage);

const _CacheImage = (props) => {
  return (

    <CacheImage 
        {...props}
        imageStyle={props.style}
        indicator={Progress.Circle}
    />
  )
}

export default _CacheImage;
