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

function ModalNewRoom({ setVisible, setUpdateScreen }){
    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreate(){
      if(roomName === '') return;


      //Limite de grupos por usuario!
      firestore().collection('MESSAGE_THREADS')
      .get()
      .then((snapshot)=> {
        let myThreads = 0;

        snapshot.docs.map( docItem => {
          if(docItem.data().owner === user.uid){
            myThreads += 1;
          }
        })

       if(myThreads >= 5){
         alert('Você atingiu o limite de grupos por usuário.');
       }else{
        createRoom();
       }

      })
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
          setUpdateScreen();
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
          <Text style={styles.title}>Criar novo Grupo</Text>
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
    backgroundColor: '#fff',
    padding: 15,
},
title:{
    color: '#000',
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
},
input:{
 borderRadius: 4,
 height: 45,
 color: '#000',
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