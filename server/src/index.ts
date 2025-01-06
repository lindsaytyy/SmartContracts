import express, { Request, Response } from 'express';
import cors from 'cors';
import { createMerkleTree, generateProof } from './merkle';

const app = express();
app.use(express.json());
app.use(cors());

// 白名单地址列表
const whitelist: string[] = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];

// 创建Merkle树
const tree = createMerkleTree(whitelist);
const root = tree.getRoot().toString('hex');

console.log('Merkle Root:', root);

// API端点：获取Merkle根哈希
app.get('/api/root', (_req: Request, res: Response) => {
    res.json({ root });
});

// API端点：为特定地址生成证明
app.post('/api/proof', (req: Request, res: Response) => {
    const address = req.body.address;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    const proof = generateProof(tree, address);
    if (!proof) {
        return res.status(400).json({ error: 'Address not in whitelist' });
    }

    res.json({ proof });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));