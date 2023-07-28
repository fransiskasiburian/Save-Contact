import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {Creators as ContactCreator} from '~/store/ducks'
import {
  FloatingButton,
  FocusedStatusBar,
  Input,
  Line,
  MainContainer,
} from '~/components'
import {
  Colors,
  ROUTE_NAMES,
  imageDefaultUrl,
  isValidHttpUrl,
  moderateScale,
  verticalScale,
} from '~/utils'
import {styles} from './style'

const List = ({navigation}) => {
  const keywordSearch = useRef()

  const contactAction = bindActionCreators(ContactCreator, useDispatch())
  const storeContact = useSelector(state => state.ducks)

  const [searchActive, setSearchActive] = useState(false)
  const [searchData, setSearchData] = useState([])

  useEffect(() => {
    contactAction.getListRequest()
  }, [])

  const renderItem = useCallback(({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        if (item.type == 'name') {
          if (searchActive) {
            keywordSearch?.current?.setKeyword('')
            setSearchActive(false)
            setSearchData(storeContact?.list?.finalData)
          }
          navigation.navigate(ROUTE_NAMES.DETAIL_CONTACT, {id: item.personId})
        }
      }}>
      <View style={item.type == 'name' ? styles.item : styles.head}>
        {(item.type != 'name' && index !== 0) && <Line />}
        <View style={styles.row}>
          {item.type == 'name' && (
            <Image
              style={styles.image}
              resizeMode='contain'
              source={{
                uri: isValidHttpUrl(item.imageUrl)
                  ? item.imageUrl
                  : imageDefaultUrl,
              }}
            />
          )}
          <View style={styles.column}>
            <Text style={item.type == 'name' ? styles.itemTxt : styles.headTxt}>
              {item.name}
            </Text>
            {item.type == 'name' && <Text>{`Age: ${item.age || '-'}`}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ))

  const onSearch = (keyword = '') => {
    if (keyword.trim() !== '') {
      let dataSearch = [...storeContact?.list?.finalData]
      let dataFilter = dataSearch.filter(item => {
        return (
          item['name']?.toLowerCase().includes(keyword.toLowerCase()) ||
          item['age']?.toString().toLowerCase().includes(keyword.toLowerCase())
        )
      })

      setSearchData(dataFilter)
    } else {
      setSearchData(storeContact?.list?.finalData)
    }
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Save Contact</Text>
      <Icon
        size={moderateScale(25)}
        name={'search-outline'}
        color={Colors.defaultWhite}
        onPress={() => {
          if (searchActive) {
            keywordSearch?.current?.setKeyword('')
            setSearchActive(false)
          } else {
            setSearchActive(true)
            setSearchData(storeContact?.list?.finalData)
          }
        }}
      />
    </View>
  )

  return (
    <MainContainer>
      <FocusedStatusBar
        translucent
        backgroundColor={Colors.brightNavyBlue}
        barStyle='light-content'
      />
      <ListHeader />
      {searchActive && (
        <Input
          containerStyle={styles.inputContainer}
          ref={keywordSearch}
          placeholder={'Search by name or age'}
          onSubmitEditing={() => onSearch(keywordSearch.current?.getKeyword())}
        />
      )}
      {storeContact.loadingList ? (
        <ActivityIndicator style={{marginTop: verticalScale(20)}} />
      ) : (
        <FlatList
          data={searchActive ? searchData : storeContact?.list?.finalData}
          keyExtractor={item => item.id}
          stickyHeaderIndices={storeContact?.list?.stickeyIndex}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={storeContact.loadingList}
              onRefresh={() => contactAction.getListRequest()}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchActive
                ? 'Not found.'
                : 'Your contact is empty.\nPress Add Button (+) to create new contact.'}
            </Text>
          }
        />
      )}
      <FloatingButton
        onPress={() => navigation.navigate(ROUTE_NAMES.FORM_CONTACT)}
      />
    </MainContainer>
  )
}

export default List
