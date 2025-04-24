import { Button } from "@/components/ui/button";

const Cta = () => {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <h2 className="font-medium mb-5 sm:mb-10 text-5xl">
          ¿Listo para comenzar?
        </h2>
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row px-4">
          <Button className="w-full sm:w-auto" asChild>
            <a href="#">Pruebalo gratis</a>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <a href="#">Agendar una demostración</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Cta };
