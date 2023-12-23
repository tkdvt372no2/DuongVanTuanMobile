import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [visible, setVisible] = useState(false);
  const login = () => {
    setVisible(true);
    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(res => {
        setVisible(false);
        if (res.docs !== []) {
          data = res.docs[0].data();
          
          goToNext(data.ten, data.email, data.userId);
        } else {
          Alert.alert('Tài khoản không tồn tại');
        }
      })
      .catch(err => {
        setVisible(false);
        console.log(err);
        Alert.alert('Tài khoản không tồn tại');
      });
  };
  const goToNext = async (ten, email, userId) => {
    
    await AsyncStorage.setItem('TEN', ten);
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', userId);
    navigation.navigate("Main");
    firestore().collection("users").doc(userId).update({status: true});
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        placeholder="Nhập email của bạn..."
        keyboardType="email-address"
        style={[styles.input, {marginTop: 100}]}
        value={email}
        onChangeText={e => setEmail(e)}
      />

      <TextInput
        placeholder="Nhập mật khẩu..."
        style={styles.input}
        secureTextEntry
        value={matKhau}
        onChangeText={e => setMatKhau(e)}
      />

      <TouchableOpacity style={styles.btn} onPress={() => login()}>
        <Text style={styles.btnDangKy}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text
        style={styles.hoacDangNhap}
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        hoặc đăng ký
      </Text>
      <Loader visible={visible} />
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
    marginTop: 100,
    fontWeight: '600',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    paddingLeft: 20,
  },
  btn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#686868',
  },
  btnDangKy: {
    color: 'white',
    fontSize: 20,
  },
  hoacDangNhap: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 20,
    fontWeight: '500',
    textDecorationLine: 'underline',
    color: 'black',
  },
});
