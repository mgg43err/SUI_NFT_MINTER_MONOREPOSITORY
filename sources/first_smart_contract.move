module 0x0::first_smart_contract;

public struct FIRST_SMART_CONTRACT has drop {}

public struct MY_COIN has drop {}

fun init(_witness: FIRST_SMART_CONTRACT, ctx: &mut sui::tx_context::TxContext) {
    let (treasury, metadata) = sui::coin::create_currency<MY_COIN>(
        MY_COIN {},
        6,
        b"MY_COIN",
        b"",
        b"",
        option::none(),
        ctx,
    );
    sui::transfer::public_freeze_object(metadata);
    sui::transfer::public_transfer(treasury, sui::tx_context::sender(ctx))
}

public fun mint(
    treasury_cap: &mut sui::coin::TreasuryCap<MY_COIN>,
    amount: u64,
    recipient: address,
    ctx: &mut sui::tx_context::TxContext,
) {
    let coin = sui::coin::mint<MY_COIN>(treasury_cap, amount, ctx);
    sui::transfer::public_transfer(coin, recipient)
}
