// import { ethToEvmos, evmosToEth } from "@tharsis/address-converter";
import {
    createTransactionWithMultipleMessages,
    createMsgUndelegate as protoMsgUndelegate,
    
  } from "@evmos/proto";
//   import i from "@evmos/proto"
  import { Wallet } from "@ethersproject/wallet";
  import {
    broadcast,
    getSender,
    signTransaction,
    LOCALNET_CHAIN,
    LOCALNET_FEE,
    signTransactionUsingEIP712,
  } from "@hanchon/evmos-ts-wallet";
  import {
    createEIP712,
    generateFee,
    generateMessageWithMultipleTransactions,
    generateTypes,
    createMsgUndelegate,
    MSG_UNDELEGATE_TYPES,
  } from "@evmos/eip712";
  
  async function prepareTx(wallet: Wallet) {
    const fee = LOCALNET_FEE;
    fee.gas = "3000000";
    fee.amount = "300000";
    
    const sender = await getSender(wallet, "http://localhost:1317");
    
    console.log(sender.pubkey);

  
    
    const feeObject = generateFee(
      fee.amount,
      fee.denom,
      fee.gas,
      sender.accountAddress
    );
  
    var types = generateTypes(MSG_UNDELEGATE_TYPES);

    const msgs: any[] = [];
  
    var pubkey = wallet.publicKey.split("0x")[1];
    var ba64 = Buffer.from(pubkey, "hex").toString("base64");
  
    const max = "0.400000000000000000";
    const change = "0.000000000000000001";
    const rate = "0.100000000000000000";



    msgs.push(
        createMsgUndelegate(sender.accountAddress,
          "evmosvaloper1can8phtx6t6aq73p3c2ad2l3dwhmewxe0tegst",
            "100000000001",
            "stake",)
      );
  
    const messages = generateMessageWithMultipleTransactions(
      sender.accountNumber.toString(),
      sender.sequence.toString(),
      LOCALNET_CHAIN.cosmosChainId,
      "",
      feeObject,
      msgs
    );
  
    const eipToSign = createEIP712(types, LOCALNET_CHAIN.chainId, messages);
    const protoMsgs: any[] = [];
  
  

    protoMsgs.push(
        protoMsgUndelegate(sender.accountAddress,
          "evmosvaloper1can8phtx6t6aq73p3c2ad2l3dwhmewxe0tegst",
            "100000000001",
             "stake")
      );
  

    const tx = createTransactionWithMultipleMessages(
      protoMsgs,
      "",
      fee.amount,
      fee.denom,
      parseInt(fee.gas, 10),
      "ethsecp256",
      sender.pubkey,
      sender.sequence,
      sender.accountNumber,
      LOCALNET_CHAIN.cosmosChainId
    );
  
    return {
      sender,
      txSimple: {
        signDirect: tx.signDirect,
        legacyAmino: tx.legacyAmino,
        eipToSign,
      },
    };
  }
  
  (async () => {
    const seed =
      "attitude pepper pattern poem acquire fetch alpha panda deer accuse knock ahead whip alarm mountain fossil pottery vessel cupboard situate parrot resist sock winter";
    const wallet = Wallet.fromMnemonic(seed);
    // console.log("wallet:",wallet);
  
    const msgMM = await prepareTx(wallet);
   
    const resMM = await signTransactionUsingEIP712(
      wallet,
      msgMM.sender.accountAddress,
      msgMM.txSimple
    );
  
    // console.log("resMM:",resMM);
  
  
    const broadcastRes = await broadcast(resMM, "http://localhost:1317");
  
    if (broadcastRes.tx_response.code === 0) {
      console.log("Success sign transaction");
    } else {
      console.log(`Error payload signature: ${JSON.stringify(broadcastRes)}`);
    }
  })();