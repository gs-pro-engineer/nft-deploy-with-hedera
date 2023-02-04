import { Hbar, TokenSupplyType ,AccountId } from "@hashgraph/sdk";
// import { AccountId } from "@hashgraph/sdk";
import { Account, ApiSession, Contract, Token, TokenTypes } from '@buidlerlabs/hedera-strato-js';

const convertBigNumberArrayToNumberArray = (array) => array.map(item => item.toNumber());

// Define the constants used in the demo
const nftPriceInHbar = new Hbar(10);
const amountToMint = 5;
// const metadata = "Qmbp4hqKpwNDYjqQxsAAm38wgueSY8U2BSJumL74wyX2Dy";
const metadata = "https://gateway.pinata.cloud/ipfs/QmcocBtbGVy59oRLxvWZD5coo8jTnQWBnwKJaUJvnb5ddj";
const defaultNonFungibleTokenFeatures = {
    decimals: 0,
    initialSupply: 0,
    keys: {
        kyc: null
    },
    maxSupply: 10,
    name: "Aurora Project #1024",
    supplyType: TokenSupplyType.Finite,
    symbol: "COA",
    type: TokenTypes.NonFungibleUnique
};

// Initialize the session
const { session } = await ApiSession.default();

// Create the CreatableEntities and the UploadableEntities
const account = new Account({ maxAutomaticTokenAssociations: 10});
const token = new Token(defaultNonFungibleTokenFeatures);
const contract = await Contract.newFrom({ path: 'NFTShop.sol' });


// console.log(session.client.account.id.toSolidityAddress());
// Build the live counterpart of the entities
// console.log(session.client.state);
// const aliceLiveAccount = await session.create(account);
// console.log(aliceLiveAccount);
// throw new Error("my error message");

// const aliceLiveAccount = session.client.account.id.toSolidityAddress();
const aliceLiveAccount = AccountId.fromString('0.0.34329373').toSolidityAddress();;
// console.log(session)


const liveToken = await session.create(token);
const liveContract = await session.upload(
    contract,
    { _contract: { gas: 200_000 } },
    liveToken,
    session,
    nftPriceInHbar._valueInTinybar,
    metadata
);

// Assign supply control of the token to the live contract
liveToken.assignSupplyControlTo(liveContract);

// Register Solidity triggered events
liveContract.onEvent("NftMint", ({ tokenAddress, serialNumbers }) => {
    console.log("NFTs minted event", tokenAddress, convertBigNumberArrayToNumberArray(serialNumbers));
});

liveContract.onEvent("NftTransfer", ({ tokenAddress, from, to, serialNumbers }) => {
    console.log("NFTs transferred event", tokenAddress, convertBigNumberArrayToNumberArray(serialNumbers), from, to);
});

// Call the Solidity mint function
const serialNumbers = await liveContract.mint(
    {
        amount: new Hbar(nftPriceInHbar.toBigNumber().toNumber() * amountToMint).toBigNumber().toNumber(),
        gas: 1_500_000
    },
    aliceLiveAccount,
    amountToMint
);

console.log("Serial numbers minted by the smart contract", convertBigNumberArrayToNumberArray(serialNumbers));

// Query info for the involved account and contract
// const aliceInfo = await session.getLiveEntityInfo();
const contractInfo = await liveContract.getLiveEntityInfo();
    
// const some = await aliceLiveAccount.deleteEntity({ transferAccountId: '0.0.34329351'})
// console.log(some);
// console.log(`Number of NFTs owned by Alice: ${aliceInfo.ownedNfts.toNumber()}`);
console.log(`HBar balance of contract: ${contractInfo.balance.toBigNumber().toNumber()}`);
