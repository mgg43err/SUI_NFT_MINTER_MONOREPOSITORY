module 0x0::first_smart_contract;

use std::string;
use sui::event;

public struct NFT has key, store {
    id: UID,
    name: string::String,
    url: string::String,
}

public struct MintNFTEvent has copy, drop {
    object_id: ID,
    creator: address,
    name: string::String,
}

entry fun mint(name: string::String, url: string::String, ctx: &mut TxContext) {
    let nft = NFT {
        id: object::new(ctx),
        name: name,
        url: url,
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

public fun url(nft: &NFT): &string::String {
    &nft.url
}
