import hashlib
import time
import json

class Block:
    def __init__(self, index, previous_hash, timestamp, transactions, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.transactions = transactions
        self.hash = hash

class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(0, "0", time.time(), [], self.calculate_hash(0, "0", time.time(), []))
        self.chain.append(genesis_block)

    def calculate_hash(self, index, previous_hash, timestamp, transactions):
        value = str(index) + str(previous_hash) + str(timestamp) + str(json.dumps(transactions))
        return hashlib.sha256(value.encode()).hexdigest()

    def add_block(self, transactions):
        previous_block = self.chain[-1]
        index = previous_block.index + 1
        timestamp = time.time()
        hash = self.calculate_hash(index, previous_block.hash, timestamp, transactions)
        block = Block(index, previous_block.hash, timestamp, transactions, hash)
        self.chain.append(block)
        return block

blockchain = Blockchain()