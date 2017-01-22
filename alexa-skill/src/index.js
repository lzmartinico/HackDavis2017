var Alexa = require('alexa-sdk');
var pluralize = require('pluralize');
var welcomeMessage  = 'Welcome to your fridge. What food would you like to add first?'
var welcomeReprompt = 'What do you want to add first?'

var states = {
    EDITMODE: '_EDITMODE',
    CONFIRMMODE: '_CONFIRMMODE'
};

var appId = "amzn1.ask.skill.cf0270dc-41a0-4f7e-949d-a527e1d83321";

var storage = function() {}

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
    }
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
            food   = pluralize.singular(this.event.request.intent.slots.Food),
            drink  = pluralize.singular(this.event.request.intent.slots.Drink),
            speechOutput = "";
    if (!food.value && !drink.value) {
           this.emit(':ask', 'sorry, I did not understand the item, please say that again', 'Please ask again');
            return;
        }
    var amountValue = parseInt(amount.value);
    if(food.value) {
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
    } else if (drink.value) {
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
    }
    this.emit(':saveState', true);
    this.emit(':tell', speechOutput);
  },
  'RemoveItemIntent': function() {
    var weight = this.event.request.intent.slots.Weight,
    volume = this.event.request.intent.slots.Volume,
    amount = this.event.request.intent.slots.Amount,
    food   = pluralize.singular(this.event.request.intent.slots.Food),
    drink  = pluralize.singular(this.event.request.intent.slots.Drink);
    if (!food.value && !drink.value) {
      response.ask('sorry, I did not understand the item, please say that again', 'Please ask again');
      return;
    }
    var amountValue = parseInt(amount.value);
    var targetItem, speechOutput = '';
    if(food.value) {
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
    var food   = pluralize.singular(this.event.request.intent.slots.Food),
    drink  = pluralize.singular(this.event.request.intent.slots.Drink);
    if (!food.value && !drink.value) {
      response.ask('sorry, I did not understand the item, please say that again', 'Please ask again');
      return;
    }
    if(food.value) {
      var speechOutput = food.value;
      if (this.attributes['food'] && this.attributes['food'].hasOwnProperty(food.value)) {
        for (var category in Object.keys(this.attributes.food[food.value])) {
            this.attributes.food[food.value][category] = 0;
        }
      }
    } else if(drink.value) {
      var speechOutput = drink.value;
      if (this.attributes['drink'] && this.attributes['drink'].hasOwnProperty(drink.value)) {
        for (var category in Object.keys(this.attributes.drink[drink.value])) {
            this.attributes.drink[drink.value][category] = 0;
        }
      }
    }
    speechOutput += " removed";
    this.emit(':saveState', true);
    this.emit(':tell', speechOutput);
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
      console.log(this.attributes);
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

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = "FoodData";
    alexa.registerHandlers(statelessHandlers, editStateHandlers, confirmStateHandlers);
    alexa.execute();
};
