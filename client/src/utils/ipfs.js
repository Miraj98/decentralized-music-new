const IPFS_CLIENT = require('ipfs-mini');
const ipfs = new IPFS_CLIENT({ host: 'localhost', port: 5001, protocol: 'http' });

export function addToIpfs(messageToAdd) {
    return ipfs.add(messageToAdd)
}

export async function getDataFromIpfs(hash, callback) {
    return ipfs.cat(hash, callback)
}