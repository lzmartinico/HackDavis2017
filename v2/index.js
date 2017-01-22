var Alexa = require('alexa-sdk');
//var http = require('http');
var welcomeMessage  = 'Welcome to your fridge. What food would you like to add first?'
var welcomeReprompt = 'What do you want to add first?'

var states = {
    ADDMODE: '_ADDMODE'
};

var appId = "amzn1.ask.skill.cf0270dc-41a0-4f7e-949d-a527e1d83321";

var storage = function() {}

var statelessHandlers = {
	  'NewSession': function() {
    	if (Object.keys(this.attributes).length === 0) {
    		this.attributes['food']   = {};
    		this.attributes['drinks'] = {};
    	}
    		this.handler.state = states.ADDMODE;
        this.emit(':ask', welcomeMessage, welcomeReprompt);
	  },
	  'AddItemIntent': function() {
	  		console.log("fua");
    		this.handler.state = states.ADDMODE;
    		this.emitWithState("AddItemIntent");
	  },
	  'Unhandled': function() {
	  		console.log('unhandled');
	  		this.emit(":tell", "unhandled intent");
	  }
	};
var addStateHandlers = Alexa.CreateStateHandler(states.ADDMODE, {
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
			if (weight.value === "kilo" || weight.value === "kilogram") {
				weight.value  = "gram";
				amountValue *= 1000;
			}
			if (!amount.value)
			{
				amount.value = 1;
			}
			if (this.attributes['food'] && this.attributes['food'].hasOwnProperty(food.value)) {
				if (weight.value) {
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
				if (weight.value) {
					vals[weight.value] += amountValue;
				} else {
					vals["amount"] += amountValue;
				}
				console.log(this.attributes);
				this.attributes.food[food.value] = vals;
			}
			speechOutput += "Adding " + food.value + '. ';	
		} else if (drink.value) {
			if (volume.value === "liter") {
				volume.value = "milliliter";
				amountValue *= 1000;
			}

			if (!amount.value)
			{
				amount.value = 1;
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
	}
});


exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = "FoodData";
    alexa.registerHandlers(statelessHandlers, addStateHandlers);
    alexa.execute();
};