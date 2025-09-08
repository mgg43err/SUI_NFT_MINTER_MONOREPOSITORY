module 0x0::first_smart_contract;

use std::string;
use sui::event;
use sui::url::{Self, Url};

public struct NFT has key, store {
    id: UID,
    name: string::String,
    url: Url,
}

public struct MintNFTEvent has copy, drop {
    object_id: ID,
    creator: address,
    name: string::String,
}

entry fun mint(name: vector<u8>, url: vector<u8>, ctx: &mut TxContext) {
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        url: url::new_unsafe_from_bytes(url),
    };
    let sender = tx_context::sender(ctx);
    event::emit(MintNFTEvent {
        object_id: object::uid_to_inner(&nft.id),
        creator: sender,
        name: nft.name,
    });
    transfer::public_transfer(nft, sender);
}

public fun name(nft: &NFT): &string::String {
    &nft.name
}

public fun url(nft: &NFT): &Url {
    &nft.url
}

//  #[test]
//     fun test_mint_and_view_functions() {
//         let ctx = tx_context::new_for_testing();
//         let name = b"Test NFT";
//         let url = b"https://example.com";
//         mint(name, url, &mut ctx);

//         // Fetch the NFT object (assuming only one NFT exists for this test)
//         let sender = tx_context::sender(&ctx);
//         let nfts = object::owned<NFT>(sender);
//         assert!(vector::length(&nfts) == 1, 0);

//         let nft = vector::borrow(&nfts, 0);

//         // Test name and url view functions
//         assert!(*name(nft) == string::utf8(name), 1);
//         assert!(*url(nft) == url::new_unsafe_from_bytes(url), 2);
//     }

//     #[test]
//     fun test_mint_event_emitted() {
//         let ctx = tx_context::new_for_testing();
//         let name = b"Event NFT";
//         let url = b"https://event.com";
//         mint(name, url, &mut ctx);

//         // Check that the MintNFTEvent was emitted
//         let events = event::all<MintNFTEvent>();
//         assert!(vector::length(&events) == 1, 0);
//         let event = vector::borrow(&events, 0);
//         assert!(*name == event.name, 1);
//     }
