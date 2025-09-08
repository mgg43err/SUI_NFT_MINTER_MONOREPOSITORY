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


