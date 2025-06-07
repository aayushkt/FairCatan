import { Resource } from "../GameState/Board";
import { GameState } from "../GameState/GameState";
import { Player } from "../GameState/Player";

// TODO: Trades aren't limited to one resource, i.e. you can
// have a trade that is 1 brick and 1 wood for 2 sheep, etc.
export class Trade {
    readonly initiator: Player;
    readonly recipient: Player;
    readonly wantResource: Resource;
    readonly giveResource: Resource;
    readonly wantAmount: number;
    readonly giveAmount: number;
    constructor(initiator: Player, recipient: Player, wantResource: Resource, giveResource: Resource, wantAmount: number, giveAmount: number) {
        this.initiator = initiator;
        this.recipient = recipient;
        this.wantResource = wantResource;
        this.giveResource = giveResource;
        this.wantAmount = wantAmount;
        this.giveAmount = giveAmount;
    }

    IsExactSame(otherTrade: Trade): boolean {
        return this.initiator == otherTrade.initiator
        && this.recipient == otherTrade.recipient
        && this.wantResource == otherTrade.wantResource
        && this.giveResource == otherTrade.giveResource
        && this.wantAmount == otherTrade.wantAmount
        && this.giveAmount == otherTrade.giveAmount;
    }

    IsMirrorTrade(otherTrade: Trade): boolean {
        return this.initiator == otherTrade.recipient
        && this.recipient == otherTrade.initiator
        && this.wantResource == otherTrade.giveResource
        && this.giveResource == otherTrade.wantResource
        && this.wantAmount == otherTrade.giveAmount
        && this.giveAmount == otherTrade.wantAmount;
    }

    IsPossibleTrade(): boolean {
        return this.initiator.resources[this.giveResource] >= this.giveAmount && this.recipient.resources[this.wantResource] >= this.wantAmount;
    }
}

// TODO: need to implement checks to make sure that trades are only done during the either recipient's or initiatior's turn
export function PlaceOffer(gameState: GameState, player: Player, trade: Trade): string {
    if (player != trade.initiator) return `You must be the initiator to place an offer`;
    if (!trade.IsPossibleTrade()) return `This trade is not possible as one or more players don't have the required resources`;
    for (const existingTrade of gameState.activeTradeOffers) {
        if (existingTrade.IsExactSame(trade)) return `That trade is already on the table`;
        if (existingTrade.IsMirrorTrade(trade)) return AcceptOffer(gameState, player, existingTrade);
    }
    gameState.activeTradeOffers.push(trade);
    return `Added your trade to the active offers`;
}

export function CancelOffer(gameState: GameState, player: Player, trade: Trade): string {
    if (player != trade.initiator) return `You can only cancel trades you initiated. If you are the recipient, use DeclineOffer instead`;
    gameState.activeTradeOffers = gameState.activeTradeOffers.filter(offer => !offer.IsExactSame(trade));
    return `Cancelled offer`;
}

// TODO: need to implement checks to make sure that trades are only done during the either recipient's or initiatior's turn
export function AcceptOffer(gameState: GameState, player: Player, trade: Trade): string {
    if (player != trade.recipient) return `You must be the recipient to accept an offer`;
    const lenBeforeRemoving = gameState.activeTradeOffers.length;
    gameState.activeTradeOffers = gameState.activeTradeOffers.filter(offer => !offer.IsExactSame(trade));
    if (lenBeforeRemoving == gameState.activeTradeOffers.length) return `No matching placed trade offer was found to accept`;
    // impossible trades should never be in the activeTradeOffers array, as this is checked after every action being run 
    // in UpdateStateAfterRunningAction(), but this is an additional sanity check
    if (!trade.IsPossibleTrade()) return `This trade is not possible as one or more players don't have the required resources`;
    trade.initiator.resources[trade.giveResource] -= trade.giveAmount;
    trade.initiator.resources[trade.wantResource] += trade.wantAmount;
    trade.recipient.resources[trade.giveResource] += trade.giveAmount;
    trade.recipient.resources[trade.wantResource] -= trade.wantAmount;
    return `Trade accepted`;
}

export function DeclineOffer(gameState: GameState, player: Player, trade: Trade): string {
    if (player != trade.recipient) return `You can only decline offers if you are the recipient. Did you mean to CancelOffer() instead?`;
    gameState.activeTradeOffers = gameState.activeTradeOffers.filter(offer => !offer.IsExactSame(trade));
    return `Offer declined`;
}