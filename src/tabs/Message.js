import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

let id = '';
const Message = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    id = await AsyncStorage.getItem('USERID');
    let tempData = [];
    const email = await AsyncStorage.getItem('EMAIL');
    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(res => {
        if (res.docs != []) {
          res.docs.map(item => {
            tempData.push(item.data());
          });
        }
        setUsers(tempData);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TIN NHẮN</Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => {
                navigation.navigate('Chat', {data: item, id: id});
              }}>
              {item.hinhanh == '' ? (
                <Image
                  source={require('../images/user.png')}
                  style={styles.userIcon}
                />
              ) : (
                <Image source={{uri: item.hinhanh}} style={styles.userIcon} />
              )}
              <View style={{flexDirection: 'column', alignItems: 'start'}}>
                <Text style={styles.ten}>{item.ten}</Text>
                {item.status ? (
                  <Text style={{fontSize: 12, color: 'green'}}>
                    đang hoạt động
                  </Text>
                ) : (
                  <Text style={{fontSize: 12, color: 'gray', marginLeft: 5}}>
                    hoạt động{' '}
                    {Math.floor(
                      ((Date.now() - item.timeactive) / (1000 * 60 * 60)) * 60,
                    ) > 60
                      ? Math.floor(
                          (Date.now() - item.timeactive) / (1000 * 60 * 60),
                        ) + ' giờ trước'
                      : Math.floor(
                          ((Date.now() - item.timeactive) / (1000 * 60 * 60)) *
                            60,
                        ) + ' phút trước'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Message;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100/',
    height: 60,
    backgroundColor: '#686868',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,

    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 30,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: -10,
    marginRight: 10,
  },
  ten: {
    color: 'black',
    fontSize: 20,
  },
});
