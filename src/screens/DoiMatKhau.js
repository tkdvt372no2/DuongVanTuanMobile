import {View, Text, StyleSheet, TextInput, Alert, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
let id = '';
const ChinhSuaHoSo = () => {
  const [matkhaucu, setMatKhauCu] = useState('');
  const [matkhaumoi, setMatKhauMoi] = useState('');
  const [nhaplaimatkhaumoi, setNhapLaiMatKhauMoi] = useState('');
  const [hinhanh, setHinhAnh] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const getUser = async () => {
      id = await AsyncStorage.getItem('USERID');
      const email = await AsyncStorage.getItem('EMAIL');
      firestore()
        .collection('users')
        .where('email', '==', email)
        .get()
        .then(res => {
          if (res.docs != []) {
            res.docs.map(item => {
              let data = item.data();
              setHinhAnh(data.hinhanh);
            });
          }
        });
    };
    getUser();
  }, []);
  const checkPass = pass => {
    let check = false;
    firestore()
      .collection('users')
      .where('userId', '==', id)
      .get()
      .then(res => {
        if (res.docs != []) {
          res.docs.map(item => {
            if (item.matkhau == pass) {
              check = true;
            }
          });
        }
      });
    return check;
  };
  const updateMatKhau = () => {
    firestore()
      .collection('users')
      .doc(id)
      .update({
        matkhau: matkhaumoi,
      })
      .then(res => {
        Alert.alert('cập nhật thành công');
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const validate = () => {
    const check = {
      isValid: true,
      msg: '',
    };
    if (nhaplaimatkhaumoi !== matkhaumoi) {
      check.isValid = false;
      check.msg = 'Nhập lại mật khẩu mới không khớp!';
    }
    if (nhaplaimatkhaumoi === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập lại mật khẩu mới!';
    }
    if (matkhaumoi === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập mật khẩu mới!';
    }
    if (!checkPass(matkhaucu)) {
      check.msg = 'Mật khẩu cũ không chính xác!';
    }
    if (matkhaucu === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập mật khẩu cũ!';
    }
    return check;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐỔI MẬT KHẨU</Text>
      {hinhanh !== '' ? (
        <Image source={{uri: hinhanh}} style={styles.hienThiHinhAnh} />
      ) : (
        <Image
          source={require('../images/user.png')}
          style={styles.hienThiHinhAnh}
        />
      )}
      <TextInput
        placeholder="Nhập mật khẩu cũ"
        style={[styles.input, {marginTop: 50}]}
        value={matkhaucu}
        onChangeText={e => setMatKhauCu(e)}
      />
      <TextInput
        placeholder="Nhập mật khẩu mới"
        style={[styles.input, {marginTop: 50}]}
        value={matkhaumoi}
        onChangeText={e => setMatKhauMoi(e)}
      />
      <TextInput
        placeholder="Nhập lại mật khẩu mới"
        keyboardType="number-pad"
        style={styles.input}
        value={nhaplaimatkhaumoi}
        onChangeText={e => setNhapLaiMatKhauMoi(e)}
      />
      <TouchableOpacity
        style={[styles.btn, {backgroundColor: 'yellow'}]}
        onPress={() => {
          let valid = validate();
          if (valid.isValid) {
            updateMatKhau();
          } else {
            Alert.alert(valid.msg);
          }
        }}>
        <Text
          style={[
            styles.btnDangKy,
            {backgroundColor: 'yellow', color: 'black'},
          ]}>
          Lưu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={styles.btnDangKy}>Huỷ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChinhSuaHoSo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -50,
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
  btnImage: {
    width: '40%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#686868',
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
