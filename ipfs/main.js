import { createHelia } from 'helia';
import { json } from '@helia/json';
import { CID } from 'multiformats'
import { unixfs } from '@helia/unixfs';
import { MemoryBlockstore, BaseBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import fs from 'fs';
import { bootstrap } from '@libp2p/bootstrap';
import { create as createKuboClient } from 'kubo-rpc-client';
import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing';
import { delegatedContentRouting } from '@libp2p/delegated-content-routing';
import { identifyService } from 'libp2p/identify';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';

// const usingKuboClient = async () => {
// 	const kubo = createKuboClient({ host: '127.0.0.1', port: '5001', protocol: 'http' });
// 	const cid = await kubo.add(fs.readFileSync("./smol.png"));
	
// 	console.log(cid);
// }

// const usingHelia = async () => {
// 	const blockstore = new MemoryBlockstore();
//   const datastore = new MemoryDatastore();
//   const libp2p = await createLibp2p({
//     datastore,
//     addresses: {
//       listen: [
//         '/ip4/127.0.0.1/tcp/0'
//       ]
//     },
//     transports: [
//       tcp()
//     ],
//     connectionEncryption: [
//       noise()
//     ],
//     streamMuxers: [
//       yamux()
//     ],
//     peerDiscovery: [
//       bootstrap({
//         list: [
// 					'/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWFmXzCE6PtBPPhJciPGHnrARbcpvPkZ9dCpfufKPurLcZ',
//           '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
//           '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
//           '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//           '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
//         ]
//       })
//     ],
//     services: {
//       identify: identifyService()
//     }
//   })
	
// 	const helia = await createHelia({ datastore, blockstore, libp2p });
// 	const f = unixfs(helia);
// 	const cid = await f.addBytes(fs.readFileSync("./smol.png"));
	
// 	console.log(`Added file: ${cid.toString()}`);
// }

// usingKuboClient();
// usingHelia();


import fs from 'fs';
import { create as createKuboClient } from 'kubo-rpc-client';

const drinks = [
	["QmcM1rESgb6sJPtPRjzM3Q5kTD7EtrDCK3XnF4FMNAmNGX", "7 UP"],
	["QmWwqsi4c2p9nm58tkHWby2fQ6iQcpaVtR1XNFpQyKDQvc", "A&W"],
	["QmTSLgrjVz6PwP6irpsKDYkh1frvz3Z5hrcojkojYqhnQK", "Coca-cola"],
	["QmRJuHkmkrhSAT8XBgiPxXZjdJ6yfACqPdsLK2NNvjRR4L", "Dr Pepper"],
	["QmZPBDcqyeCfcx3Vhb7Kh5jTFfX6ZFo38ma2oAVGZYx6D5", "Fanta"],
	["Qmf4HUyLzySzSBBL2JHJyvCAFjda2jBv3nrd1LBCmtDVco", "Jolly Cola"],
	["Qmc8RKUTfnZWKDBKg46M2SVSchFukKtbC4zEkVfQkLJr36", "Kickapoo"],
	["Qmb5AVY3dHxuyns2PFJF8Le7e1Jxjzn2m2yTiw9ru32GhH", "Pepsi"],
	["QmRhiA1jH7JiMNS2VJPkYJ7BS2gFHgMaPumPuT3JhfFX1d", "Sarsi"],
	["QmRAdDCJcY2veJunLxyGjkusUaMVBh8jqQ6QsaiP7JKoQU", "Sprite"],
]

const usingKuboClient = async () => {
	const kubo = createKuboClient({ host: '127.0.0.1', port: '5001', protocol: 'http' });
	
	const cids = [];
	for (const drink of drinks) {
		const metadata = {
			path: drink[1],
			content: JSON.stringify({ name: drink[1], image: drink[0] })
		};
		const { cid } = await kubo.add(metadata);
		console.log(cid);
		
		cids.push(cid.toString());
	}
	
	fs.writeFileSync("./cids.json", JSON.stringify(cids));
}

usingKuboClient();