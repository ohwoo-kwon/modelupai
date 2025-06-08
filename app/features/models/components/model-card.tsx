import { DotIcon, ShirtIcon } from "lucide-react";
import { Link } from "react-router";

import { bodyTypeObject, raceObject, styleObject } from "../\bconstants";

export default function ModelCard({
  modelId,
  imgUrl,
  name,
  ageRange,
  bodyType,
  race,
  style,
}: {
  modelId: number;
  imgUrl: string;
  name: string;
  ageRange: string;
  bodyType: string;
  race: string;
  style: string;
}) {
  return (
    <div className="flex h-fit flex-col rounded border transition-transform duration-300 hover:scale-105">
      <Link to={`/models/create?${modelId}`}>
        <img className="w-full object-cover" src={imgUrl} alt={name} />
      </Link>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="text-muted-foreground flex items-center text-sm">
            <span>{ageRange}</span>
            <DotIcon size={14} />
            {/* @ts-ignore */}
            <span>{bodyTypeObject[bodyType]}</span>
            <DotIcon size={14} />
            {/* @ts-ignore */}
            <span>{raceObject[race]}</span>
            <DotIcon size={14} />
            {/* @ts-ignore */}
            <span>{styleObject[style]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
