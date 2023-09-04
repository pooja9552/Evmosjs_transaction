import { ethToEvmos, evmosToEth } from "@tharsis/address-converter";
import {
  createTransactionWithMultipleMessages,
  createMsgSend as protoMsgSend,
  createMsgDelegate as protoMsgDelegate,
  createMsgCreateValidator as protoMsgCreateValidator,
} from "@evmos/proto";
import { Wallet } from "@ethersproject/wallet";
import {
  broadcast,
  getSender,
  signTransaction,
  LOCALNET_CHAIN,
  LOCALNET_FEE,
  signTransactionUsingEIP712,
} from "@hanchon/evmos-ts-wallet";
LOCALNET_CHAIN.cosmosChainId="streakk_9000-4"
LOCALNET_CHAIN.chainId=9000
LOCALNET_FEE.denom="tSTKC"
LOCALNET_FEE.amount="3000000"
LOCALNET_FEE.gas="3000000"
import {
  createEIP712,
  createMsgSend,
  generateFee,
  generateMessageWithMultipleTransactions,
  generateTypes,
  MSG_SEND_TYPES,
  createMsgDelegate,
  MSG_DELEGATE_TYPES,
  createMsgCreateValidator,
  MSG_CREATE_VALIDATOR_TYPES,
} from "@evmos/eip712";

async function prepareTx(wallet: Wallet) {
  const fee = LOCALNET_FEE;
  fee.gas = "3000000";
  fee.amount = "300000";
  fee.denom = "tSTKC"

  const sender = await getSender(wallet, "http://localhost:1317");
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress
  );

  var types = generateTypes(MSG_CREATE_VALIDATOR_TYPES);
  const msgs: any[] = [];

  var pubkey = wallet.publicKey.split("0x")[1];
  var ba64 = Buffer.from(pubkey, "hex").toString("base64");

  const max = "0.400000000000000000";
  const change = "0.000000000000000001";
  const rate = "0.100000000000000000";

  const valPubkey = "HQzFVKbJ0nkxdLzhSJt1qsLuWrJAdWHX9vAaC20kyk8=";

  msgs.push(
    createMsgCreateValidator(
      {
        moniker: "qwe",
        identity: "asd",
        website: "asd",
        securityContact: "zxc",
        details: " tyu",
      },
      {
        rate: rate,
        maxChangeRate: change,
        maxRate: max,
      },
      "10000000000000000000",
      sender.accountAddress,
      "streakkvaloper1lp0mx49rxde83uaycr3z6n54tpyu3acerwhtma",
      "1000000000000000000000000",
      "tSTKC",
      valPubkey
    )
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
    protoMsgCreateValidator(
      {
        moniker: "qwe",
        identity: "asd",
        website: "asd",
        securityContact: "zxc",
        details: " tyu",
      },
      {
        maxChangeRate: "1",
        rate: "100000000000000000",
        maxRate: "400000000000000000",
      },
      "10000000000000000000",
      sender.accountAddress,
      "streakkvaloper1lp0mx49rxde83uaycr3z6n54tpyu3acerwhtma",
      "1000000000000000000000000",
      "tSTKC",
      valPubkey
    )
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
    "spell alarm huge skin olive reward erode lecture property brush gym alley kitten reveal february buzz situate long machine shift obvious shrug kit neutral";
  const wallet = Wallet.fromMnemonic(seed);

  const msgMM = await prepareTx(wallet);
  const resMM = await signTransactionUsingEIP712(
    wallet,
    msgMM.sender.accountAddress,
    msgMM.txSimple
  );

  const broadcastRes = await broadcast(resMM, "http://localhost:1317");

  if (broadcastRes.tx_response.code === 0) {
    console.log("Success sign transaction");
  } else {
    console.log(`Error payload signature: ${JSON.stringify(broadcastRes)}`);
  }
})();