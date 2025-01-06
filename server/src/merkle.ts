import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';

export function createMerkleTree(whitelist: string[]): MerkleTree {
    const leaves = whitelist.map(addr => keccak256(addr));
    return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

export function generateProof(tree: MerkleTree, address: string): string[] | null {
    const leaf = keccak256(address);
    const proof = tree.getProof(leaf);
    return proof.length > 0 ? proof.map(node => `0x${node.data.toString('hex')}`) : null;
}