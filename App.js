/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import axios from 'axios'
const cheerio = require('react-native-cheerio')

import ToastExample from './ToastExample'
import tts from './Tts'

let BUFFER_SIZE = 4000;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<Props> {

  constructor(props) {
    super(props)

    this.state = {
      utteranceID: 'ttsID',
      html: '',
      htmlSlices: [],
      currentHtmlSlice: 0
    }
  }

  getMaxSpeechInputLength = () => {
    tts.getMaxSpeechInputLength()
    .then((len) => {
      BUFFER_SIZE = len
      console.log(len)
      })
  }
  initTts = () => {
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
  }
  synthesizeToFile = () => {
    let htmlSlices = this.state.htmlSlices
    let currentHtmlSlice = this.state.currentHtmlSlice

    tts.synthesizeToFile(htmlSlices[currentHtmlSlice], "tts-demo", "tts-demo")
    .then((res) => {
      console.log("App.js Synthesis successs! ", res)
      })
    .catch((e) => {
      console.log("App.js Fail: ", e)
      })
  }

  play = () => {
    tts.play()
  }
  pause = () => {
    tts.pause()
  }
  stop = () => {
    tts.stop()
  }
  speak = () => {
    let htmlSlices = this.state.htmlSlices
    let currentHtmlSlice = this.state.currentHtmlSlice
    console.log(htmlSlices[currentHtmlSlice])
    tts.speak(htmlSlices[currentHtmlSlice])
  }
  shutdown = () => {
    tts.shutdown()
  }

  onGetHTML = () => {
    console.log('in');

    axios.get('https://www.huffingtonpost.com/entry/democrats-voters-votes-2018-midterms_us_5bdcc1a5e4b01ffb1d023f12')
      .then((res) => {
        this.setState(() => ({ html: res.data }))

        console.log('Promise out')

      })
      .catch((err) => {
        console.log('Error: ', err);
      })
    console.log('Awaiting promise');
  }
  onParseHTML = () => {
    console.log('parse')

    const $ = cheerio.load(this.state.html)
    const html = $('p').text()
    this.setState(() => ({ html }))

    console.log(html)

    console.log('out')
  }

  splitHTML = () => {
    console.log('Splitting html');

    let html = this.state.html
    let htmlSlices = []

    let textSlice = ''
    let pos = BUFFER_SIZE
    while(pos <= html.length) {
      textSlice = html.substr(pos-BUFFER_SIZE, pos)
      textSlice = textSlice.substr(0, Math.min(textSlice.length, textSlice.lastIndexOf(" ")))

      console.log(textSlice)
      htmlSlices.push(textSlice)
      pos += textSlice.length
    }
    if(pos-BUFFER_SIZE < html.length) {
      htmlSlices.push(html.substr(pos-BUFFER_SIZE, html.length))
    }

    this.setState(() => ({ htmlSlices }))
    console.log('Splitting html out');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.initTts} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Init tts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.synthesizeToFile} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Synthesize</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.play} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.pause} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.stop} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getMaxSpeechInputLength} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Get len</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.speak} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Speak</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.shutdown} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Shutdown</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onGetHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Get HTML</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onParseHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Parse html</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.splitHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Split HTML</Text>
        </TouchableOpacity>

        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
