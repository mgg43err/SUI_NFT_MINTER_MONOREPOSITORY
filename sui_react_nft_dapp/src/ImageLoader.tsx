import React, { useEffect, useState } from "react";
import "./style.css";
import { Button } from "@radix-ui/themes";
import { mintNFT } from "./mint";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";

const suiClient = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

const STORAGE_KEY = "saved_image_urls_v1";

const ImageLoader: React.FC = () => {
  const { currentWallet } = useCurrentWallet();

  console.log("currentWallet", currentWallet?.accounts[0].address);

  const handleMint = async (url: any, nameNFT: any) => {
    if (!currentWallet) {
      setMessage({ type: "error", text: "Please connect your wallet first." });
      return;
    }
    if (!nameNFT || nameNFT.trim() === "") {
      setMessage({ type: "error", text: "Please enter a name for your NFT." });
      return;
    }
    if (!url || url.trim() === "") {
      setMessage({ type: "error", text: "Please enter a name for your NFT." });
      return;
    }
    try {
      setLoading(true);
      const name = new TextEncoder().encode(nameNFT);
      const urlBytes = new TextEncoder().encode(url);
      console.log(name, urlBytes, mintNFT.toString(), currentWallet);
      const result = await mintNFT(
        name,
        urlBytes,
        currentWallet?.accounts[0],
        suiClient,
      );
      setMessage({ type: "info", text: "NFT minted! Tx: " + result.digest });
    } catch (e) {
      setMessage({
        type: "error",
        text: "Mint failed: " + (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const [imageUrl, setImageUrl] = useState("");
  const [nameNFT, setNameNFT] = useState("");
  const [savedUrls, setSavedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "info" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedUrls(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to read saved urls", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedUrls));
    } catch (err) {
      console.error("Failed to save urls", err);
    }
  }, [savedUrls]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (message) setMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameNFT(e.target.value);
    if (message) setMessage(null);
  };

  const validateImage = (url: string) =>
    new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

  const handleSave = async () => {
    setMessage(null);
    const url = imageUrl.trim();
    if (!url) {
      setMessage({ type: "error", text: "Please paste an image URL." });
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      setMessage({
        type: "error",
        text: "URL must start with http:// or https://.",
      });
      return;
    }
    if (savedUrls.includes(url)) {
      setMessage({ type: "info", text: "URL already saved." });
      setImageUrl("");
      return;
    }

    setLoading(true);
    const ok = await validateImage(url);
    setLoading(false);

    if (!ok) {
      setMessage({
        type: "error",
        text: "Could not load image from that URL (CORS or invalid URL).",
      });
      return;
    }

    setSavedUrls((prev) => [url, ...prev]);
    setImageUrl("");
  };

  const handleDelete = (url: string) => {
    setSavedUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="img_loader">
      <label htmlFor="nftname" className="block mb-2">
        Enter NFT Name
      </label>
      <input
        type="text"
        id="nftname"
        value={nameNFT}
        onChange={handleNameChange}
        placeholder="Enter NFT name..."
        className="border rounded p-2 w-full mb-3"
      />

      <label htmlFor="url" className="block mb-2">
        Upload Your NFT Image
      </label>

      <input
        type="text"
        id="url"
        value={imageUrl}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Paste image URL here..."
        className="border rounded p-2 w-full mb-3"
      />

      <div
        className="flex gap-2 mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "258px",
        }}
      >
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button
          className="flex gap-2 ml-2"
          onClick={() => handleMint(imageUrl, nameNFT)}
          disabled={loading || !currentWallet}
        >
          Mint your Image as NFT
        </Button>
      </div>

      {message && (
        <div
          className={
            message.type === "error"
              ? "text-red-600 mb-3"
              : "text-green-600 mb-3"
          }
        >
          {message.text}
        </div>
      )}

      {savedUrls.length > 0 && (
        <div className="saved-urls">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedUrls.map((url) => (
              <div
                key={url}
                className="border rounded-lg overflow-hidden shadow-sm p-2 flex flex-col items-center"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt="Saved preview"
                    className="w-32 h-32 object-cover rounded-md hover:opacity-80 transition"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='18'%3EImage not available%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </a>

                <div className="flex gap-2 mt-2">
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => window.open(url, "_blank")}
                  >
                    Open
                  </Button>
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => handleDelete(url)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
