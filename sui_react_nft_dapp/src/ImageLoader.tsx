import "./style.css";
import { Button } from "@radix-ui/themes";

const ImageLoader = () => {
  const handleClick = () => {
    alert("click");
  };

  return (
    <div className="img_loader">
      <Button onClick={handleClick}>Upload Your Image</Button>
      <Button>Mint your Image as NFT</Button>
    </div>
  );
};

export default ImageLoader;
