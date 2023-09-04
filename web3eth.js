// Import
// import { ApiPromise, WsProvider ,HttpProvider} from "@polkadot/api";
// import { Keyring, decodeAddress, encodeAddress } from "@polkadot/keyring";
// import { hexToU8a, isHex, u8aToHex } from "@polkadot/util";
// import {
//   mnemonicToMiniSecret,
//   encodeAddress as util_crypto_encodeAddress,
// } from "@polkadot/util-crypto";
import ethers from "ethers";

console.log(ethers)

// let james = async () => {
//   try {
//       let blockProduce = await web3.eth.getBlockNumber();
//       let chainId = await web3.eth.getChainId();
//       console.log("vsdvdsv=====", blockProduce, "chainId=======  ", chainId)
//   } catch (err) {
//       console.log("eroor==", err);
//   }
// };

// setInterval(
//   async function () {
//       await james();
//   }, 3000)






// const { decodeAddress } = require('@polkadot/util-crypto');
// const { u8aToHex } = require('@polkadot/util');
// const publicKey = decodeAddress('5Gwo3AMkMqUnm8hMFxLzugxGioSZfAa6LpgWX4gU3g5GDpJy');
// const hexPublicKey = u8aToHex(publicKey);
// console.log(hexPublicKey);

// Construct API provider
// const wsProvider = new WsProvider("wss://wss-testnet.5ire.network");

import  Web3  from "web3";
// const web3= new Web3("wss://wss-testnet.5ire.network")
// const web3= new Web3("wss://chain-socket.qa-ant.testnet.5ire.network")
// const web3 = new Web3(new Web3.providers.HttpProvider("https://testnet-http.5ire.network"));

// const web3 = new Web3(new Web3.providers.HttpProvider("https://chain-node.5ire.network"));


// const web3 = new Web3(new Web3.providers.HttpProvider("https://chain-node.5ire.network"));

// const web3 = new Web3(new Web3.providers.HttpProvider("http://43.206.48.119:8545"));
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// web3.eth.getChainId().then(console.log);
var block = await web3.eth.getBlock("latest");
console.log("gasLimit: " + block.gasLimit);
let james = async()=>{
  try{
const chainId = await web3.eth.getChainId();
// const balance = await web3.eth.getBalance("0x68E15d84030a8366eF9585521A40370913Ec3d5B")
const balance = await web3.eth.getBalance("0xDEA69254B50dfeE7861D786eE931dFb96EaDEfDA")

console.log("dscdsc",balance)
console.log("vsdvdsv=====",chainId)


var seed = "kiwi warrior neutral hat absorb dismiss seat palm attitude tragic boy oyster excite tumble pride hunt school brief jelly fame happy curious spice extend"

const gg = await ethers.Wallet.fromMnemonic(seed);
console.log(gg.mnemonic, gg.address, gg.privateKey);
console.log(
  "BEFORE HERE BALANCE",
  (await web3.eth.getBalance(gg.address)) / 10 ** 18
);

var publicKey = "0x6B40b468DCC75A5521382a64dfc2969e9347bA06"
const transaction = {
    'to': publicKey, // faucet address to return eth
    // 'value': 3*10**18,
    'gas': 30000,
    'value':  4*10**18,
    // 'gas':100000,
    'maxFeePerGas': 100000000108,
    'nonce': await web3.eth.getTransactionCount(gg.address),
    // optional data field to send message or execute smart contract
   };

  //  web3.eth.sendTransaction({from:eth.accounts[0], to:'0x[ADDRESS_HERE]', value: web3.toWei(5, "ether"), gas:100000});
   const gasAmount = await web3.eth.estimateGas({
    to: publicKey,
    from: gg.address,
    value: 3*10**18,
  });
  console.log("gasamount=====",gasAmount);
  const gasPrice = await web3.eth.getGasPrice();
  const ethGasfees = gasPrice * gasAmount/10**18;

  console.log("ethGasfees[========",ethGasfees,"dsvdsv",gasPrice);



  web3.eth.getBlock("latest", false, (error, result) => {
    console.log(result.gasLimit)
    // => 8000029
  });
   const signedTx = await web3.eth.accounts.signTransaction(transaction, gg.privateKey);
  //  console.log('Signed Transaction=========',signedTx.rawTransaction)
  await web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
    if (!error) {
    //  setTimeout(async()=>{
    //      console.log("lkvdsvmdsv===",await web3.eth.getTransaction(hash))
    //  },10000)

    var result= await web3.eth.getTransaction(hash)
    console.log("result=====",result);

      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });

console.log(
  "HERE AFTER BALANCE",
  (await web3.eth.getBalance(publicKey)) / 10 ** 18
);





  }catch(err){
    console.log("eroor==",err);
  }
};

james();

// import {ethers}  from "ethers";

// let mnemonic ='expect hurry diary rose pave gossip maid knock cargo caution pluck can'
// let mnemonic =
//   "display junior nerve erode horse right peace wire inside debris panel auction";

// const seedUser = mnemonicToMiniSecret(mnemonic);
// const { publicKey, secretKey } = naclKeypairFromSeed(seedUser);
// const keyring = new Keyring({ type: "ed25519" });
// const userKeyring = keyring.addFromPair(naclKeypairFromSeed(seedUser));
// console.log("vddsv===", keyring);
// console.log("userKeyring===", userKeyring);

// let payments = async (keyring, transfermethod) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // const api = await PolkadotHelper.api;
//       await transfermethod.signAndSend(keyring, (data, extrinsicData) => {
//         if (data.status.isInBlock || data.status.isFinalized) {
//           let hash;
//           if (data.status.isInBlock) {
//             hash = transfermethod.hash.toHex();
//           }
//           data.events
//             .filter((res) => res.phase.isApplyExtrinsic)
//             .forEach((result) => {
//               if (api.events.system.ExtrinsicSuccess.is(result.event)) {
//                 // extract the data for this event
//                 // (In TS, because of the guard above, these will be typed)
//                 const [dispatchInfo] = result.event.data;
//                 resolve({
//                   error: false,
//                   txHash: hash,
//                 });
//               } else if (api.events.system.ExtrinsicFailed.is(result.event)) {
//                 const [dispatchError, dispatchInfo] = result.event.data;
//                 let errorInfo;

//                 if (dispatchError.isModule) {
//                   console.log(
//                     "Module Error:- ",
//                     JSON.parse(dispatchError.asModule.toString())
//                   );

//                   const decoded = api.registry.findMetaError(
//                     dispatchError.asModule
//                   );

//                   errorInfo = `${decoded.section}.${decoded.name}`;
//                   console.log("errorInfo", errorInfo);
//                 } else {
//                   // Other, CannotLookup, BadOrigin, no extra info
//                   errorInfo = dispatchError.toString();
//                   console.log("errorInfo", errorInfo);
//                 }

//                 resolve({
//                   errorMessage: errorInfo,
//                   error: true,
//                 });
//                 // console.log(
//                 //    `${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`
//                 // );
//               }
//             });
//         }
//       });
//     } catch (err) {
//       console.log(
//         "\x1b[31mError While Making Transfer Bond Amount: \x1b[39m",
//         err.message
//       );
//       resolve({
//         error: true,
//         errorMessage: err.toString(),
//       });
//     }
//   });
// };
// const stashId = encodeAddress(decodeAddress(publicKey));
// console.log("stashId===", stashId);
// const publicKeys = u8aToHex(userKeyring.publicKey).slice(0, 42);
// console.log("scdsckdsc===", publicKeys);



//============= web3 ===========================================================
// let mnemonicWallet =ethers.Wallet.fromMnemonic(mnemonic);

// console.log("HERE NEW",ethers.Wallet.createRandom())
// console.log("msdvds==",mnemonicWallet)
//  console.log(mnemonicWallet.privateKey,mnemonicWallet.address,)

// let web3PrivateKey = mnemonicWallet.privateKey;
// let web3PublicAddress = mnemonicWallet.address;


// let substrateAddress = stashId; //"5FFUicv9cBiJEk4Et4f6yfgyXmSgwxs4RHGYXqFXvfqKE2G6"; //800
// let substarteEvmAddress = publicKeys;
// // let metamaskEvmAddressAccount1 = "0xCfc949Ba823F7F491C7B2261e3BcAdE7868Edb80"; //1978545
// let metamaskEvmAddressAccount2 = "0xcb90cAD4fafD23Eb939c028263520156AA078831"; //0

// const now = await api.query.timestamp.now();
// // Retrieve the account balance & nonce via the system module
// const { nonce, data: balance } = await api.query.system.account(
//   substrateAddress
// );
// console.log(
//   `${now}: balance of ${balance.free / 10 ** 18} and a nonce of ${nonce}`
// );



// let substarteToEvm = async (userKeyring, evmAddress, value, stashId) => {
//   // Form the transaction
//   const api =  ApiPromise.create({ provider: wsProvider });
//   let transactions = await api.tx.evm.deposit(evmAddress, value);
//   const ll = await payments(userKeyring, transactions);
//   const now = await api.query.timestamp.now();
//   // Retrieve the account balance & nonce via the system module
//   const { nonce, data: balance } = await api.query.system.account(stashId);
//   console.log(
//     `${now}: after balance of ${
//       balance.free / 10 ** 18
//     } and a nonce of ${nonce}`
//   );

//   return ll;
// };

// let metamaskToSubstrate = async (to,value,privateKey,publicAddress) => {
//   const transaction = {
//     'to': to, // faucet address to return eth
//     'value': value,
//     'gas': 30000,
//     'maxFeePerGas': 100000000108,
//     'nonce': await web3.eth.getTransactionCount(publicAddress),
//     // optional data field to send message or execute smart contract
//    };
//    const signedTx = await web3.eth.accounts.signTransaction(transaction,privateKey);
//   console.log('ss',signedTx.rawTransaction)
  
//   web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
//    if (!error) {
//     setTimeout(async()=>{
//         console.log(await web3.eth.getTransaction(hash))
//         // return await web3.eth.getTransaction(hash)
//     },10000)
//      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
//    } else {
//      console.log("❗Something went wrong while submitting your transaction:", error)
//    }
//   });
// };

// //===================================== substarte to EVM ===================================================
// let result = await substarteToEvm(
//   userKeyring,
//   web3PublicAddress,
//   100,
//   stashId
// );

// console.log("result =======", result);


// let result1 = await metamaskToSubstrate(
//   publicKeys,
//   10,
//   web3PrivateKey,
//   web3PublicAddress
// );

