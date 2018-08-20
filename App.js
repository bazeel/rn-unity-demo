/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import base from './base';

import Button from './btn';
import UnityView, { UnityViewMessageEventData, MessageHandler } from 'react-native-unity-view';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

type State = {
  clickCount: number;
  renderUnity: boolean;
  unityPaused: boolean;
};

export default class App extends React.Component {

  unity: UnityView;

  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      renderUnity: false,
      unityPaused: false
    }
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
    console.log('logger');
    const message = JSON.stringify({
      type: "toggle_logger",
      data: {
        "activate" : true
      },
    });
    console.log('logger', message);
    this.unity && this.unity.postMessage('UnityMessageManager', 'ReceiveMessage', message);
  }

  onUnityMessage(hander: MessageHandler) {
    this.setState({ clickCount: this.state.clickCount + 1 });
    setTimeout(() => {
      hander.send('I am click callback!');
    }, 2000);
  }

  render() {
    const { renderUnity, unityPaused, clickCount } = this.state;

    return (
      <View style={[styles.container]}>
        { renderUnity &&
          <UnityView
            ref={(ref) => this.unity = ref}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            onUnityMessage={this.onUnityMessage.bind(this)}
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
        <Button label="Toggle Unity" style={styles.button} onPress={this.onToggleUnity.bind(this)} />
        {renderUnity ? <Button label="LOAD BASE64" style={styles.button} onPress={this.loadBase64} /> : null}
        {renderUnity ? <Button label="LOGGER" style={styles.button} onPress={this.toggleLogger} /> : null}
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