import {View, Text, Image} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const time = Date.now() - route.params.data.timeactive;
  const gio =
    Math.floor(time / (1000 * 60 * 60)) == 0
      ? (Math.floor(time / (1000 * 60 * 60)) + 1)
      : (Math.floor(time / (1000 * 60 * 60)));
  const phut = Math.floor((time / (1000 * 60 * 60)) * 60);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {route.params.data.hinhanh == '' ? (
              <Image
                source={require('../images/user.png')}
                style={{width: 30, height: 30, marginRight: 10}}
              />
            ) : (
              <Image
                source={{uri: route.params.data.hinhanh}}
                style={{width: 30, height: 30, marginRight: 10}}
              />
            )}
            <View style={{flexDirection: 'column', alignItems: 'start'}}>
              <Text style={{fontSize: 18}}>{route.params.data.ten}</Text>
              {route.params.data.status ? (
                <Text style={{fontSize: 12, color: 'green'}}>
                  đang hoạt động
                </Text>
              ) : (
                <Text style={{fontSize: 12, color: 'gray'}}>
                  hoạt động{' '}
                  {phut > 60 ? gio + ' giờ trước' : phut + ' phút trước'}
                </Text>
              )}
            </View>
          </View>
        ),
        headerStyle: {
          height: 50,
        },
      });
    }, [navigation]),
  );
  useEffect(() => {
    const subcriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subcriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessages(allmessages);
    });
    return () => subcriber;
  }, []);
  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, []);
  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
      />
    </View>
  );
};

export default Chat;
