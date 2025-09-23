import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { WalletAccount } from "@wallet-standard/base";

export async function mintNFT(
  name: string,
  url: string,
  nftPackageId: string,
  signAndExecute: ReturnType<typeof useSignAndExecuteTransaction>["mutateAsync"],
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
    showEffects: true,
  });

  return result;
}
