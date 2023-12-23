import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import Messages from '../tabs/Message';
import Setting from '../tabs/Setting';
import Friend from '../tabs/Friend';
const Main = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Messages />;
      case 1:
        return <Friend />;
      case 2:
        return <Setting />;
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      {renderTabContent()}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(0)}>
          <Image
            source={require('../images/message.png')}
            style={[
              styles.iconTab,
              {tintColor: selectedTab == 0 ? '#fed766' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(1)}>
          <Image
            source={require('../images/users.png')}
            style={[
              styles.iconTab,
              {tintColor: selectedTab == 1 ? '#fed766' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(2)}>
          <Image
            source={require('../images/setting.png')}
            style={[
              styles.iconTab,
              {tintColor: selectedTab == 2 ? '#fed766' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default Main;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#686868',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tab: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTab: {
    height: 30,
    width: 30,
  },
});
