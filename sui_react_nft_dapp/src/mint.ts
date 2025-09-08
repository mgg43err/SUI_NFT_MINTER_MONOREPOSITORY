import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { useCurrentWallet } from "@mysten/dapp-kit";

export async function mintNFT(
  name: any,
  url: any,
  wallet: any,
  suiClient: SuiClient, // <-- Pass your SuiClient instance here!
) {
  const tx = new Transaction();

  // const nameBytes = new TextEncoder().encode(name); // Uint8Array
  // const urlBytes = new TextEncoder().encode(url);

  console.log("name", name, "urlBytes",  url);

  tx.moveCall({
    target: `0xc8a6247cb83f54b648f9502a1ad5f63b6874cf60cc7b4b7082fbb2df0a287b5a::first_smart_contract::mint`,
    arguments: [tx.pure(name), tx.pure(url)],
  });

  tx.setSender(wallet.address);
  // Build the transaction to bytes
  const bytes = await tx.build({ client: suiClient });

  // Use the correct wallet method
  const result = await wallet.signAndExecuteTransactionBlock({
    transactionBlock: bytes,
    // You can add options here if needed, e.g. { showEffects: true }
  });

  return result;
}
