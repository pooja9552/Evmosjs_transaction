
import { Wallet } from '@ethersproject/wallet'
import { createMessageSend } from '@tharsis/transactions'
import {
  broadcast,
  getSender,
  LOCALNET_CHAIN,
  LOCALNET_FEE,
  signTransactionUsingEIP712,
} from '@hanchon/evmos-ts-wallet'
// LOCALNET_CHAIN.chainId=9000;
// LOCALNET_CHAIN.cosmosChainId="evmos_9000-1"
LOCALNET_CHAIN.cosmosChainId="streakk_9000-4"
LOCALNET_CHAIN.chainId=9000
LOCALNET_FEE.denom="tSTKC"
;(async () => {
  console.log("sender:");
  const privateMnemonic =
    'note meat elegant sweet supply angle palm noodle museum anxiety city sausage access brother gesture badge heavy circle robust bright organ gorilla agree harvest'
  const wallet = Wallet.fromMnemonic(privateMnemonic)
  console.log("sender:",wallet);
  const sender = await getSender(wallet)
  console.log("sender:",sender);
  

  const txSimple = createMessageSend(LOCALNET_CHAIN, sender, LOCALNET_FEE, '', {
    destinationAddress: 'streakk1lp0mx49rxde83uaycr3z6n54tpyu3acea88ytz',
    amount: '1000000000000000000000000',
    denom: 'tSTKC',
    
  })

  const resMM = await signTransactionUsingEIP712(
    wallet,
    sender.accountAddress,
    txSimple,
  )
  

  const broadcastRes = await broadcast(resMM)
  if (broadcastRes.tx_response.code === 0) {
    console.log('Success',broadcastRes)
  } else {
    console.log('Error',broadcastRes)
  }
})()