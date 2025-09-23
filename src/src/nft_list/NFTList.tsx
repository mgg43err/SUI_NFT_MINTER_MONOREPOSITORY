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
    <div
      style={{
        display: "flex",
        marginTop: "20px",
        flexWrap: "wrap", // 👈 makes items move to next row
        gap: "20px",
      }}
    >
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
                alignItems: "center",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {nft.data.content.fields.url && (
                <img
                  src={nft.data.content.fields.url}
                  alt="NFT"
                  width={200}
                  className="w-32 h-32 object-cover mt-2"
                />
              )}
              <p>{nft.data.content.fields.name}</p>
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
