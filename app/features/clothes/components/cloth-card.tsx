import { Link } from "react-router";

import { clothingCategoryObject } from "../constants";

export default function ClothCard({
  clothId,
  imgUrl,
  name,
  category,
}: {
  clothId: number;
  imgUrl: string;
  name: string;
  category: string;
}) {
  return (
    <Link
      to={`/clothes/${clothId}`}
      className="flex h-fit flex-col rounded border transition-transform duration-300 hover:scale-105"
    >
      <img className="w-full object-cover" src={imgUrl} alt={name} />
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="text-muted-foreground flex items-center text-sm">
            {/* @ts-ignore */}
            <span>{clothingCategoryObject[category]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
