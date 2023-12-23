import React, {useEffect, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
let id = '';
const Friend = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const onChangeSearch = query => {
    setSearchQuery(query);
    console.log(query);
  };
  useEffect(() => {
    getUser();
  }, [searchQuery]);
  const getUser = async () => {
    id = await AsyncStorage.getItem('USERID');
    let tempData = [];
    firestore()
      .collection('users')
      .where('sodienthoai', '==', searchQuery)
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
        <Text style={styles.title}>BẠN BÈ</Text>
      </View>
      <Searchbar
        placeholder="Nhập số điện thoại để tìm kiếm..."
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {users == null ? (
        <View style={styles.chuadangky}>Số điện thoại chưa được đăng ký</View>
      ) : (
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
                <Text style={styles.ten}>{item.ten}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};
export default Friend;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100%',
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
  chuadangky:{
    color: 'black',
    fontSize: 20,
  }
});
