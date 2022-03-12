import React, { useState }from 'react';
import { 
    View,
     Text,
      StyleSheet,
       TextInput,
        TouchableOpacity,
         TouchableWithoutFeedback 
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function ModalNewRoom({ setVisible }){
    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreate(){
      if(roomName === '') return;

      createRoom();
    }
    //criar nova sala no firestore (banco do firebase)
    function createRoom(){
      firestore()
      .collection('MESSAGE_THREADS')
      .add({
          name: roomName,
          owner: user.uid,
          lastMessage:{
              text: `Grupo ${roomName} criado. Bem Vindo(a)!`,
              createdAt: firestore.FieldValue.serverTimestamp(),
          }
      })
      .then((docRef)=>{
        docRef.collection('MESSAGES').add({
            text: `Gupos ${roomName} criado. Bem Vindo(a)!`,
            createdAt: firestore.FieldValue.serverTimestamp(),
            system: true,
        })
        .then(()=>{
          setVisible();
        })

      })
      .catch((err)=>{
        console.log(err);
      })
    }

    return(
      <View style={styles.container}>
          <TouchableWithoutFeedback onPress={setVisible}>
          <View style={styles.modal}></View>
          </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <Text style={styles.title}>Criar um novo Grupo</Text>
          <TextInput
            value={roomName}
            onChangeText={ (text) => setRoomName(text) }
            placeholder="Nome para sua sala"
            style={styles.input}
          />

          <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
              <Text style={styles.buttonText}>Criar sala</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

export default ModalNewRoom;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
},
modal:{
    flex: 1,
},
modalContent:{
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
},
title:{
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
},
input:{
 borderRadius: 4,
 height: 45,
 backgroundColor: 'rgba(34, 34, 34, 0.4)',
 marginVertical: 15,
 fontSize: 16,
 paddingHorizontal: 5,
},
buttonCreate:{
    borderRadius: 4,
    backgroundColor: '#2E54D4',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonText:{
    fontSize: 19,
    fontWeight: 'bold',
}
})