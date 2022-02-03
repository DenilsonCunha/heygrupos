import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';

export default function ChatRoom() {
  return (
    <View style={styles.container}>
      <Text>Tela ChatRoom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
