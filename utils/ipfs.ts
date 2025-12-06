export const resolveIPFS = (url: string | undefined) => {
  if (!url) return "/placeholder.png"; // 如果没有图片，返回占位图
  if (url.startsWith("ipfs://")) {
    // 使用公共网关，生产环境建议用自己的付费网关 (如 Pinata, Cloudflare)
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  return url; // 如果已经是 http 开头，直接返回
};
