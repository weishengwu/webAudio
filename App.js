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
import Tts from 'react-native-tts'

const BUFFER_SIZE = 3500

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
      speechRate: 0.5,
      speechPitch: 1,
      html: '',
      htmlSlices: [],
      currentHtmlSlice: 0
    }
  }

  setSpeechRate = async rate => {
    await Tts.setDefaultRate(rate)
    this.setState({ speachRate: rate})
  }
  setSpeechPitch = async pitch => {
    await Tts.setDefaultPitch(pitch)
    this.setState({ speechPitch: pitch })
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

      htmlSlices.push(textSlice)
      pos += textSlice.length
    }
    if(pos-BUFFER_SIZE < html.length) {
      htmlSlices.push(html.substr(pos-BUFFER_SIZE, html.length))
    }

    this.setState(() => ({ htmlSlices }))
    console.log('Splitting html out');
  }



  onText2Speech = () => {
    console.log('Text to speech1');

    let htmlSlices = this.state.htmlSlices
    let currentHtmlSlice = this.state.currentHtmlSlice

    Tts.speak('Hello, hi');

    // Tts.getInitStatus().then(() => {
    //   console.log('init');
    // });

    Tts.speak(htmlSlices[currentHtmlSlice])
    // let words = htmlSlices[currentHtmlSlice].split(' ')
    // words = words.map(w => w.trim())
    // words.forEach((e) => {Tts.speak(e)})

    console.log('Awaiting speaking')
  }

  onStopReading = () => {
    console.log('Stop reading')
    Tts.stop()

    console.log('Stop reading out')
  }
  onResumeReading = () => {
    console.log('Resume reading')

    console.log('Resume reading out')
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={this.onGetHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Get HTML</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onParseHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Parse html</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.splitHTML} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Spllit HTML</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onText2Speech} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Text to Speech</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onStopReading} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Stop Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onResumeReading} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Resume Reading</Text>
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
