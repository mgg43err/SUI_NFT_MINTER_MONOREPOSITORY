import { Transaction } from "@mysten/sui/transactions";
import { toB64 } from "@mysten/sui/utils";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { enokiClient } from "./enoki/enoki";
import { networkConfig } from "./networkConfig";

export async function mintNFT(
  name: string,
  url: string,
  nftPackageId: string,
  sender: string,
  network: keyof typeof networkConfig,
) {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

  const tx = new Transaction();

  const contract = `${nftPackageId}::first_smart_contract::mint`;

  tx.moveCall({
    target: contract,
    arguments: [tx.pure.string(name), tx.pure.string(url)],
  });

  tx.setSender(sender);

  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });

  const sponsoredTransaction = await enokiClient.createSponsoredTransaction({
    network,
    transactionKindBytes: toB64(txBytes),
    sender,
    allowedMoveCallTargets: [contract],
    allowedAddresses: [sender],
  });

  return sponsoredTransaction;
}
