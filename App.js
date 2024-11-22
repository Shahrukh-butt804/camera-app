  import { StatusBar } from 'expo-status-bar';
  import { StyleSheet, Text, View, Button,SafeAreaView } from 'react-native';
  import { useState, useEffect, useRef } from "react"
  import { Camera } from 'expo-camera';
  import { shareAsync } from 'expo-sharing';
  import * as MediaLibrary from "expo-media-library"

  export default function App() {

    let cameraRef = useRef();

    const [hasCameraPerm, setHasCameraPerm] = useState();
    const [hasMediaPerm, setHasMediaPerm] = useState();
    const [photo,setPhoto]=useState();


    useEffect(() => {
      (async () => {
        let camperm = await Camera.requestCameraPermissionsAsync();
        let mediaperm = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPerm(camperm.status === "granted")
        setHasMediaPerm(mediaperm.status === "granted")
      })
    }, [])

    if (hasCameraPerm === undefined) {
      return (
        <Text>Requesting Permission...</Text>
      )
    }
    else if (!hasMediaPerm) {
      return (
        <Text>Permission is not granted ... grant permission from settings</Text>
      )
    }

    let takepic = async () => {
      let options = {
        quality: 1,
        base64: true,
        exit: false
      };
      let newphoto = await cameraRef.current.takePictueAsync(options)
      setPhoto(newphoto)
    }

    if(photo){
      let sharePic = ()=>{
        shareAsync(photo.url).then(()=>{
          setPhoto(undefined)
        })
        
      }
      let savePic = ()=>{
        MediaLibrary.saveToLibraryAsync(photo.url).then(()=>{
          setPhoto(undefined)
        })
      }
      return(
        <SafeAreaView style={styles.container}>
          <Image style={styles.preview} source={{url :"data:image/jpg;base64"+ photo.base64}} />
          <Button title='share' onPress={sharePic}/>
          {
          hasMediaPerm ?< Button title='save' onPress={savePic}/>
            :undefined
          }
          <Button title='discard' onPress={()=>setPhoto(undefined)}/>
          
        </SafeAreaView>
      )
    }



    return (
      <Camera style={styles.container} ref={cameraRef}>
        <view>
          <Button style={styles.button} title='taking pic' onPress={takepic} />
        </view>
        <StatusBar style="auto" />
      </Camera>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#212121',
      alignItems: 'center',
      justifyContent: 'center',
    },
    Text: {
      color: "white",
      fontSize: "20px"
    },
    button: {
      backgroundColor: "#fff",
      alignSelf: "flex-end"

    },
    preview:{
      alignSelf:"stretch",
      flex:1
    }
  });

  // npm install --global eas-cli && eas init --id 6164c899-6ebc-4cde-be86-e89ddc223fd6