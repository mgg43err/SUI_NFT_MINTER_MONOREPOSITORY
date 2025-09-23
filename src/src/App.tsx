import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { MintNftComponent } from "./MintNftComponent";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import WalletStatus from "./wallet_status/WaletStatus";

function App() {
  const currentAccount = useCurrentAccount();
  const location = useLocation();

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>NFT Minter</Heading>

          <br />

          {currentAccount && (
            <Flex
              className="tabs"
              justify={"between"}
              style={{ width: "400px" }}
            >
              {location.pathname !== "/create-nft" && (
                <Link to="/create-nft">
                  <Button variant={"solid"}>Create NFT</Button>
                </Link>
              )}

              {location.pathname !== "/explore-nft" && (
                <Link to="/explore-nft">
                  <Button variant={"solid"}>Explore NFTs</Button>
                </Link>
              )}
            </Flex>
          )}
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            <Routes>
              <Route path="/" element={<WalletStatus />} />
              <Route path="/create-nft" element={<MintNftComponent />} />
              <Route path="/explore-nft" element={<WalletStatus />} />
            </Routes>
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;
