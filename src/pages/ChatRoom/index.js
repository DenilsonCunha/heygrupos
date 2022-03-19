import React, { useState, useEffect } from 'react';
import {
  View,
   Text,
    StyleSheet,
     SafeAreaView,
      TouchableOpacity,
         Modal,
          ActivityIndicator,
           FlatList,
            Alert
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';

export default function ChatRoom() {
   const navigation = useNavigation();
   const IsFocused = useIsFocused();


   const [user, setUser] = useState(null);
   const [modalVisible, setModalVisible] = useState('false');

   const [threads, setThreads] = useState([]);
   const [loading, setLoading] = useState(true);
   const [updateScreen, setUpdateScreen] = useState(false);




   useEffect(()=>{
      const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
      console.log(hasUser);

      setUser(hasUser);


   }, [IsFocused]);

   useEffect(()=>{
     let isActive = true;

     function getChats(){
         firestore()
         .collection('MESSAGE_THREADS')
         .orderBy('lastMessage.createdAt', 'desc')
         .limit(10)
         .get()
         .then((snapshot)=>{
           const threads = snapshot.docs.map( documentsSnapshot => {
             return {
               _id: documentsSnapshot.id,
               name: '',
               lastMessage: { text: '' },
               ...documentsSnapshot.data()
             }
           })
          
           if(isActive){
            setThreads(threads);
            setLoading(false); 
            console.log(threads)
           }
           
         })
     }

     getChats();

     return () => {
       isActive = false;
     }

   }, [IsFocused, updateScreen]);


   function handleSignOut(){
     auth()
     .signOut()
     .then(()=>{
       setUser(null);
       navigation.navigate("SignIn")
     })
     .catch(()=>{
       console.log("NAO POSSUI USUARIO")
     })
   }

   function deleteRoom(ownerId, idRoom){
    //ferificar se o cara que está tentando deletar o grupo, não é dono da sala
    if( ownerId !== user?.uid) return;

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja deletar esse grupo?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "Cancel"
        },
        {
          text: "Deletar",
          onPress: () => handleDeleteRoom(idRoom)
        }
      ]
    )
   }

 async  function handleDeleteRoom(idRoom){
     await firestore()
     .collection('MESSAGE_THREADS')
     .doc(idRoom)
     .delete();

     setUpdateScreen(!updateScreen);
   }

   if(loading){
     return(
       <ActivityIndicator size="large" color="#FFF" />
     )
   }

  return (
   <SafeAreaView style={styles.container}>
     <View style={styles.headerRoom}>
       <View style={styles.headerRoomLeft}>
       { user && (
          <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons name="arrow-back" size={28} color="#FFF"/>
         </TouchableOpacity>
       )}
        <Text style={styles.title}>Gupos</Text>
       </View>
       <TouchableOpacity>
         <MaterialIcons name="search" size={28} color="#FFF"/>
       </TouchableOpacity>
     </View>

      <FlatList 
        data={threads}
        keyExtractor={ item => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={ ({ item }) => (
         <ChatList data={item} deleteRoom={ () => deleteRoom(item.owner, item._id) } />
        )}
      />

     <FabButton setVisible={ () => setModalVisible(true) } userStatus={user}/>

     <Modal visible={modalVisible} animationType="fade" transparent={true}>
      <ModalNewRoom
       setVisible={ () => setModalVisible(false) } 
       setUpdateScreen={ () => setUpdateScreen(!updateScreen) }
       />
     </Modal>

   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft:{
     flexDirection: 'row',
     alignItems: 'center',
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    paddingLeft: 10,
  }
})
