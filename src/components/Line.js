import {View} from 'react-native'
import React from 'react'
import { Colors, verticalScale } from '~/utils'

const Line = props => {
  return (
    <View style={{
      height: verticalScale(1),
      backgroundColor: Colors.antiflashWhite,
      marginVertical: verticalScale(10),
      ...props.style,
    }} />
  )
}

export default Line