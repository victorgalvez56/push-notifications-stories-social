/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Share from 'react-native-share';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [imagen, setImagen] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uri, setUri] = useState('');

  useEffect(() => {
    getFcmToken();
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        setImagen(remoteMessage.notification.android.imageUrl);
        setModalVisible(true);

        fetch(remoteMessage.notification.android.imageUrl)
          .then(function (response) {
            if (response.ok) {
              response.blob().then(function (miBlob) {
                convertImg(miBlob);
              });
            } else {
              console.log('Respuesta de red OK pero respuesta HTTP no OK');
            }
          })
          .catch(function (error) {
            console.log(
              'Hubo un problema con la petición Fetch:' + error.message,
            );
          });
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setImagen(remoteMessage.notification.android.imageUrl);
      setModalVisible(true);

      fetch(remoteMessage.notification.android.imageUrl)
        .then(function (response) {
          if (response.ok) {
            response.blob().then(function (miBlob) {
              convertImg(miBlob);
            });
          } else {
            console.log('Respuesta de red OK pero respuesta HTTP no OK');
          }
        })
        .catch(function (error) {
          console.log(
            'Hubo un problema con la petición Fetch:' + error.message,
          );
        });
    });
    return unsubscribe;
  }, []);

  const convertImg = async blob => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      let base64data = reader.result;

      setUri(
        base64data.replace('data:application/octet-stream;', 'data:image/png;'),
      );
    };
  };
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
    } catch (error) {
      console.log(error, 'error raied in FCMTOKEN');
    }
  };

  const onPressInstagram = () => {
    Share.shareSingle({
      social: Share.Social.INSTAGRAM,
      url: uri,
      type: 'image/*',
    });

    // Share.shareSingle(shareOptions);
  };
  const onPressFacebook = () => {
    const shareOptions = {
      backgroundImage: uri,
      backgroundBottomColor: '#fefefe',
      backgroundTopColor: '#906df4',
      social: Share.Social.FACEBOOK_STORIES,
      type: 'image/*',
      appId: '707909576475804',
    };

    Share.shareSingle(shareOptions);
  };
  return (
    <SafeAreaView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: imagen,
                }}
              />
              <View
                style={{
                  ...styles.centeredView,
                  flexDirection: 'row',
                }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={onPressFacebook}>
                  <Text style={styles.textStyle}>Facebook</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={onPressInstagram}>
                  <Text style={styles.textStyle}>Instagram</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    marginHorizontal: 15,
  },
  buttonOpen: {
    backgroundColor: '#BF3897',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  tinyLogo: {
    width: 250,
    height: 250,
  },
});

export default App;
