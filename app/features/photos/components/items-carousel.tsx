import { Card, CardContent } from "~/core/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/core/components/ui/carousel";

export default function ItemCarousel({ items }: { items: string[] }) {
  return (
    <Carousel className="mx-auto w-[calc(100%-100px)]">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={`item_${index}`}>
            <img src={item} alt={`item_${index}`} className="rounded" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
