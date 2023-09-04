"use strict";
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
// import { ethToEvmos, evmosToEth } from "@tharsis/address-converter";
var proto_1 = require("@evmos/proto");
//   import i from "@evmos/proto"
var wallet_1 = require("@ethersproject/wallet");
var evmos_ts_wallet_1 = require("@hanchon/evmos-ts-wallet");
var eip712_1 = require("@evmos/eip712");
function prepareTx(wallet) {
    return __awaiter(this, void 0, void 0, function () {
        var fee, sender, feeObject, types, msgs, pubkey, ba64, max, change, rate, messages, eipToSign, protoMsgs, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fee = evmos_ts_wallet_1.LOCALNET_FEE;
                    fee.gas = "3000000";
                    fee.amount = "300000";
                    return [4 /*yield*/, evmos_ts_wallet_1.getSender(wallet, "http://localhost:1317")];
                case 1:
                    sender = _a.sent();
                    console.log(sender.pubkey);
                    feeObject = eip712_1.generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
                    types = eip712_1.generateTypes(eip712_1.MSG_UNDELEGATE_TYPES);
                    msgs = [];
                    pubkey = wallet.publicKey.split("0x")[1];
                    ba64 = Buffer.from(pubkey, "hex").toString("base64");
                    max = "0.400000000000000000";
                    change = "0.000000000000000001";
                    rate = "0.100000000000000000";
                    msgs.push(eip712_1.createMsgUndelegate(sender.accountAddress, "evmosvaloper1can8phtx6t6aq73p3c2ad2l3dwhmewxe0tegst", "100000000001", "stake"));
                    messages = eip712_1.generateMessageWithMultipleTransactions(sender.accountNumber.toString(), sender.sequence.toString(), evmos_ts_wallet_1.LOCALNET_CHAIN.cosmosChainId, "", feeObject, msgs);
                    eipToSign = eip712_1.createEIP712(types, evmos_ts_wallet_1.LOCALNET_CHAIN.chainId, messages);
                    protoMsgs = [];
                    protoMsgs.push(proto_1.createMsgUndelegate(sender.accountAddress, "evmosvaloper1can8phtx6t6aq73p3c2ad2l3dwhmewxe0tegst", "100000000001", "stake"));
                    tx = proto_1.createTransactionWithMultipleMessages(protoMsgs, "", fee.amount, fee.denom, parseInt(fee.gas, 10), "ethsecp256", sender.pubkey, sender.sequence, sender.accountNumber, evmos_ts_wallet_1.LOCALNET_CHAIN.cosmosChainId);
                    return [2 /*return*/, {
                            sender: sender,
                            txSimple: {
                                signDirect: tx.signDirect,
                                legacyAmino: tx.legacyAmino,
                                eipToSign: eipToSign
                            }
                        }];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var seed, wallet, msgMM, resMM, broadcastRes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                seed = "attitude pepper pattern poem acquire fetch alpha panda deer accuse knock ahead whip alarm mountain fossil pottery vessel cupboard situate parrot resist sock winter";
                wallet = wallet_1.Wallet.fromMnemonic(seed);
                return [4 /*yield*/, prepareTx(wallet)];
            case 1:
                msgMM = _a.sent();
                return [4 /*yield*/, evmos_ts_wallet_1.signTransactionUsingEIP712(wallet, msgMM.sender.accountAddress, msgMM.txSimple)];
            case 2:
                resMM = _a.sent();
                return [4 /*yield*/, evmos_ts_wallet_1.broadcast(resMM, "http://localhost:1317")];
            case 3:
                broadcastRes = _a.sent();
                if (broadcastRes.tx_response.code === 0) {
                    console.log("Success sign transaction");
                }
                else {
                    console.log("Error payload signature: " + JSON.stringify(broadcastRes));
                }
                return [2 /*return*/];
        }
    });
}); })();
