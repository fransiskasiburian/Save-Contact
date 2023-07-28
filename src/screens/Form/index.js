import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {Creators as ContactCreator} from '~/store/ducks'
import {
  Button,
  FocusedStatusBar,
  Input,
  MainContainer,
  ModalAddEdit,
  ModalConfirmation,
} from '~/components'
import {
  Colors,
  ROUTE_NAMES,
  imageDefaultUrl,
  isValidHttpUrl,
  moderateScale,
  verticalScale,
} from '~/utils'
import {styles} from './styles'

const FormContact = ({navigation, route}) => {
  const contactAction = bindActionCreators(ContactCreator, useDispatch())
  const storeContact = useSelector(state => state.ducks)

  const firstName = useRef()
  const lastName = useRef()
  const age = useRef()
  const photoLink = useRef()

  const [linkPhoto, setLinkPhoto] = useState('')
  const [keyboard, setKeyboard] = useState(Boolean)
  const [errorValid, setErrorValid] = useState({
    firstName: false,
    lastName: false,
    age: false,
    photo: false,
  })

  const onErrorImage = () => {
    setLinkPhoto(imageDefaultUrl)
  }

  const checkValidate = () => {
    const isValid =
      firstName?.current?.getKeyword()?.trim().length >= 3 &&
      lastName?.current?.getKeyword()?.length >= 3 &&
      age?.current?.getKeyword()?.length > 0 &&
      age?.current?.getKeyword()?.trim() != 0

    const isValidImageUrl =
      photoLink?.current?.getKeyword()?.trim() !== ''
        ? isValidHttpUrl(linkPhoto)
          ? true
          : false
        : true

    if (isValid && isValidImageUrl) {
      setErrorValid({
        firstName: false,
        lastName: false,
        age: false,
      })

      const body = {
        firstName: firstName?.current?.getKeyword()?.trim(),
        lastName: lastName?.current?.getKeyword(),
        age: age?.current?.getKeyword()?.trim(),
        photo: isValidHttpUrl(linkPhoto) ? linkPhoto : imageDefaultUrl,
      }

      if (route?.params?.editData) {
        contactAction.updateContactRequest({id: route?.params?.id, body})
      } else {
        contactAction.addContactRequest(body)
      }
    } else {
      setErrorValid({
        firstName: firstName?.current?.getKeyword()?.trim().length < 3,
        lastName: lastName?.current?.getKeyword()?.length < 3,
        age:
          age?.current?.getKeyword()?.length == 0 ||
          age?.current?.getKeyword()?.trim() == 0,
        photo:
          photoLink?.current?.getKeyword()?.trim() !== '' &&
          !isValidHttpUrl(linkPhoto),
      })
    }
  }

  useEffect(() => {
    if (route?.params) {
      setErrorValid({
        firstName: false,
        lastName: false,
        age: false,
        photo: false,
      })
      setLinkPhoto('')

      if (route?.params?.editData) {
        firstName.current?.setKeyword(
          route?.params?.editData?.firstName
            ? route?.params?.editData?.firstName.toString()
            : '',
        )
        lastName.current?.setKeyword(
          route?.params?.editData?.lastName
            ? route?.params?.editData?.lastName.toString()
            : '',
        )
        age.current?.setKeyword(
          route?.params?.editData?.age
            ? route?.params?.editData?.age.toString()
            : '',
        )
        photoLink.current?.setKeyword(
          route?.params?.editData?.photo
            ? route?.params?.editData?.photo.toString()
            : '',
        )
        setLinkPhoto(
          route?.params?.editData?.photo
            ? route?.params?.editData?.photo.toString()
            : '',
        )
      } else {
        firstName.current?.setKeyword('')
        lastName.current?.setKeyword('')
        age.current?.setKeyword('')
        photoLink.current?.setKeyword('')
        setLinkPhoto('')
      }
    }
  }, [route?.params])

  useEffect(() => {
    if (
      storeContact.successAdd ||
      storeContact.successUpdate ||
      storeContact.errorAdd ||
      storeContact.errorUpdate
    ) {
      setTimeout(() => contactAction.clearStatus(), 200)

      if (storeContact.successUpdate) {
        navigation.navigate(ROUTE_NAMES.DETAIL_CONTACT, {
          id: route?.params?.editData?.id,
        })
      } else if (storeContact.successAdd) {
        navigation.navigate(ROUTE_NAMES.LIST)
      }
    }
  }, [
    storeContact.successUpdate,
    storeContact.errorUpdate,
    storeContact.successAdd,
    storeContact.errorAdd,
  ])

  const onBack = () => {
    if (route?.params?.editData) {
      navigation.navigate(ROUTE_NAMES.DETAIL_CONTACT, {
        id: route?.params?.editData?.id,
      })
    } else {
      navigation.navigate(ROUTE_NAMES.LIST)
    }
  }

  function handleBackButtonClick () {
    onBack()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      )
    }
  }, [])

  useEffect(() => {
    const keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    )
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    )

    return () => {
      keyboardDidShowSubscription?.remove()
      keyboardDidHideSubscription?.remove()
    }
  }, [])

  const _keyboardDidShow = () => {
    setKeyboard(true)
  }

  const _keyboardDidHide = () => {
    setKeyboard(false)
  }

  return (
    <MainContainer>
      <FocusedStatusBar
        translucent
        backgroundColor={Colors.defaultWhite}
        barStyle='dark-content'
      />
      <Icon
        name='chevron-back-outline'
        size={verticalScale(25)}
        color={Colors.defaultBlack}
        style={styles.marginStyle}
        onPress={() => onBack()}
      />
      <Image
        style={styles.image}
        resizeMode='contain'
        source={{
          uri:
            linkPhoto !== '' && isValidHttpUrl(linkPhoto)
              ? linkPhoto
              : imageDefaultUrl,
        }}
        onError={() => onErrorImage()}
      />
      <View style={styles.inputComponent}>
        <Text style={styles.textlabel}>
          First Name<Text style={styles.star}>*</Text>
        </Text>
        <Input
          ref={firstName}
          placeholder={'Type your first name'}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />
        {errorValid.firstName && (
          <Text style={styles.textError}>
            First name can not be empty or less than 3 characters
          </Text>
        )}
      </View>

      <View style={styles.inputComponent}>
        <Text style={styles.textlabel}>
          Last Name<Text style={styles.star}>*</Text>
        </Text>
        <Input
          ref={lastName}
          placeholder={'Type your last name'}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />
        {errorValid.lastName && (
          <Text style={styles.textError}>
            Last name can not be empty or less than 3 characters
          </Text>
        )}
      </View>

      <View style={styles.inputComponent}>
        <Text style={styles.textlabel}>
          Age<Text style={styles.star}>*</Text>
        </Text>
        <Input
          ref={age}
          placeholder={'Type your age'}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          keyboardType={'number-pad'}
        />
        {errorValid.age && (
          <Text style={styles.textError}>Age can not be empty or 0</Text>
        )}
      </View>

      <View style={styles.inputComponent}>
        <Text style={styles.textlabel}>Image URL</Text>
        <Input
          ref={photoLink}
          placeholder={
            'Type your image URL (should be with http:// or https://)'
          }
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          onEndEditing={() => setLinkPhoto(photoLink?.current?.getKeyword())}
        />
        {errorValid.photo && (
          <Text style={styles.textError}>
            Image URL should be with http:// or https://
          </Text>
        )}
      </View>

      {!keyboard && (
      <View style={styles.containerButton}>
        <Button
          title={route?.params?.editData ? 'Edit Contact' : 'Add Contact'}
          onPress={() => checkValidate()}
          loading={storeContact?.loadingAdd || storeContact?.loadingUpdate}
          buttonStyle={route?.params?.editData && styles.editButton}
          titleStyle={route?.params?.editData && {color: Colors.brightNavyBlue}}
        />
      </View>
      )}
    </MainContainer>
  )
}

export default FormContact
