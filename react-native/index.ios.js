/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Container, Header, Badge, Button, InputGroup, Input, Content, Card, CardItem, Text, Spinner, Icon } from 'native-base';
import {
  Alert,
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
    this.state = { text: '', items:{}, rend123:0, biglist:[["yes","no"]], rend234:0};
  }
  
  componentDidMount() {
      fetch(`https://xnc6mpfm36.execute-api.us-east-1.amazonaws.com/demo/food`) 
          .then((result)=> {
              this.forceUpdate();
              result.json().then((res) => {console.log(res);
              console.log("los");
              this.setState({items:res}, () => {
                if(this.state.items.Items[0].length == 0){

                }
                console.log('lalala');
              
              var newList = [];
              var uId = 1;
              for (var i in this.state.items.Items[uId].mapAttr.M.drinks.M){
                 var list = [];
                 if(i.includes(this.state.text.toLowerCase())){
                  list.push(i);
                  if(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.milliliter.N > 0){
                    list.push(" milliliter: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.milliliter.N);
                  }

                  if(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.amount.N > 0){
                    list.push(" amount: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.amount.N);
                  }

                  if(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.gallon.N > 0){
                    list.push(" gallon: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.gallon.N);
                  }

                  if(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.ounce.N > 0){
                    list.push(" ounce: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.ounce.N);
                  }

                  if(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.cup.N > 0){
                    list.push(" cup: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.drinks.M[i].M.cup.N);
                  }
                  newList.push(list);
                }
              }
              for (var i in this.state.items.Items[uId].mapAttr.M.food.M){
                 var list = [];
                 if(i.includes(this.state.text.toLowerCase())){
                  list.push(i);
                  if(this.state.items.Items[uId].mapAttr.M.food.M[i].M.amount.N > 0){
                    list.push(" amount: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.food.M[i].M.amount.N);
                  }
                  if(this.state.items.Items[uId].mapAttr.M.food.M[i].M.pound.N > 0){
                    list.push(" pound: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.food.M[i].M.pound.N);
                  }
                  if(this.state.items.Items[uId].mapAttr.M.food.M[i].M.ounce.N > 0){
                    list.push(" ounce: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.food.M[i].M.ounce.N);
                  }
                  if(this.state.items.Items[uId].mapAttr.M.food.M[i].M.gram.N > 0){
                    list.push(" gram: ");
                    list.push(this.state.items.Items[uId].mapAttr.M.food.M[i].M.gram.N);
                  }
                  newList.push(list);
                }
              }
              this.setState({biglist:newList}, () => {
                this.setState({rend123:1}, () => {              console.log("sa"); 
                                   })  ;
              });
              
              
            });
          }).catch(function(error) {throw error;});
    });
  }

  render() {
    console.log("here")
    if(this.state.rend123 === 0){
      console.log(this.state.rend123);
      return <Text>Loading...</Text>;
    } else {
      return (
      <Container>
          <Header searchBar rounded>
              <InputGroup>
                  <Input placeholder="Search" onChangeText={(text) => this.setState({text})} />
              </InputGroup>
          </Header>
          
          <Content scrollEventThrottle={60} >
            
            <Card style={{marginRight: 10, marginLeft: 10, marginTop: 25}}>
              {this.state.biglist.map((elem) => {
                return <CardItem><FoodComponent Food={elem}/></CardItem>;
              })}
           </Card>
            
        </Content>
      </Container>
    );
    }
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
    var parsedJson2 = JSON.stringify(this.state.items);

    
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
