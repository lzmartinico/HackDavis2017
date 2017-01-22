/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function Items(session, data) {
        dynamodb.createTable("ItemsData");
        if (data) {
            this.data = data;
        } else {
            this.data = {
                food: {},
                drinks: {}
            };
        }
        this._session = session;
    }

    Items.prototype = {
        // isEmptyItems: function () {
        //     //check if any one had non-zero score,
        //     //it can be used as an indication of whether the game has just started
        //     var allEmpty = true;
        //     var gameData = this.data;
        //     gameData.players.forEach(function (player) {
        //         if (gameData.scores[player] !== 0) {
        //             allEmpty = false;
        //         }
        //     });
        //     return allEmpty;
        // },
        save: function (callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            this._session.attributes.currentItems = this.data;
            dynamodb.putItem({
                TableName: 'ItemsData',
                Item: {
                    CustomerId: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };

    return {
        loadGame: function (session, callback) {
            if (session.attributes.currentItems) {
                console.log('get item from session=' + session.attributes.currentItems);
                callback(new Item(session, session.attributes.currentItems));
                return;
            }
            dynamodb.getItem({
                TableName: 'ItemsData',
                Key: {
                    CustomerId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                var currentItems;
                if (err) {
                    console.log(err, err.stack);
                    currentItems = new Items(session);
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                } else if (data.Item === undefined) {
                    currentItems = new Items(session);
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                } else {
                    console.log('get item from dynamodb=' + data.Item.Data.S);
                    currentItems = new Items(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                }
            });
        },
        addItem: function (session, callback) {
            if (session.attributes.currentItems) {
                console.log('get item from session=' + session.attributes.currentItems);
                callback(new Items(session, session.attributes.currentItems));
                return;
            }
            dynamodb.getItem({
                TableName: 'ItemsData',
                Key: {
                    CustomerId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                var currentItems;
                if (err) {
                    console.log(err, err.stack);
                    currentItems = new Items(session);
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                } else if (data.Item === undefined) {
                    currentItems = new Items(session);
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                } else {
                    console.log('get item from dynamodb=' + data.Item.Data.S);
                    currentItems = new Items(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentItems = currentItems.data;
                    callback(currentItems);
                }
            });
        },
        newFridge: function (session) {
            return new Items(session);
        }
    };
})();
module.exports = storage;
