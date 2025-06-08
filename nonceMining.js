// nonceMining.js
const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = '';
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        console.log(`⛏️  Mining Block ${this.index} (Difficulty: ${difficulty})...`);
        const startTime = Date.now();
        let attemptCount = 0;
        const targetPrefix = '0'.repeat(difficulty);
        
        while (true) {
            attemptCount++;
            this.hash = this.calculateHash();
            
            if (this.hash.startsWith(targetPrefix)) {
                const endTime = Date.now();
                const elapsed = (endTime - startTime) / 1000;
                
                console.log(`✅ Block mined in ${elapsed.toFixed(2)} seconds`);
                console.log(`🔁 Attempts: ${attemptCount.toLocaleString()}`);
                console.log(`🔒 Final Hash: ${this.hash}`);
                return;
            }
            
            this.nonce++;
        }
    }
}

class Blockchain {
    constructor(difficulty = 2) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        const genesis = new Block(0, '2023-01-01', 'Genesis Block', '0');
        genesis.hash = genesis.calculateHash();
        return genesis;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // IMPORTANT: This method was missing in previous versions
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verify current block's hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Verify link to previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

function testMining(difficultyLevels) {
    for (const difficulty of difficultyLevels) {
        console.log(`\n==============================`);
        console.log(`🚀 STARTING MINING TEST (Difficulty: ${difficulty})`);
        console.log(`==============================`);
        
        const miningChain = new Blockchain(difficulty);
        
        // Add blocks with mining
        miningChain.addBlock(new Block(1, Date.now(), { amount: 5 }));
        miningChain.addBlock(new Block(2, Date.now(), { amount: 10 }));
        
        // Now using the fixed method
        console.log(`\n💎 BLOCKCHAIN VALID: ${miningChain.isChainValid()}`);
    }
}

// Test with increasing difficulty
testMining([2, 3, 4]);