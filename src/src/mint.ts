import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { UseSignAndExecuteTransactionResult } from "@mysten/dapp-kit";
import { WalletAccount } from "@wallet-standard/base";

export async function mintNFT(
  name: string,
  url: string,
  nftPackageId: string,
  signAndExecute: UseSignAndExecuteTransactionResult["mutateAsync"],
  suiClient: SuiClient,
  walletAccount: WalletAccount,
) {
  const tx = new Transaction();


  tx.moveCall({
    target: `${nftPackageId}::first_smart_contract::mint`,
    arguments: [tx.pure.string(name), tx.pure.string(url)],
  });

  tx.setSender(walletAccount.address);

  const result = await signAndExecute({
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  return result;
}
