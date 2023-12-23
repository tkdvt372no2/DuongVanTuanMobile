import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const Setting = () => {
  const [userId, setUserId] = useState('');
  const [hinhanh, setHinhAnh] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const getUser = async () => {
      const email = await AsyncStorage.getItem('EMAIL');
      firestore()
        .collection('users')
        .where('email', '==', email)
        .get()
        .then(res => {
          if (res.docs !== []) {
            data = res.docs[0].data();
            setHinhAnh(data.hinhanh);
            setUserId(data.userId);
          } else {
            navigation.navigate('Login');
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('TEN');
    await AsyncStorage.removeItem('EMAIL');
    await AsyncStorage.removeItem('USERID');
    navigation.navigate('Login');
    firestore()
      .collection('users')
      .doc(userId)
      .update({timeactive: Date.now(), status: false});
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CÀI ĐẶT</Text>
      </View>
      {hinhanh !== '' ? (
        <Image source={{uri: hinhanh}} style={styles.hienThiHinhAnh} />
      ) : (
        <Image
          source={require('../images/user.png')}
          style={styles.hienThiHinhAnh}
        />
      )}
      <TouchableOpacity
        style={[styles.btnSetting, {marginBottom: 35}]}
        onPress={() => {
          navigation.navigate('HoSo');
        }}>
        <Text style={styles.btnMenu}>Hồ sơ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btnSetting, {marginTop: -10, marginBottom: 35}]}
        onPress={() => {
          navigation.navigate('ChinhSuaHoSo');
        }}>
        <Text style={styles.btnMenu}>Sửa thông tin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btnSetting, {marginTop: -10}]}
        onPress={() => {
          navigation.navigate('DoiMatKhau');
        }}>
        <Text style={styles.btnMenu}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity style={styles.btn} onPress={() => logout()}>
          <Text style={styles.btnDangXuat}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  btn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#686868',
  },
  btnSetting: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fed766',
  },
  btnDangXuat: {
    color: 'white',
    fontSize: 20,
  },
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
  btnMenu: {
    color: 'black',
    fontSize: 20,
  },
  hienThiHinhAnh: {
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
});
export default Setting;
