// Blockchain: https://www.youtube.com/watch?v=zVqczFZr124
    // Issue: if you temper with one block and you rehash all blocks after, your blockchain is valid
    // Answer: Proof of Work mechanism (mining) so that it takes too much time to rehash everything because it needs a lot of computing power
    // Essential for safety of the blockchain
// Proof of Work: https://www.youtube.com/watch?v=HneatE69814

const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index + 
            this.previousHash +
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce).toString();
    }

    mineBlock(difficulty) {
        // Block has to start with an amount of zeros (= difficulty)
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK NO." + this.index + ": " + this.hash)
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5; // Bitcoin difficulty = 10
    }

    createGenesisBlock() {
        return new Block(0, "03/01/2009", "Genesis block", "0"); // Bitcoin release date
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

} 

let ephecCoin = new Blockchain();

console.log('Mining block 1...')
ephecCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
console.log("Is blockchain valid: " + ephecCoin.isChainValid());

console.log('Mining block 2...')
ephecCoin.addBlock(new Block(2, "12/07/2017", { amount: 10 }));

// console.log(JSON.stringify(ephecCoin, null, 4));
console.log("Is blockchain valid: " + ephecCoin.isChainValid());

// ephecCoin.chain[1].data = { amount:100 };
// ephecCoin.chain[1].hash = ephecCoin.chain[1].calculateHash();

// console.log("Is blockchain valid: " + ephecCoin.isChainValid());
