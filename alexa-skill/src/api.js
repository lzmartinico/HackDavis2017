var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context) => {
    // TODO implement
    console.log("lol")
    var tableName = "FoodData";
    dynamodb.scan({
        TableName: tableName
    }, function(err, data) {
        if (err) {
            context.done(err);
        } else {
            context.succeed(data);
        }
    });
};
