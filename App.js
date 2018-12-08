/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { ScrollView,PermissionsAndroid,TextInput,Alert,TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs'
import tts from './Tts'



export default class App extends Component {

  async requestContactsPermission() {

    try {
      //Oh it doesn't work because we haven't given camera permission on androidmanifest.xml file
      //me stupid
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'Storage Access',
          'message': 'This web audio requires you to access ' +
                     'your storage.'
        }
      
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       // console.log("You can use the storage")
      } else {
      //  console.log("Storage permission denied")
      }
    } catch (err) {
      console.log(err)
    }
    console.log(this.state.directory);
// require the module
this.state.gui = [];
var v = '';
for (let i =0; i < this.state.directory.length; i++) {
   v = v + this.state.directory[i] + '/';
}

try {
// get a list of files and directories in the main bundle
await RNFS.readDir('/storage/emulated/0/' + v) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
   // console.log('GOT RESULT', result);
   this.state.gui.push( {id : 0,position: 'absolute',top: 240,left: 0, fontSize:18, textAlign :'left',text : 'up one level', isFile : false});
    for (let i = 0; i < result.length; i++) {
      this.state.gui.push(
        {id : i+1,position: 'absolute',top: 264 +i * 24,left: 0, fontSize:18, textAlign :'left',text : result[i].name, isFile: result[i].isFile()}
     );
    }
   
  });

  if (this.state.isaFile) {


   await RNFS.readFile('/storage/emulated/0/' + v + this.state.fileName)
   .then((ss) => {
    this.setState({fileContents : ss});
    Alert.alert('Success','File loading successful');
   });
   
  
  }
  this.forceUpdate();
} catch (err) {
  //this.state.directory.splice(this.state.directory.length-1,1);
  console.log(err);
  Alert.alert('Error','Unable to load' + this.state.fileName);
}
}
  
  
  getContacts = () => {
    this.state.fileName = '';
    this.state.isaFile = false;
    this.state.directory = [];
    this.requestContactsPermission()

  }

  state = {
    var1 : 'Web Audio Project',
    var2 : 'Select a file to be played!',
    b : 0,
    email_name : 'File Name: ',
    email : '',
    data : [],
    filedirectory: '',
    gui : [],
    items : [],
    directory : [],
    fileName : '',
    isaFile : '',
    fileContents : ''
  }

  updateState= () => {
    this.state.b = 1 - this.state.b;
    if ( this.state.b == 0)
    this.setState({ var2: 'Pressed: 1.' });
    else
    this.setState({ var2: 'Pressed: 2.' });
  }
  //Play the audio
   TextToSpeech = () => {
     tts.init('Awesome', tts.SHORT)
    .then((res) => {
      console.log(res, " Success")
      tts.getMaxSpeechInputLength()
      .then((len) => {
        BUFFER_SIZE = len;
        console.log(BUFFER_SIZE)
        })
      })
    .catch((e) => {
      console.log("Error: ",e)
      })
   
     // Tts.speak(this.state.fileContents);
  }
  updateTextInput= (text) => {
    this.setState({  filedirectory : text})

  }
  play_audio = () => {
    tts.play();
  }
  updateFileDirectory = (text,id,isFile) => {
    //this.setState({copy : text})
    if (id == 0) {
      this.state.directory.splice(this.state.directory.length-1,1);
      this.state.fileName = '';
      this.state.isaFile = false;
    } else {
      this.setState({fileName : text});
      this.setState({isaFile : isFile})
  
      if (!isFile) {
      this.state.directory.push(text);
     } 
    }
        var v = '';
      for (let i =0; i < this.state.directory.length; i++) {
        v = v + this.state.directory[i] + '/';
      }
      this.state.email_name = 'File Name: /storage/emulated/0/' + v;
    this.requestContactsPermission();
 
  }
  render() {
    this.state.items = this.state.gui.map(item => {
      //For scroll view do NOT put styles
      return  <Text key = {item.id} onPress = {() => this.updateFileDirectory(item.text,item.id,item.isFile)}>{item.text}
       </Text>;
  
    });
    return (

     <View style={styles.main}>

        <Text style={styles.a}>{this.state.var1}</Text>
        <Text style={styles.welcome}>{this.state.var2}</Text>
        <Text style={styles.email_pos}>{this.state.email_name}</Text>
        <TouchableOpacity onPress={this.getContacts}    style={styles.button}>
          <Text> Browse file </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.TextToSpeech}    style={styles.button2}>
          <Text> Play text to speech file </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.play_audio}    style={{ position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    top: 124,
    left: 228,
    width: 64}}>
          <Text> Play </Text>
        </TouchableOpacity>      
     
    <ScrollView style = {styles.scroll}>
     
           {this.state.items}
    </ScrollView>

      </View>
  
    );
  }
  
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'absolute',
  },
  scroll : {
   // position: 'absolute',
    top: 168,
    left: 0,
    right: 0,
    bottom: 0,
    width: 300,
    height : 432
  },
  a: {
    position: 'absolute',
    fontSize: 24,
    textAlign: 'left',
    top: 0,
  },
  welcome: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'left',
    top: 32,

  },
  email_pos: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'left',
    top: 64,
    left: 0,
    width: 400,
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    top: 124,
    left: 0,
    width: 96
  }, 
  button2: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    top: 124,
    left: 96,
    width: 128
  },
  input: {
    position: 'absolute',
    top: 64,
    left: 96,
    width: 256,
    borderColor: '#7a42f4',
    borderWidth: 1
    },
});
