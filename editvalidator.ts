import { Wallet } from '@ethersproject/wallet'
import { createMessageSend, createTxMsgEditValidator } from '@evmos/transactions'
import {
  broadcast,
  getSender,
  LOCALNET_CHAIN,
  LOCALNET_FEE,
  signTransaction,
  signTransactionUsingEIP712,
} from '@hanchon/evmos-ts-wallet'

async function prepareMessage(wallet: Wallet) {
  const sender = await getSender(wallet)
  const validatorAddress = 'evmosvaloper1can8phtx6t6aq73p3c2ad2l3dwhmewxe0tegst'

  const txSimple = createTxMsgEditValidator(
    LOCALNET_CHAIN,
    sender,
    LOCALNET_FEE,
    '',
    {
      moniker: 'a',
      identity: 'b',
      website: 'c',
      securityContact: 'd',
      details: 'e',
      validatorAddress: validatorAddress,
      commissionRate: undefined,
      minSelfDelegation: undefined,
    },
  )
  return { sender, txSimple }
}

;(async () => {
  const privateMnemonic =
    'able fiction rude luggage network scrap between hat found alone cart work update brave true option gaze crush club soft ball soccer raven media'
  const wallet = Wallet.fromMnemonic(privateMnemonic)

  const msgKeplr = await prepareMessage(wallet)

  const resKeplr = await signTransaction(wallet, msgKeplr.txSimple)
  const broadcastRes = await broadcast(resKeplr)

  if (broadcastRes.tx_response.code === 0) {
    console.log('Success sign transaction')
  } else {
    console.log(`Error payload signature: ${broadcastRes}`)
  }
})()