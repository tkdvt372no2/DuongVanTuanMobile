import {View, Text, StyleSheet, TextInput, Alert, Image} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'react-native-image-picker';
const Signup = () => {
  const [ten, setTen] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [nhapLaiMatKhau, setNhapLaiMatKhau] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [anhXemTruoc, setAnhXemTruoc] = useState(null);
  const navigation = useNavigation();
  const registerUser = () => {
    const userId = uuid.v4();
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        userId: userId,
        ten: ten,
        email: email,
        sodienthoai: soDienThoai,
        matkhau: matKhau,
        hinhanh: hinhAnh,
        timeactive: Date.now(),
        status: false,
        banbe: [],
      })
      .then(res => {
        console.log('đăng ký thành công');
        navigation.navigate('Login');
      })
      .catch(err => {
        console.log(err);
      });
  };
  const checkEmail = emailcheck => {
    let check = false;
    firestore()
      .collection('users')
      .where('email', '==', emailcheck)
      .get()
      .then(res => {
        if (res.docs == []) {
          check = true;
        }
      });
      return check;
  };
  const validate = () => {
    const check = {
      isValid: true,
      msg: '',
    };
    if (matKhau !== nhapLaiMatKhau) {
      check.isValid = false;
      check.msg = 'Nhập lại mật khẩu không khớp!';
    }
    if (nhapLaiMatKhau === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập lại mật khẩu!';
    }
    if (matKhau === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập mật khẩu!';
    }
    if (soDienThoai === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập số điện thoại!';
    }
    if (email === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập email !';
    }
    if(!checkEmail(email)){
      check.msg = 'Email đã được đăng ký'
    }
    if (ten === '') {
      check.isValid = false;
      check.msg = 'Vui lòng nhập tên !';
    }
    return check;
  };
  const handleUpdata = photo => {
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'dvtchat');
    data.append('cloud_name', 'df6xlriko');
    fetch('https://api.cloudinary.com/v1_1/df6xlriko/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(data => {
        setHinhAnh(data.url);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const _uploadImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: '/storage/emulated/0/Pictures',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response=', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error', response.error);
      } else {
        const res = response.assets[0];
        const uri = res.uri;
        const type = 'image/jpg';
        const name = res.fileName;
        const source = {uri, type, name};
        setAnhXemTruoc(source);
        handleUpdata(source);
      }
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      {anhXemTruoc === null ? (
        <Image
          source={require('../images/user.png')}
          style={styles.hienThiHinhAnh}
        />
      ) : (
        <Image source={anhXemTruoc} style={styles.hienThiHinhAnh} />
      )}
      <TouchableOpacity style={styles.btnImage} onPress={_uploadImage}>
        <Text style={styles.btnDangKy}>Chọn ảnh</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nhập tên của bạn..."
        style={[styles.input, {marginTop: 50}]}
        value={ten}
        onChangeText={e => setTen(e)}
      />
      <TextInput
        placeholder="Nhập email của bạn..."
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={e => setEmail(e)}
      />
      <TextInput
        placeholder="Nhập số điện thoại..."
        keyboardType="number-pad"
        style={styles.input}
        value={soDienThoai}
        onChangeText={e => setSoDienThoai(e)}
      />
      <TextInput
        placeholder="Nhập mật khẩu..."
        style={styles.input}
        secureTextEntry
        value={matKhau}
        onChangeText={e => setMatKhau(e)}
      />
      <TextInput
        placeholder="Nhập lại mật khẩu..."
        style={styles.input}
        secureTextEntry
        value={nhapLaiMatKhau}
        onChangeText={e => setNhapLaiMatKhau(e)}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          let valid = validate();
          if (valid.isValid) {
            registerUser();
          } else {
            Alert.alert(valid.msg);
          }
        }}>
        <Text style={styles.btnDangKy}>Đăng ký</Text>
      </TouchableOpacity>
      <Text
        style={styles.hoacDangNhap}
        onPress={() => {
          navigation.goBack();
        }}>
        hoặc đăng nhập
      </Text>
    </View>
  );
};

export default Signup;
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
  chonanh: {
    margin: 6,
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
