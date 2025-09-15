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

  console.log("name", name, "urlBytes", url);

  tx.moveCall({
    target: `0xd5a2abd42ea59914d83375873e8447544295bd0e5832350522bad79f8446a891::first_smart_contract::mint`,
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
