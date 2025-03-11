// import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Miguel Angel Ornelas",
    role: "Pastor",
    img: "https://i.pravatar.cc/120?img=12?w=48&q=76",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati debitis exercitationem at similique molestias quia amet minus iusto quibusdam quisquam?",
  },
  {
    name: "Miguel Angel Ornelas",
    role: "Pastor",
    img: "https://i.pravatar.cc/120?img=12?w=48&q=76",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati debitis exercitationem at similique molestias quia amet minus iusto quibusdam quisquam?",
  },
  {
    name: "Miguel Angel Ornelas",
    role: "Pastor",
    img: "https://i.pravatar.cc/120?img=12?w=48&q=76",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati debitis exercitationem at similique molestias quia amet minus iusto quibusdam quisquam?",
  },
  {
    name: "Miguel Angel Ornelas",
    role: "Pastor",
    img: "https://i.pravatar.cc/120?img=12?w=48&q=76",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati debitis exercitationem at similique molestias quia amet minus iusto quibusdam quisquam?",
  },
  {
    name: "Miguel Angel Ornelas",
    role: "Pastor",
    img: "https://i.pravatar.cc/120?img=12?w=48&q=76",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati debitis exercitationem at similique molestias quia amet minus iusto quibusdam quisquam?",
  },
];

const Testimonials = () => (
  <Carousel
    opts={{
      loop: true,

      align: "start",
    }}
  >
    <CarouselContent>
      {testimonials.map((testimonial, i) => (
        <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
          <div className="flex flex-col px-4 py-5 sm:p-6">
            <q className="flex-1 text-muted-foreground">{testimonial.text}</q>
            <div className="mt-6 flex gap-3">
              <span className="inline-flex rounded-full">
                <img
                  className="h-10 w-10 rounded-full"
                  src={testimonial.img}
                  alt={"Picture of " + testimonial.name}
                  loading="lazy"
                />
              </span>
              <div>
                <p className="text-sm font-semibold ">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-foreground" />
    <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-foreground" />
  </Carousel>
);

export default Testimonials;
