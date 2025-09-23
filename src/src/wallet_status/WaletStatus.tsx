import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { NFTList } from "../nft_list/NFTList";
import { Flex, Text, Container, Heading } from "@radix-ui/themes";

export default function WalletStatus() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address as string },
    { enabled: !!account },
  );

  if (!account) return null;
  if (error) return <Flex>Error: {error.message}</Flex>;
  if (isPending || !data) return <Flex>Loading...</Flex>;

  const objectIds = data.data.map((obj) => obj.data?.objectId);

  return (
    <Container my="2" style={{ paddingLeft: "2vw" }}>
      <Flex direction="column" my="2">
        {objectIds.length === 0 ? (
          <Text>No objects owned by the connected wallet</Text>
        ) : (
          <><Heading>Your NFTs</Heading>
            <NFTList objectIds={objectIds} />
          </>
        )}
      </Flex>
    </Container>
  );
}
