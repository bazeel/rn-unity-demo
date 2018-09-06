import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  NativeSyntheticEvent,
  Alert
} from 'react-native';
// import base from './base';

import Button from './btn';
import UnityView, { UnityViewMessageEventData, MessageHandler } from 'react-native-unity-view';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends React.Component {

  unity: UnityView;

  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      renderUnity: false,
      unityPaused: false
    }
    this.isLogger = false;
  }

  componentDidMount() {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('rgba(255,255,255,0)');
      StatusBar.setTranslucent(true);
    }
  }

  onToggleUnity() {
    this.setState({ renderUnity: !this.state.renderUnity });
  }

  onPauseAndResumeUnity() {
    if (this.state.unityPaused) {
      this.unity.resume();
    } else {
      this.unity.pause();
    }
    this.setState({ unityPaused: !this.state.unityPaused });
  }

  onToggleRotate() {
    if (this.unity) {
      this.unity.postMessageToUnityManager({
        name: 'ToggleRotate',
        data: '',
        callBack: (data) => {
          Alert.alert('Tip', JSON.stringify(data))
        }
      });
    }
  }

  loadBase64 = () => {
    this.unity && this.unity.postMessageToUnityManager(base);
  }

  toggleLogger = () => {
    this.isLogger = !this.isLogger;
    const message = JSON.stringify({
      type: "toggle_logger",
      data: {
        "activate" : this.isLogger,
      },
    });
    console.log('logger', message);
    this.unity && this.unity.postMessage('UnityMessageManager', 'ReceiveMessage', message);
  }

  sendConfigs = () => {
    const message = JSON.stringify({
      type:"config",
      data: {
        api_root:"https://roundme.com",
        image_root:"https://static.roundme.com",
      }
    });
    this.unity && this.unity.postMessage('UnityMessageManager', 'ReceiveMessage', message);
  };

  onUnityMessage = (data = {}) => {
    Alert.alert('onUnityMessage', JSON.stringify(data))
    // this.setState({ clickCount: this.state.clickCount + 1 });
    // setTimeout(() => {
    //   hander.send('I am click callback!');
    // }, 2000);
  };

  onMessage = (event) => {
    const data = event && event.nativeEvent && event.nativeEvent.message
      ? JSON.stringify(event.nativeEvent.message) : 'no data';
    Alert.alert('onMessage', data);
  };

  render() {
    const { renderUnity, unityPaused, clickCount } = this.state;

    return (
      <View style={[styles.container]}>
        { renderUnity &&
          <UnityView
            ref={(ref) => this.unity = ref}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            onUnityMessage={this.onUnityMessage}
            onMessage={this.onMessage}
          />
        }
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Text style={{ color: 'black', fontSize: 15 }}>Unity Click Count: <Text style={{ color: 'red' }}>{clickCount}</Text> </Text>
        <Button label="TOGGLE UNITY" style={styles.button} onPress={this.onToggleUnity.bind(this)} />
        {renderUnity ? <Button label="TOGGLE LOGGER" style={styles.button} onPress={this.toggleLogger} /> : null}
        {renderUnity ? <Button label="SEND CONFIGS" style={styles.button} onPress={this.sendConfigs} /> : null}
        {/*renderUnity ? <Button label="LOAD BASE64" style={styles.button} onPress={this.loadBase64} /> : null */}
        {/*renderUnity ? <Button label="Toggle Rotate" style={styles.button} onPress={this.onToggleRotate.bind(this)} /> : null}
        {renderUnity ? <Button label={unityPaused ? "Resume" : "Pause"} style={styles.button} onPress={this.onPauseAndResumeUnity.bind(this)} /> : null*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
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
  button: {
    marginTop: 10
  }
});