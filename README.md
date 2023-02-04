# Hedera Strato NFT Contract interactions showcase

```
Created a new stated strato-client of type 'Hedera'
Creating a new Hedera Account
A new 'ECDSA' key has been created: 3030020100300706052b8104000a04220420bce8fec6f301d2b2cea46944da41fee7154266295a847db3152774ea23efe6e5 . Copy it since this is only time you'll see it.
Successfully created Account id 0.0.1001
Creating a new Hedera Token
Successfully created Token id 0.0.1002
Uploading a new NFTShop-Contract to Hedera File Service (HFS).
Uploaded content to HFS resulting in file id 0.0.1003
Appending the remaining content with a total of 1 file-append transactions.
Done appending. Content has been successfully uploaded and is available at HFS id 0.0.1003
Successfully created a NFTShop-Contract id 0.0.1004.
NFTs minted, ["0x00000000000000000000000000000000000003EA",[1,2,3,4,5]]
NFTs transfered, ["0x00000000000000000000000000000000000003EA",[1,2,3,4,5],"0x0000000000000000000000000000000000000002","0x00000000000000000000000000000000000003e9"]
Serial numbers minted by the smart contract, [[1,2,3,4,5]]
Number of NFTs owned by Alice: 5
HBar balance of contract: 50
```

## Firing it up

Before diving in, just make sure you have a [node CLI](https://nodejs.org/en/download/) version `>=16` installed then do the normal
```
git clone https://github.com/buidler-labs/hedera-strato-demo.git
npm install
```
to fetch the repo and its dependencies.

Lastly, you will need to define a local `.env` file providing some values for the library to work with. Please see the [`.env.sample`](./.env.sample) for info and further details. If you are using a `testnet` account, the minimum required `.env` defined values should look quite similar to:

```
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0...
HEDERA_OPERATOR_KEY=91132178...
```

If you don't know how to create a free testnet account, you can create one on [the Hedera Portal](https://portal.hedera.com/). 

Then, you can simply run the example by doing a `npm start` call. 

**And that's it!** You managed to successfully compile, upload and execute a the NFT Example on the Hedera network. Happy coding!