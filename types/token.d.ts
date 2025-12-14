interface TokenMetadata {
  tokenId: string;
  result: string;
  imageType: string;
  color: string;
  status: "HELD" | "STAKED";
}

interface NftAttribute {
  trait_type: string;
  value: string | number;
}

interface NftMetadata extends TokenMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
}
