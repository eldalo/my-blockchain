const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
  constructor(data) {
    this.hash = null;
    this.height = 0;
    this.body = Buffer.from(JSON.stringify(data).toString('hex'));
    this.time = 0;
    this.previousBlockHash = null;
  }

  validate() {
    const self = this;
    return new Promise((resolve, reject) => {
      const currentHash = self.hash;
      self.hash = SHA256(JSON.stringify({ ...self, hash: null })).toString();

      if (currentHash !== self.hash) {
        return resolve(false);
      }
      resolve(true);
    });
  }

  getBlockData() {
    const self = this;
    return new Promise((resolve, reject) => {
      const encodedBody = self.body;
      const decodedBody = hex2ascii(encodedBody);
      const data = JSON.parse(decodedBody);

      if (data === 'Genesis Block') {
        reject(new Error('This is the Genesis Block'));
      }
      resolve(data);
    });
  }

  toString() {
    const { hash, height, body, time, previousBlockHash } = this;
    return `Block =>
        hash: ${hash}
        height: ${height}
        body: ${body}
        time: ${time}
        previousBlockHash: ${previousBlockHash}
        -------------------------------------`;
  }
}

module.exports = Block;
