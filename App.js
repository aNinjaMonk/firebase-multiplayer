/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;
import firebase from 'react-native-firebase';
import Pusher from 'pusher-js/react-native';
const SPEED = 5;
const NUM_PLAYERS = 2;

export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state= {
      players: [],
      playerId: null
    }
    //this.spawnPlayer();
    //this.destroyPlayer();
    //this.login();

    //this.renderPlayers();
  }
  componentWillMount(){
    this.fetchPlayers();
  }
  componentWillUnmount(){
    //
    this.destroyPlayer();
  }
  initialize(){
    var config = {
      apiKey: "AIzaSyAtkD6Jig1pDKUlrfv7p5e419hRZV9AVRA",
      authDomain: "makerazza-f1e33.firebaseapp.com",
      databaseURL: "https://makerazza-f1e33.firebaseio.com",
      projectId: "makerazza-f1e33",
      storageBucket: "makerazza-f1e33.appspot.com",
      messagingSenderId: "127564653464"
    };
    firebase.initializeApp(config);
  }
  async signup(){
    try {
      await firebase.auth().createUserWithEmailAndPassword("afreesoulalive@icloud.com","fundoo0123");

        console.log('Account created');
      }
      catch(error){
        console.log('Error'+ error);
      }
  }
  async login(){
    await firebase.auth().
        signInWithEmailAndPassword("afreesoulalive@icloud.com","fundoo0123");
    alert(JSON.stringify(firebase.auth().currentUser));
  }
  async logout(){
    await firebase.auth().signOut();
    console.log("Logged Out");
  }
  spawnPlayer(){

    if(this.state.players.length < NUM_PLAYERS){

      if(!this.state.playerId){

        var player = {
            name: "Player" + Math.floor(Math.random() * 10),
            position: {
              x: 50,
              y: 50
            }
        }



        firebase.database().ref("players").push(player,()=> {

        });

      }
      else{
        alert('Already in the Game');
      }
    }
    else{
      alert('Already max Players');
    }
  }
  destroyPlayer(){
    if(this.state.playerId){
        firebase.database().ref("players").child(this.state.playerId).remove();
        this.setState({
          playerId: null
        })
    }
    else{
      alert('Already out of game');
    }
  }
  fetchPlayers(){
    firebase.database().ref().child('players').on('value',(snapshot) => {
        var data = snapshot.val();

        var players = [];
        for(var player in data){
          players.push(data[player]);
        }

        this.setState({
          players: players
        });

    });

    firebase.database().ref().child('players').on('child_added',(snapshot) => {
      this.setState({
        playerId: snapshot.key
      });
    });
  }
  renderPlayers(){
    var renderPlayers = {};

    for(var player in this.state.players){
      renderPlayers = <Image
        source={require('./Images/marker.png')}
        style={{ position:"absolute",
          top: this.state.players[player].position.x,
          left: this.state.players[player].position.y}}
      />;
    }
    return renderPlayers;
  }
  movePlayer(direction){
    if(this.state.playerId){
      var newPosition = {
        x: this.state.players[0].position.x + direction * SPEED,
        y: this.state.players[0].position.y + direction * SPEED
      };

      //console.log(this.state.players);

      firebase.database().ref("players")
        .child(this.state.playerId).child("position").set(newPosition);
    }
    else{
      alert('Please join game');
    }
  }
  render() {
    return (
      <View style={styles.container}>
          <Text style={{position:"absolute",right: 20, top: 10}}>
            Current Players : {this.state.players.length}
          </Text>
          <Text style={{position:"absolute",right: 20, top: 30}}>
            My Id : {this.state.playerId}
          </Text>

          {
            this.state.playerId ? <Image
              source={require('./Images/marker.png')}
              style={{ position:"absolute",
              top: this.state.players[0].position.x,
              left: this.state.players[0].position.y }}
            /> : null
          }

        <View style={{flex: 1,flexDirection: 'row',position:"absolute",bottom:50}}>
          <View style={{flex:0.5}}>
            <Button title="Join Game" color="#0000ff" onPress={this.spawnPlayer.bind(this)}/>
          </View>
          <View style={{flex:0.5}}>
            <Button title="Leave Game" color="#0000ff" onPress={this.destroyPlayer.bind(this)}/>
          </View>
        </View>
        <View style={{flex: 1,flexDirection: 'row',position:"absolute",bottom:10}}>
          <View style={{flex:0.5}}>
            <Button title="Move Left" color="#0000ff" onPress={this.movePlayer.bind(this,-1)}/>
          </View>
          <View style={{flex:0.5}}>
              <Button title="Move Right" color="#0000ff" onPress={this.movePlayer.bind(this,1)}/>
          </View>
        </View>
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
