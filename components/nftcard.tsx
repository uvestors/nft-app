import { Sparkles } from "lucide-react";
import ArtPlaceholder from "./artPlaceholder";
import clsx from "clsx";

const NFTCard = ({
  data,
  onClick,
}: {
  onClick: (data: TokenMetadata) => void;
  data: TokenMetadata;
}) => {
  return (
    <div
      className="group bg-white rounded-6 p-2.5 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 flex flex-col h-full hover:-translate-y-1 rounded-lg cursor-pointer"
      onClick={() => onClick(data)}
    >
      <div className="relative w-full aspect-square rounded-[20px] overflow-hidden mb-4">
        <ArtPlaceholder type={data.imageType} color={data.color} />
        <div className="absolute top-3 right-3">
          <div
            className={clsx(
              data.status.toUpperCase() === "STAKED"
                ? "bg-[#2563eb]"
                : "bg-black",
              "flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg backdrop-blur-sm bg-opacity-90"
            )}
          >
            {data.status.toUpperCase() === "STAKED" && (
              <Sparkles size={10} fill="currentColor" />
            )}
            {data.status.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="px-1.5 pb-2 grow flex flex-col justify-between ">
        <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
          Meter NFT #{data.token_id}
        </h3>
      </div>
    </div>
  );
};

export default NFTCard;
