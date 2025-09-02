import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export function NFTList({ objectIds }) {
  const suiClient = useSuiClient();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNFTs() {
      setLoading(true);
      try {
        const results = await suiClient.multiGetObjects({
          ids: objectIds,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
            showDisplay: true,
          },
        });
        setNfts(results);
      } finally {
        setLoading(false);
      }
    }
    if (objectIds.length) fetchNFTs();
  }, [objectIds, suiClient]);

  if (loading) return <div>Loading NFTs...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {nfts
        .filter((el) => el.data.content.fields.url)
        .map((nft) =>
          nft.data ? (
            <div
              key={nft.data.objectId}
              className="border rounded-lg p-3 shadow-sm"
              style={{
                border: "1px solid #8f548fff",
                margin: "10px 20px",
                width: "201px",
              }}
            >
              <p>{nft.data.content.fields.name}</p>
              {nft.data.content.fields.url && (
                <img
                  src={nft.data.content.fields.url}
                  alt="NFT"
                  width={200}
                  className="w-32 h-32 object-cover mt-2"
                />
              )}
            </div>
          ) : (
            <div key={Math.random()} className="border rounded p-3">
              <p>⚠️ Object not found or deleted</p>
            </div>
          ),
        )}
    </div>
  );
}
