const MEMES = [
  {
    id: 'meme-btc-1',
    title: 'Bitcoin to the moon',
    text: 'Me watching BTC after I finally bought the dip',
    imageUrl: 'https://i.imgflip.com/1bij.jpg',
    relatedAssets: ['BTC'],
  },
  {
    id: 'meme-btc-2',
    title: 'HODL',
    text: 'Bitcoin down 20%. Me: This is fine.',
    imageUrl: 'https://i.imgflip.com/26am.jpg',
    relatedAssets: ['BTC'],
  },
  {
    id: 'meme-eth-1',
    title: 'Ethereum gas fees',
    text: 'Wanted to send $5 of ETH. Gas fee: $47.',
    imageUrl: 'https://i.imgflip.com/3oevdk.jpg',
    relatedAssets: ['ETH'],
  },
  {
    id: 'meme-eth-2',
    title: 'ETH merge survivor',
    text: 'ETH holders after surviving every "flippening" prediction',
    imageUrl: 'https://i.imgflip.com/4t0m5.jpg',
    relatedAssets: ['ETH'],
  },
  {
    id: 'meme-doge-1',
    title: 'Much wow',
    text: 'Such coin. Much returns. Very Elon.',
    imageUrl: 'https://i.imgflip.com/1e7ql7.jpg',
    relatedAssets: ['DOGE'],
  },
  {
    id: 'meme-sol-1',
    title: 'Solana speed',
    text: 'SOL transactions vs ETH transactions',
    imageUrl: 'https://i.imgflip.com/2gnfme.jpg',
    relatedAssets: ['SOL'],
  },
  {
    id: 'meme-general-1',
    title: 'Crypto portfolio check',
    text: 'My portfolio at 3am vs 9am',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    relatedAssets: ['GENERAL'],
  },
  {
    id: 'meme-general-2',
    title: 'Altcoin season',
    text: 'When alts finally pump and you sold last week',
    imageUrl: 'https://i.imgflip.com/1otk96.jpg',
    relatedAssets: ['GENERAL'],
  },
  {
    id: 'meme-general-3',
    title: 'Buy high sell low',
    text: 'Financial advice from crypto Twitter in a nutshell',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    relatedAssets: ['GENERAL'],
  },
];

function getRandomMeme(selectedAssets = []) {
  const matching = MEMES.filter(meme =>
    meme.relatedAssets.some(asset => selectedAssets.includes(asset))
  );

  const pool = matching.length > 0 ? matching : MEMES.filter(m => m.relatedAssets.includes('GENERAL'));

  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { getRandomMeme };
