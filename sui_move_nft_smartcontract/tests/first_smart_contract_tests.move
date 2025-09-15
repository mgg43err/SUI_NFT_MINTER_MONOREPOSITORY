#[test_only]
module first_smart_contract::first_smart_contract_tests {
    use sui::test_scenario::{Self as test, ctx};
    use sui::object::{self, ID};
    use sui::tx_context::{sender};
    use std::string;

    const ENotOwner: u64 = 0;

    #[test]
    fun test_mint() {
        let admin = @0xA;
        let user1 = @0xB;

        let scenario = test::begin(admin);
        {
            let ctx = scenario.ctx();
            first_smart_contract::mint(string::utf8(b"My NFT"), string::utf8(b"http://example.com/my-nft.png"), ctx);
        };

        scenario.next_tx(user1);
        {
            let nft_id = test::pop_event<first_smart_contract::MintNFTEvent>(&scenario).object_id;
            let nft = test::take_from_sender<first_smart_contract::NFT>(&scenario, nft_id);

            assert!(string::bytes_to_string(first_smart_contract::name(&nft).bytes()) == string::utf8(b"My NFT"), 0);
            assert!(string::bytes_to_string(first_smart_contract::url(&nft).bytes()) == string::utf8(b"http://example.com/my-nft.png"), 0);

            test::return_to_sender(&scenario, nft);
        };
        test::end(scenario);
    }
}