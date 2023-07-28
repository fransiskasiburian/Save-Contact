import {StyleSheet} from 'react-native'
import {
  Colors,
  horizontalScale,
  verticalScale,
  moderateScale,
  Fonts,
  windowHeight,
} from '~/utils'

export const styles = StyleSheet.create({
  marginStyle: {
    marginTop: verticalScale(30),
    marginLeft: horizontalScale(15)
  },
  image: {
    width: horizontalScale(150),
    height: verticalScale(150),
    borderRadius: moderateScale(75),
    alignSelf: 'center',
    marginBottom: verticalScale(10)
  },
  inputContainer: {
    alignSelf: 'center',
    width: horizontalScale(390),
    height: verticalScale(45),
  },
  inputComponent: {marginTop: verticalScale(20), marginHorizontal: horizontalScale(15)},
  input: {
    fontSize: moderateScale(14),
    marginHorizontal: horizontalScale(2),
  },
  textlabel: {
    fontSize: moderateScale(14),
    color: Colors.eerieBlack,
    marginBottom: verticalScale(2),
  },
  textError: {
    color: Colors.red,
    fontSize: moderateScale(12),
  },
  star: {
    fontSize: moderateScale(14),
    color: Colors.red,
  },
  editButton: {
    borderColor: Colors.brightNavyBlue,
    backgroundColor: Colors.defaultWhite,
    borderWidth: moderateScale(1),
    elevation: 2,
  },
  containerButton: {
    marginHorizontal: horizontalScale(15),
    position: 'absolute',
    bottom: verticalScale(15),
    width: horizontalScale(390),
    justifyContent: 'center',
  }
})
