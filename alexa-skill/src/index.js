var Alexa = require('alexa-sdk');
var pluralize = require('pluralize');
var welcomeMessage  = 'Welcome to your fridge. What food would you like to add first?';
var welcomeReprompt = 'What do you want to add first?';

var states = {
    EDITMODE: '_EDITMODE',
    CONFIRMMODE: '_CONFIRMMODE',
    EXPIRATIONMODE: '_EXPIRATIONMODE'
};

var appId = "amzn1.ask.skill.cf0270dc-41a0-4f7e-949d-a527e1d83321";

var storage = function() {};

var statelessHandlers = {
    'NewSession': function() {
      if (Object.keys(this.attributes).length === 0) {
        this.attributes['food']   = {};
        this.attributes['drinks'] = {};
      }
        this.handler.state = states.EDITMODE;
        this.emit(':ask', welcomeMessage, welcomeReprompt);
    },
    'AddItemIntent': function() {
        this.handler.state = states.EDITMODE;
        this.emitWithState("AddItemIntent");
    },
    'RemoveItemIntent': function() {
        this.handler.state = states.EDITMODE;
        this.emitWithState("RemoveItemIntent");
    },
    'ResetIntent': function() {
        /* TODO: ask for confirmation
        this.attributes['food'] = {};
        this.attributes['drinks'] = {};*/
    },
    'Unhandled': function() {
        console.log('unhandled');
        this.emit(":tell", "unhandled intent");
    }
};
var editStateHandlers = Alexa.CreateStateHandler(states.EDITMODE, {
    'AddItemIntent' : function() {
    var weight = this.event.request.intent.slots.Weight,
            volume = this.event.request.intent.slots.Volume,
            amount = this.event.request.intent.slots.Amount,
            food   = this.event.request.intent.slots.Food,
            drink  = this.event.request.intent.slots.Drink,
            speechOutput = "";
    if (!food.value && !drink.value) {
           this.emit(':ask', 'sorry, I did not understand the item, please say that again', 'Please ask again');
            return;
        }
    var amountValue = parseInt(amount.value);
    if(food.value) {
      food.value   = pluralize.singular(food.value);
      if (!this.event.request.intent.slots.Volume.hasOwnProperty("value")) {
        amountValue = 1;
      }
      if (weight.value === "kilo" || weight.value === "kilogram") {
        weight.value  = "gram";
        amountValue *= 1000;
      }
      if (this.attributes['food'] && this.attributes['food'].hasOwnProperty(food.value)) {
        if (this.event.request.intent.slots.Weight.hasOwnProperty("value")) {
          if (weight.value[weight.value.length - 1] === 's') {
            weight.value = weight.value.substring(0,weight.value.length - 1);
          }
          this.attributes.food[food.value][weight.value] += amountValue;
        } else {
          this.attributes.food[food.value]["amount"] += amountValue;
        }
      } else {
        var vals = {
              "amount":   0,
              "pound":    0,
              "ounce":    0,
              "gram":     0
              };
        if (this.event.request.intent.slots.Weight.hasOwnProperty("value")) {
          vals[weight.value] += amountValue;
        } else {
          vals["amount"] += amountValue;
        }
        this.attributes.food[food.value] = vals;
      }
      speechOutput += "Adding " + food.value + '. ';  
      this.attributes.expirationItem = {"type": "food", "value": food.value};
    } else if (drink.value) {
      drink.value  = pluralize.singular(drink.value);
      if (volume.value === "liter") {
        volume.value = "milliliter";
        amountValue *= 1000;
      }

      if (!this.event.request.intent.slots.Volume.hasOwnProperty("value"))
      {
        amountValue = 1;
      }
      if (this.attributes.drinks.hasOwnProperty(drink.value)) {
        if (volume.value) {
          if (volume.value[volume.value.length - 1] === 's') {
            volume.value = volume.value.substring(0,volume.value.length - 1);
          }
          this.attributes.drinks[drink.value][volume.value] += amountValue;
        } else {
          this.attributes.drinks[drink.value]["amount"] += amountValue;
        }
        
      } else {
        var vals = {
              "gallon":     0,
              "milliliter": 0,
              "cup":        0,
              "ounce":      0,
              "amount":     0
              };
        if (volume.value) {
          vals[volume.value] += amountValue;
        } else {
          vals["amount"] += amountValue;
        }
        this.attributes.drinks[drink.value] = vals;
      }

      speechOutput += "Adding " + drink.value + '. ';
      this.attributes.expirationItem = {"type": "drinks", "value": drink.value};
    }
    speechOutput += " set an expiration date";
    this.handler.state = states.EXPIRATIONMODE;
    this.emit(':ask', speechOutput, "Please set an expiration date.");
  },
  'RemoveItemIntent': function() {
    var weight = this.event.request.intent.slots.Weight,
    volume = this.event.request.intent.slots.Volume,
    amount = this.event.request.intent.slots.Amount,
    food   = this.event.request.intent.slots.Food,
    drink  = this.event.request.intent.slots.Drink,
    speechOutput = "";
    if (!food.value && !drink.value) {
      response.ask('sorry, I did not understand the item, please say that again', 'Please ask again');
      return;
    }
    var amountValue = parseInt(amount.value);
    var targetItem, speechOutput = '';
    if(food.value) {
      food.value   = pluralize.singular(food.value);
        if (weight.value === "kilo" || weight.value === "kilogram") {
            weight.value  = "gram";
            amountValue *= 1000;
        }
        if (!amount.value)
        {
            amount.value = 1;
        }
        var nowNone = true;
        if (this.attributes.food.hasOwnProperty(food.value)) {
            if (weight.value) {
                if (weight.value[weight.value.length - 1] === 's') {
                    weight.value = weight.value.substring(0,weight.value.length - 1);
                }
                this.attributes.food[food.value][weight.value] -= amountValue;
            } else {
                this.attributes.food[food.value]["amount"] -= amountValue;
            }
            for (var category in Object.keys(this.attributes.food[food.value])) {
                if (this.attributes.food[food.value][category] > 0) {
                  nowNone = false;
                  break;
                }
            }
        }
        if (nowNone) {
          delete this.attributes.food[food.value];
          this.handler.state = states.CONFIRMMODE;
          this.attributes["tempItem"] = {"type": "food", "value": food.value};
          this.emit(":ask", "Can you remind me how much of that do you have left?",
                            "How much of the last item you took from the fridge do you have left?");
        }
        speechOutput += "Removed " + food.value + '. ';
    } else if (drink.value) {
      drink.value  = pluralize.singular(drink.value);
        if (volume.value === "liter") {
            volume.value = "milliliter";
            amountValue *= 1000;
        }

        if (!amount.value)
        {
            amount.value = 1;
        }
        var nowNone = true;
        if (this.attributes.drinks.hasOwnProperty(drink.value)) {
          if (volume.value) {
              if (volume.value[volume.value.length - 1] === 's') {
                  volume.value = volume.value.substring(0,volume.value.length - 1);
              }
              this.attributes.drinks[drink.value][volume.value] -= amountValue;
          } else {
              this.attributes.drinks[drink.value]["amount"] -= amountValue;
          }
          for (var category in Object.keys(this.attributes.food[food.value])) {
            if (this.attributes.food[food.value][category] > 0) {
              nowNone = false;
              break;
            }
          }
        }
        if (nowNone) {
          delete this.attributes.drinks[drink.value];
          this.handler.state = states.CONFIRMMODE;
          this.attributes["tempItem"] = {"type": "drink", "value": drink.value};
          this.emit(":ask", "Can you remind me how much of that you have left?",
                            "How much of the last drink you took from the fridge do you have left?");
        }
        speechOutput += "Removed " + drink.value + '. ';
    }
        this.emit(':saveState', true);
        this.emit(':tell', speechOutput);
  },
  'RemoveAllIntent' : function() {
    var food    = this.event.request.intent.slots.Food,
        drink   = this.event.request.intent.slots.Drink;
    if (!food.value && !drink.value) {
      response.ask('sorry, I did not understand the item, please say that again', 'Please ask again');
      return;
    }
    var speechOutput = "";
    if(food.value) {
      food.value  = pluralize.singular(food.value);
      speechOutput += food.value;
      if (this.attributes['food'] && this.attributes['food'].hasOwnProperty(food.value)) {
        for (var category in Object.keys(this.attributes.food[food.value])) {
            this.attributes.food[food.value][category] = 0;
        }
      }
    } else if(drink.value) {
      drink.value = pluralize.singular(drink.value);
      speechOutput += drink.value;
      if (this.attributes['drinks'] && this.attributes['drinks'].hasOwnProperty(drink.value)) {
        for (var category in Object.keys(this.attributes.drinks[drink.value])) {
            this.attributes.drinks[drink.value][category] = 0;
        }
      }
    }
    speechOutput += " removed";
    this.emit(':saveState', true);
    this.emit(':tell', speechOutput);
  },
  'QueryAllIntent' : function() {
    var speechOutput = "You have ";
    var foods = this.attributes.food;
    var drinks = this.attributes.drinks;
    Object.keys(foods).forEach(function(food) {
        if (speechOutput.length > 9) {
          speechOutput += " and ";
        }
        var curItem = "";
      Object.keys(foods[food]).forEach(function(measurement) {
        if (foods[food][measurement] <= 0 || measurement === "expiration") {
          return;
        }
        if (curItem.length > 0) {
          curItem += ", ";
        }
        if (measurement !== "amount") {
          curItem += foods[food][measurement] + " " +
                          measurement + (foods[food][measurement] === 1 ? "" : "s");
        } else {
          curItem += foods[food][measurement] + " unit" + (foods[food][measurement] === 1 ? "" : "s");
        }
      });
      speechOutput += curItem + " of " + food;
    });
    Object.keys(drinks).forEach(function(drink) {
        if (speechOutput.length > 9) {
          speechOutput += " and ";
        }
        var curItem = "";
      Object.keys(drinks[drink]).forEach(function(measurement) {
        if (drinks[drink][measurement] <= 0 || measurement === "expiration") {
          return;
        }
        if (curItem.length > 0) {
          curItem += ", ";
        }
        if (measurement !== "amount") {
          curItem += drinks[drink][measurement] + " " +
                          measurement + (drinks[drink][measurement] === 1 ? "" : "s");
        } else {
          curItem += drinks[drink][measurement] + " unit" + (drinks[drink][measurement] === 1 ? "" : "s");
        }
      });
      speechOutput += curItem + " of " + drink;
    });
    this.emit(":tell", speechOutput);
  }
});

var confirmStateHandlers = Alexa.CreateStateHandler(states.CONFIRMMODE, {
  'AmountIntent': function() {
    var weight = this.event.request.intent.slots.Weight,
    volume = this.event.request.intent.slots.Volume,
    amount = this.event.request.intent.slots.Amount;
    if (!amount.value && !weight.value && !amount.value) {
      this.handler.state = states.EDITMODE;
      delete this.attributes.tempItem;
      this.emit(':saveState', true);
      this.emit(':tell', "o. k. ,  you have none left");
      return;
    }
    if (this.attributes.tempItem.type === "food") {
      var vals = {
        "amount":   0,
        "pound":    0,
        "ounce":    0,
        "gram":     0
      };
      var amountValue = parseInt(amount.value);
      if (weight.value) {
        if (weight.value[weight.value.length - 1] === 's') {
            weight.value = weight.value.substring(0,weight.value.length - 1);
        }
        vals[weight.value] += amountValue;
      } else {
        vals["amount"] += amountValue;
      }
      this.attributes.food[this.attributes.tempItem.value] = vals;
    } else {
      var vals = {
        "gallon":     0,
        "milliliter": 0,
        "cup":        0,
        "ounce":      0,
        "amount":     0
      };
      var amountValue = parseInt(amount.value);
      if (volume.value) {
        if (volume.value[volume.value.length - 1] === 's') {
            volume.value = volume.value.substring(0,volume.value.length - 1);
        }
        vals[volume.value] += amountValue;
      } else {
        vals["amount"] += amountValue;
      }
      this.attributes.drinks[this.attributes.tempItem.value] = vals;
    }
    delete this.attributes.tempItem;
    this.handler.state = states.EDITMODE;
    this.emit(':saveState', true);
    this.emit(':tell', "Great, I've updated accordingly");
  }
});

var expirationStateHandler = Alexa.CreateStateHandler(states.EXPIRATIONMODE, {
  'AddExpirationIntent': function() {
    var date  = this.event.request.intent.slots.Date,
        value = this.attributes.expirationItem.value,
        type  = this.attributes.expirationItem.type;
        if (!date.value) {
          this.handler.state = states.EDITMODE;
          this.emit(':saveState', true);
          this.emit(":tell", "OK, I'll not set an expiration date");
        }
        console.log(type);
        console.log(this.attributes);
        this.attributes[type][value].expiration = date;
        delete this.attributes.expirationItem;
        this.handler.state = states.EDITMODE;
        this.emit(':saveState', true);
        this.emit(':tell', "o. k. , I have saved it");
  }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = "FoodData";
    alexa.registerHandlers(statelessHandlers, editStateHandlers, confirmStateHandlers, expirationStateHandler);
    alexa.execute();
};
