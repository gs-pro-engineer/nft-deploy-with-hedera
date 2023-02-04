console.clear();
require("dotenv").config();

const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenInfoQuery,
	TokenType,
	CustomRoyaltyFee,
	CustomFixedFee,
	Hbar,
	TokenSupplyType,
	TokenMintTransaction,
	TokenBurnTransaction,
	TransferTransaction,
	AccountBalanceQuery,
	AccountUpdateTransaction,
	TokenAssociateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();
const adminKey = PrivateKey.generate();
const pauseKey = PrivateKey.generate();
const freezeKey = PrivateKey.generate();
const wipeKey = PrivateKey.generate();

async function main() {
	// DEFINE CUSTOM FEE SCHEDULE
	let nftCustomFee = await new CustomRoyaltyFee()
		.setNumerator(2)
		.setDenominator(10)
		.setFeeCollectorAccountId(treasuryId)
		.setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

	// IPFS CONTENT IDENTIFIERS FOR WHICH WE WILL CREATE NFTs
	CID = [
		{
			account: '0.0.34329373',
			cid :"https://gateway.pinata.cloud/ipfs/QmWUB8SpAd55nNv2YRsm7i18Z2UP1wnRbQ2RmjZQg4mGCm/serial1.json",
			serial : 1,
			pvkey : ''
		},
		{
			account: '0.0.34329373',
			cid : 'https://gateway.pinata.cloud/ipfs/QmWUB8SpAd55nNv2YRsm7i18Z2UP1wnRbQ2RmjZQg4mGCm/serial2.json',
			serial : 2,
			pvkey : '' 
		},
		{
			account: '0.0.34329373',
			cid : 'https://gateway.pinata.cloud/ipfs/QmWUB8SpAd55nNv2YRsm7i18Z2UP1wnRbQ2RmjZQg4mGCm/serial3.json',
			serial : 3,
			pvkey : ''
		},
		{
			account: '0.0.34329373',
			cid : 'https://gateway.pinata.cloud/ipfs/QmWUB8SpAd55nNv2YRsm7i18Z2UP1wnRbQ2RmjZQg4mGCm/serial4.json',
			serial : 4,
			pvkey : ''
		},
		{
			account: '0.0.34329373',
			cid : 'https://gateway.pinata.cloud/ipfs/QmWUB8SpAd55nNv2YRsm7i18Z2UP1wnRbQ2RmjZQg4mGCm/serial5.json',
			serial : 5,
			pvkey : ''
		}
		];

	// CREATE NFT WITH CUSTOM FEE
	let nftCreate = await new TokenCreateTransaction()
		.setTokenName("Aurora Project #11")
		.setTokenSymbol("AP")
		.setTokenType(TokenType.NonFungibleUnique)
		.setDecimals(0)
		.setInitialSupply(0)
		.setTreasuryAccountId(treasuryId)
		.setSupplyType(TokenSupplyType.Finite)
		.setMaxSupply(1000)
		.setCustomFees([nftCustomFee])
		.setAdminKey(adminKey)
		.setSupplyKey(supplyKey)
		// .setPauseKey(pauseKey)
		.setFreezeKey(freezeKey)
		.setWipeKey(wipeKey)
		.freezeWith(client)
		.sign(treasuryKey);

	let nftCreateTxSign = await nftCreate.sign(adminKey);
	let nftCreateSubmit = await nftCreateTxSign.execute(client);
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);
	let tokenId = nftCreateRx.tokenId;
	console.log(`Created NFT with Token ID: ${tokenId} \n`);

	// TOKEN QUERY TO CHECK THAT THE CUSTOM FEE SCHEDULE IS ASSOCIATED WITH NFT
	var tokenInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
	console.table(tokenInfo.customFees[0]);

	// MINT NEW BATCH OF NFTs
nftLeaf=[];
for (var i = 0; i < CID.length; i++) {
		nftLeaf[i] = await tokenMinterFcn(CID[i].cid);
		console.log(`Created NFT ${tokenId} with serial: ${nftLeaf[i].serials[0].low}`);
	} 

	var tokenInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
	console.log(`Current NFT supply: ${tokenInfo.totalSupply} \n`);




for (var i = 0; i < CID.length; i++) {
	const account = AccountId.fromString(CID[i].account);
	const signKey = PrivateKey.fromString(CID[i].pvkey);
	const accountsInfo = await AssociateToken(account,signKey);

	const transferToken = TransferToken(account,CID[i].serial);



}
	



for (var i = 0; i < CID.length; i++) {
	const account = AccountId.fromString(CID[i].account);
	oB = await bCheckerFcn(account);
	
	console.log(`- ${account} balance: ${oB[0]} NFTs of ID:${tokenId} and ${oB[1]}`);
}
	
	



	




	// TOKEN TRANSFER FUNCTION

	async function TransferToken(account,serialNo){

		let tokenTransferTx = await new TransferTransaction()
		.addNftTransfer(tokenId, serialNo, treasuryId, account)
		.freezeWith(client)
		.sign(treasuryKey);
	let tokenTransferSubmit = await tokenTransferTx.execute(client);
	let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
	console.log(`\n NFT transfer Treasury->${account} status: ${tokenTransferRx.status} \n`);	

	}
	



	// TOKEN ASSOCIATE FUNCTION

	async function AssociateToken(account,signKey){
		let associateTx = await new TokenAssociateTransaction()
		.setAccountId(account)
		.setTokenIds([tokenId])
		.freezeWith(client)
		.sign(signKey);
		let associateTxSubmit = await associateTx.execute(client);
		let associateRx = await associateTxSubmit.getReceipt(client);
		console.log(`${account} NFT Manual Association: ${associateRx.status} \n`);
	}
	
	// TOKEN MINTER FUNCTION ==========================================
	async function tokenMinterFcn(CID) {
		mintTx = await new TokenMintTransaction()
			.setTokenId(tokenId)
			.setMetadata([Buffer.from(CID)])
			.freezeWith(client);
		let mintTxSign = await mintTx.sign(supplyKey);
		let mintTxSubmit = await mintTxSign.execute(client);
		let mintRx = await mintTxSubmit.getReceipt(client);
		return mintRx;
	}

	// BALANCE CHECKER FUNCTION ==========================================
	async function bCheckerFcn(id) {
		balanceCheckTx = await new AccountBalanceQuery().setAccountId(id).execute(client);
		return [balanceCheckTx.tokens._map.get(tokenId.toString()), balanceCheckTx.hbars];
	}
}

main();