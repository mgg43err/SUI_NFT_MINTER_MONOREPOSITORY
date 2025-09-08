import { Transaction } from "@mysten/sui/transactions";

export async function mintNFT(
  name: Uint8Array<ArrayBufferLike>,
  url: Uint8Array<ArrayBufferLike>,
  wallet: any,
) {
  const tx = new Transaction();

  const packageId = `0xc8a6247cb83f54b648f9502a1ad5f63b6874cf60cc7b4b7082fbb2df0a287b5a`;

  tx.moveCall({
    target: `0xc8a6247cb83f54b648f9502a1ad5f63b6874cf60cc7b4b7082fbb2df0a287b5a::first_smart_contract::mint_to_sender`,
    arguments: [
      tx.pure(name), // serializes strings automatically
      tx.pure(url),
    ],
  });

  const result = await wallet.signAndExecuteTransaction({
    transaction: tx,
  });

  return result;
}
