/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Container, Header, Badge, Button, InputGroup, Input, Content, Card, CardItem, Text, Spinner, Icon } from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

class FoodComponent extends Component {

  render() {
    var x = this.props.Food;
    return (
      <Text>
        <Text>
          {Object.keys(this.props.Food).map(function(key){
            return <Text style={{fontFamily: 'Futura'}}>{x[key]}</Text>;
          })}
        </Text>
        <Text>
        {"\n"}
        </Text>
      </Text>
    );
  }
}

export default class fridgeProject extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  searchClick(){

  }
  render() {
    var input = this.state.text;
    var exampleJson = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Adding apples. "
      },
      "shouldEndSession": true
    },
    "sessionAttributes": {
      "currentItems": {
        "food": {
          "milk": {
            "amount": 4,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "milks": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apple": {
            "amount": 1,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples1": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples2": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples3": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples4": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples5": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples6": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples7": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples8": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          },
          "apples9": {
            "amount": 2,
            "pound": 0,
            "ounce": 0,
            "gram": 0
          }
        },
        "drinks": {}
      }
    }
  }
    var parsedJson = JSON.parse(JSON.stringify(exampleJson));
    var biglist = []
    for (var i in parsedJson.sessionAttributes.currentItems.food){
       var list = [];
       if(i.includes(this.state.text.toLowerCase())){
        list.push(i);
        if(parsedJson.sessionAttributes.currentItems.food[i].amount > 0){
          list.push(" amount: ");
          list.push(parsedJson.sessionAttributes.currentItems.food[i].amount);
        }
        if(parsedJson.sessionAttributes.currentItems.food[i].pound > 0){
          list.push(" pound: ");
          list.push(parsedJson.sessionAttributes.currentItems.food[i].pound);
        }
        if(parsedJson.sessionAttributes.currentItems.food[i].ounce > 0){
          list.push(" ounce: ");
          list.push(parsedJson.sessionAttributes.currentItems.food[i].ounce);
        }
        if(parsedJson.sessionAttributes.currentItems.food[i].gram > 0){
          list.push(" gram: ");
          list.push(parsedJson.sessionAttributes.currentItems.food[i].gram);
        }
        biglist.push(list);
      }
    }
    return (
      <Container>
          <Header searchBar rounded>
              <InputGroup>
                  <Input placeholder="Search" onChangeText={(text) => this.setState({text})} />
              </InputGroup>
          </Header>
          <Content scrollEventThrottle={60} >
            <Card style={{marginRight: 10, marginLeft: 10, marginTop: 25}}>
              {Object.keys(biglist).map(function(key){
                return <CardItem><FoodComponent Food={biglist[key]}/></CardItem>;
              })}
           </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  foodContainer: {
    height: 100,
    width: 150,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#AAAAAA'
  },
  foodLable: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#BBBBBB'
  }
});

AppRegistry.registerComponent('fridgeProject', () => fridgeProject);
