"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Game = void 0;
// @flow 
var client_1 = require("@apollo/client");
var graphql_tag_1 = require("graphql-tag");
var React = require("react");
var react_1 = require("react");
var react_2 = require("react");
var react_3 = require("react");
var constant_1 = require("../utils/constant");
require("../index.css");
var react_router_dom_1 = require("react-router-dom");
var constant_2 = require("../utils/constant");
var framer_motion_1 = require("framer-motion");
exports.Game = function () {
    var location = react_router_dom_1.useLocation();
    var roomId = location.state.roomId;
    var userName = location.state.userName;
    var isLeader = location.state.isLeader;
    var tempRow = [];
    for (var i = 0; i < 19; i++) {
        var tempCol = [];
        for (var j = 0; j < 19; j++)
            tempCol.push({ info: i + ',' + j, id: roomId + "__" + i + ',' + j });
        tempRow.push(tempCol);
    }
    var _a = react_2.useState(tempRow), boardData = _a[0], setBoardData = _a[1];
    var roomData = react_1.useRef();
    var _b = react_2.useState([]), users = _b[0], setUsers = _b[1];
    var moves = react_1.useRef({ id: roomId + "__" + constant_2.Constants.makingMoves, moves: [] });
    var completedMoves = react_1.useRef({ id: roomId + "__" + constant_2.Constants.completedMoves, moves: [] });
    var movesMap = react_1.useRef(new Map()).current;
    var allMovesMap = react_1.useRef(new Map()).current;
    var roomSubscription = function () {
        var ROOM_SUBSCRIPTION = graphql_tag_1["default"](templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      subscription MySubscription {\n        getroom(id: \"", "\") {\n          inbox {\n            message\n            type\n          }\n          users {\n            color\n            id\n            name\n            occupiedTiles {\n              i\n              j\n            }\n            position {\n              i\n              j\n            }\n            power\n          }\n        } \n      }\n    "], ["\n      subscription MySubscription {\n        getroom(id: \"", "\") {\n          inbox {\n            message\n            type\n          }\n          users {\n            color\n            id\n            name\n            occupiedTiles {\n              i\n              j\n            }\n            position {\n              i\n              j\n            }\n            power\n          }\n        } \n      }\n    "])), roomId);
        var _a = client_1.useSubscription(ROOM_SUBSCRIPTION, { variables: { id: roomId } }), data = _a.data, loading = _a.loading;
        var room = data === null || data === void 0 ? void 0 : data.getroom;
        roomData.current = room;
    };
    var movesSubscription = function () {
        var MOVES_SUBSCRIPTION = graphql_tag_1["default"](templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      subscription MySubscription {\n        getmakingMoves(id: \"", "\") {\n          moves {\n            parameters {\n              from {\n                i\n                j\n              }\n              to {\n                i\n                j\n              }\n              userId\n              value\n            }\n            type\n            id\n          }\n        }\n      }    \n    "], ["\n      subscription MySubscription {\n        getmakingMoves(id: \"", "\") {\n          moves {\n            parameters {\n              from {\n                i\n                j\n              }\n              to {\n                i\n                j\n              }\n              userId\n              value\n            }\n            type\n            id\n          }\n        }\n      }    \n    "])), roomId + "__" + constant_2.Constants.makingMoves);
        var _a = client_1.useSubscription(MOVES_SUBSCRIPTION, { variables: { id: roomId } }), data = _a.data, loading = _a.loading;
        var makingMoves = data === null || data === void 0 ? void 0 : data.getmakingMoves;
        moves.current = makingMoves;
    };
    var completedMovesSubscription = function () {
        var COMPLETED_MOVES_SUBSCRIPTION = graphql_tag_1["default"](templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      subscription MySubscription {\n        getcompletedMoves(id: \"", "\") {\n          moves {\n            parameters {\n              from {\n                i\n                j\n              }\n              to {\n                i\n                j\n              }\n              userId\n              value\n            }\n            type\n            id\n          }\n        }\n      }    \n    "], ["\n      subscription MySubscription {\n        getcompletedMoves(id: \"", "\") {\n          moves {\n            parameters {\n              from {\n                i\n                j\n              }\n              to {\n                i\n                j\n              }\n              userId\n              value\n            }\n            type\n            id\n          }\n        }\n      }    \n    "])), roomId + "__" + constant_2.Constants.completedMoves);
        var _a = client_1.useSubscription(COMPLETED_MOVES_SUBSCRIPTION, { variables: { id: roomId } }), data = _a.data, loading = _a.loading;
        var completedMovesData = data === null || data === void 0 ? void 0 : data.getcompletedMoves;
        completedMoves.current = completedMovesData;
    };
    //room data  
    roomSubscription();
    var updateRoomData = function () {
        if (roomData.current) {
            var data = roomData.current;
            setUsers(data.users);
        }
    };
    var updatingRoomData = constant_1.debounce(updateRoomData, 200);
    react_3.useEffect(updatingRoomData, [roomData.current]);
    //moves data
    movesSubscription();
    var updateMovesData = function () {
        var _a;
        if (((_a = moves.current) === null || _a === void 0 ? void 0 : _a.moves) && moves.current.moves.length > 0) {
            moves.current.moves.forEach(function (move) {
                var _a, _b, _c, _d;
                if (!movesMap.has(move.id)) {
                    movesMap.set(move.id, move);
                    switch (move.type) {
                        case 'jump':
                            {
                                var params = move.parameters;
                                if (!(params === null || params === void 0 ? void 0 : params.userId))
                                    return;
                                var user = getUserFromId(params.userId);
                                if (params.to)
                                    jump([params.to.i, params.to.j], user);
                                user.power = user.power - 0.5;
                                if (params.to)
                                    user.position = { i: params.to.i, j: params.to.j };
                                //if (isLeader) fetchGraphQL(linkWithCompletedMoves(move.id), "MyMutation", {}).then(() => console.log('completed jump'));
                            }
                            break;
                        case 'move':
                            {
                                var params = move.parameters;
                                if (!(params === null || params === void 0 ? void 0 : params.userId))
                                    return;
                                var user = getUserFromId(params.userId);
                                if (params.to)
                                    moveTo([params.to.i, params.to.j], user);
                                user.position = { i: (_b = (_a = params.to) === null || _a === void 0 ? void 0 : _a.i) !== null && _b !== void 0 ? _b : 0, j: (_d = (_c = params.to) === null || _c === void 0 ? void 0 : _c.j) !== null && _d !== void 0 ? _d : 0 };
                            }
                            break;
                        case 'attack': {
                            var params_1 = move.parameters;
                            if (!(params_1 === null || params_1 === void 0 ? void 0 : params_1.userId) || !params_1.to || !params_1.from)
                                return;
                            var user = getUserFromId(params_1.userId);
                            attackFrom([params_1.from.i, params_1.from.j], [params_1.to.i, params_1.to.j], user).then(function () {
                                var temp = movesMap.get(move.id);
                                if (!temp || !params_1.to || !params_1.from)
                                    return;
                                temp.returnValue = { i: params_1.to.i, j: params_1.to.j };
                                if (isLeader)
                                    fetchGraphQL(linkWithCompletedMoves(move.id, temp === null || temp === void 0 ? void 0 : temp.returnValue), "MyMutation", {}).then(function () { return console.log('completed attack'); });
                            });
                        }
                    }
                }
                else {
                }
            });
        }
    };
    var updatingMovesData = constant_1.debounce(updateMovesData, 200);
    react_3.useEffect(updatingMovesData, [moves.current]);
    //completed moves data
    completedMovesSubscription();
    var updateCompletedMovesData = function () {
        var _a;
        if (((_a = completedMoves.current) === null || _a === void 0 ? void 0 : _a.moves) && completedMoves.current.moves.length > 0) {
            completedMoves.current.moves.forEach(function (move) {
                var _a;
                if (movesMap.has(move.id)) {
                    if (!isLeader) {
                        if (move.returnValue != ((_a = movesMap.get(move.id)) === null || _a === void 0 ? void 0 : _a.returnValue)) {
                            //if not synced
                        }
                        fetchGraphQL(deleteMove(move.id), "MyMutation", {});
                    }
                    allMovesMap.set(move.id, move);
                    movesMap["delete"](move.id);
                    setTimeout(function () {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        switch (move.type) {
                            case 'attack':
                                if (((_a = move.parameters) === null || _a === void 0 ? void 0 : _a.from) && ((_b = move.parameters) === null || _b === void 0 ? void 0 : _b.to)) {
                                    var from = [(_c = move.parameters) === null || _c === void 0 ? void 0 : _c.from.i, (_d = move.parameters) === null || _d === void 0 ? void 0 : _d.from.j];
                                    var to = [(_f = (_e = move.parameters) === null || _e === void 0 ? void 0 : _e.to) === null || _f === void 0 ? void 0 : _f.i, (_h = (_g = move.parameters) === null || _g === void 0 ? void 0 : _g.to) === null || _h === void 0 ? void 0 : _h.j];
                                    attackFrom(from, to, undefined);
                                }
                        }
                    }, 3000);
                }
            });
            console.log(moves);
        }
    };
    var updatingCompletedMovesData = constant_1.debounce(updateCompletedMovesData, 200);
    react_3.useEffect(updatingCompletedMovesData, [completedMoves.current]);
    var log = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        return console.log(data);
    };
    var run = function () { return __awaiter(void 0, void 0, void 0, function () {
        var moveId, move;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    moveId = new Date().getTime() + "__" + roomId + "__" + userName;
                    move = {
                        id: moveId,
                        makingMoves: {
                            id: roomId + "__" + constant_2.Constants.makingMoves
                        },
                        type: "attack",
                        parameters: {
                            from: { i: 0, j: 0 },
                            to: { i: 0, j: 18 },
                            userId: userName
                        }
                    };
                    return [4 /*yield*/, fetchGraphQL(addMove(move, roomId), "MyMutation", {})];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    function fetchGraphQL(operationsDoc, operationName, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://green-wave.ap-south-1.aws.cloud.dgraph.io/graphql", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Auth-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzL3Byb3h5IiwiZHVpZCI6IjB4MjM0ZjAwYyIsImV4cCI6MTYzMDI0Njk2MCwiaXNzIjoicy9hcGkifQ.WIhupejwaJCl4UqGRSNWZxGLIpnsK4qPeSpgW3zQ1bg"
                            },
                            body: JSON.stringify({
                                query: operationsDoc,
                                variables: variables,
                                operationName: operationName
                            })
                        })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    var addMove = function (move, roomId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return "\n    mutation MyMutation {\n      addmove(input: {id: \"" + move.id + "\", type: \"" + move.type + "\", makingMoves: {id: \"" + move.makingMoves.id + "\"},\n        parameters: {from: {i: " + ((_b = (_a = move.parameters) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.i) + ", j: " + ((_d = (_c = move.parameters) === null || _c === void 0 ? void 0 : _c.from) === null || _d === void 0 ? void 0 : _d.j) + "}, to: {i: " + ((_f = (_e = move.parameters) === null || _e === void 0 ? void 0 : _e.to) === null || _f === void 0 ? void 0 : _f.i) + ", j: " + ((_h = (_g = move.parameters) === null || _g === void 0 ? void 0 : _g.to) === null || _h === void 0 ? void 0 : _h.j) + "}, userId: \"" + ((_j = move.parameters) === null || _j === void 0 ? void 0 : _j.userId) + "\"}}) {\n        numUids\n      }\n    }\n  ";
    };
    var deleteMove = function (moveId) { return "\n    mutation MyMutation {\n      deletemove(filter: {id: {eq: \"" + moveId + "\"}}) {\n        msg\n        numUids\n      }\n    }\n  "; };
    var linkWithCompletedMoves = function (moveId, returnValue) { return "\n    mutation MyMutation {\n      updatemove(input: {filter: {id: {eq: \"" + moveId + "\"}}, set: {returnValue: {i: " + returnValue.i + ", j: " + returnValue.j + "} ,completedMoves: {id: \"" + roomId + "__completedMoves\"}}}) {\n        numUids\n      }\n    }  \n  "; };
    var getUserFromId = function (id) {
        var user = users.filter(function (user) { return user.id === id; });
        return user[0];
    };
    var updateUser = function (user) { return "\n    mutation MyMutation {\n      updateuser(input: {filter: {id: {eq: \"" + user.id + "\"}}, set: {position: {i: " + user.position.i + ", j: " + user.position.j + "}, power: " + user.power + "}}) {\n        numUids\n      }\n    }\n  "; };
    var jump = function (to, user) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, top, left;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userDoc = document.getElementById(user.name);
                    top = 2.3;
                    left = 2.3;
                    if (userDoc) {
                        userDoc.style.top = (top + 2.0625 * to[0]) + 'rem';
                        userDoc.style.left = (left + 2.0625 * to[1]) + 'rem';
                    }
                    // if (user.name == 'lokesh') user2.position = to.map(a => a);
                    // else user1.position = to.map(a => a);
                    return [4 /*yield*/, sleep(250)];
                case 1:
                    // if (user.name == 'lokesh') user2.position = to.map(a => a);
                    // else user1.position = to.map(a => a);
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var moveTo = function (to, user) { return __awaiter(void 0, void 0, void 0, function () {
        var from;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = [user.position.i, user.position.j];
                    _a.label = 1;
                case 1:
                    if (!(!(from[0] == to[0]) || !(from[1] == to[1]))) return [3 /*break*/, 3];
                    if (from[0] < to[0])
                        from[0]++;
                    else if (from[0] > to[0])
                        from[0]--;
                    if (from[1] < to[1])
                        from[1]++;
                    else if (from[1] > to[1])
                        from[1]--;
                    return [4 /*yield*/, jump(from, user)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var attackFrom = function (from, to, user) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, occupy(from, user)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(!(from[0] == to[0]) || !(from[1] == to[1]))) return [3 /*break*/, 4];
                    if (from[0] < to[0])
                        from[0]++;
                    else if (from[0] > to[0])
                        from[0]--;
                    if (from[1] < to[1])
                        from[1]++;
                    else if (from[1] > to[1])
                        from[1]--;
                    return [4 /*yield*/, occupy(from, user)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var attack = function (to, user) { return __awaiter(void 0, void 0, void 0, function () {
        var from;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = [user === null || user === void 0 ? void 0 : user.position.i, user === null || user === void 0 ? void 0 : user.position.j];
                    return [4 /*yield*/, attackFrom(from, to, user)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var occupy = function (position, user) { return __awaiter(void 0, void 0, void 0, function () {
        var temp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    temp = boardData.map(function (x) { return x.map(function (y) { return y; }); });
                    temp[position[0]][position[1]].owner = user === null || user === void 0 ? void 0 : user.id;
                    setBoardData(temp);
                    return [4 /*yield*/, sleep(200)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(ms); }, ms); }); };
    return (React.createElement("div", { className: "flex flex-col justify-center items-center bg-gray-900 w-1/2 overflow-auto h-screen" },
        React.createElement("div", { className: "m-5 relative" },
            users.map(function (user, index) {
                return (React.createElement("div", { id: user.name, key: index, className: "absolute m-0 w-6 h-6 text-sm text-white flex justify-center items-center rounded-full", style: { backgroundColor: user.color, top: (2.3 + 2.0625 * user.position.i) + 'rem', left: (2.3 + 2.0625 * user.position.j) + 'rem', transition: 'all .2s ease' } }, user.name.toUpperCase()[0]));
            }),
            React.createElement("div", { className: "flex ml-8" }, boardData.map(function (row) { return React.createElement("p", { className: "w-8 h-8 flex items-center text-white justify-center m-0 text-sm", key: row[0].info.split(',')[0], style: { margin: '.5px' } }, row[0].info.split(',')[0]); })),
            boardData.map(function (row) {
                return React.createElement("div", { className: "flex justify-center", key: row[0].info.split(',')[0] },
                    React.createElement("p", { className: "w-8 h-8 flex items-center text-white justify-center m-0 text-sm", key: row[0].info.split(',')[0], style: { margin: '.5px' } }, row[0].info.split(',')[0]),
                    row.map(function (col) {
                        var style = { margin: '15px', cursor: 'pointer' };
                        if (col.owner)
                            style['backgroundColor'] = getUserFromId(col.owner).color;
                        return (React.createElement(framer_motion_1.motion.div, { animate: { margin: '.5px' }, transition: { type: 'spring', duration: 0.5 }, className: "w-8 h-8 tile", style: style, id: col.id, key: row[0].info.split(',')[0] + '' + col.id },
                            React.createElement("p", { className: "m-0 text-xs hidden tileText", style: { color: col.owner ? 'white' : 'black' } }, col.info)));
                    }));
            })),
        React.createElement("div", { onClick: run, id: 'create', className: "rounded justify-center items-center flex cursor-pointer text-white px-5 py-2", style: { backgroundColor: constant_1.color1, boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)' } }, "RUN")));
};
var templateObject_1, templateObject_2, templateObject_3;
