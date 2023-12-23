import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {List} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
const HoSo = () => {
  const [userData, setUserData] = useState(null);
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
              setUserData(item.data());
            });
          }
        });
    };
    getUser();
  }, [userData]);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }
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
        setUserData(prevData => ({
          ...prevData,
          hinhanh: data.url,
        }));
        firestore().collection('users').doc(id).update({hinhanh: data.url});
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
        handleUpdata(source);
      }
    });
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>HỒ SƠ</Text>
      </View>
      {userData.hinhanh === '' ? (
        <Image source={require('../images/user.png')} style={styles.avatar} />
      ) : (
        <Image style={styles.avatar} source={{uri: userData.hinhanh}} />
      )}
      <TouchableOpacity style={styles.btnImage} onPress={_uploadImage}>
        <Text style={styles.btnDangKy}>Chọn ảnh</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <List.Item
          title="Họ và tên"
          description={userData.ten}
          left={props => <List.Icon {...props} icon="information" />}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <List.Item
          title="Email"
          description={userData.email}
          left={props => <List.Icon {...props} icon="email-check" />}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <List.Item
          title="Số điện thoại"
          description={userData.sodienthoai}
          left={props => <List.Icon {...props} icon="cellphone" />}
        />
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={[styles.btnDangKy,{color:'white'}]}>Huỷ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'start',
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
  btn: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'start',
    marginTop: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
  },
  edit: {
    color: 'white',
  },
  avatar: {
    marginTop:30,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderColor: 'yellow',
    alignSelf: 'center',
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnImage: {
    width: '30%',
    height: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  btnDangKy: {
    color: 'gray',
    fontSize: 20,
  },
});

export default HoSo;
