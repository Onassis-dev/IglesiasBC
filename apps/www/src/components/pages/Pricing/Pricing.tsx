import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Line = (text: string) => (
  <li className="flex space-x-3 items-center">
    <Check className="h-4 w-5 text-primary " />
    <span className="text-base text-muted-foreground">{text}</span>
  </li>
);
const pricingCards = (
  prices: number[],
  period: string,
  savings: (number | null)[]
) => (
  <div className="flex gap-10 px-5 md:px-10 justify-center flex-wrap">
    <Card className="w-full min-w-xs max-w-sm">
      <CardContent className="p-6 relative">
        <div>
          {savings[0] && (
            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
              Ahorra ${savings[0]}
            </div>
          )}
          <h2 className="text-2xl font-medium ">Plan Gratuito</h2>
          <p className="mt-2 text-base text-muted-foreground leading-tight">
            Disfruta de funciones básicas
          </p>

          <p className="mt-5 mb-5">
            <span className=" text-5xl font-medium ">${prices[0]}</span>

            <span className="text-base font-medium text-muted-foreground">
              /{period}
            </span>
          </p>

          <a href={import.meta.env.PUBLIC_APP_BASE + "/signup?redirect=/"}>
            <Button className=" w-full text-lg py-1 mb-4 font-medium">
              Registrarse
            </Button>
          </a>
        </div>
        <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">
          Incluye
        </h3>
        <ul role="list" className="mt-4 space-y-3">
          {Line("Registro de 30 personas")}
          {Line("2 usuarios")}
          {Line("Miembros")}
        </ul>
      </CardContent>
    </Card>
    <Card className="w-full min-w-xs max-w-96">
      <CardContent className="p-6 relative">
        <div>
          {savings[1] && (
            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
              Ahorra ${savings[1]}
            </div>
          )}
          <h2 className="text-2xl font-medium ">Plan Base</h2>
          <p className="mt-2 text-base text-muted-foreground leading-tight">
            Crea tu pagina barato hoy mismo!{" "}
          </p>
          <p className="mt-5 mb-5">
            <span className=" text-5xl font-medium">${prices[1]}</span>

            <span className="text-base font-medium text-muted-foreground">
              /{period}
            </span>
          </p>

          <a href={import.meta.env.PUBLIC_APP_BASE + "/signup?redirect=/"}>
            <Button className=" w-full text-lg py-1 mb-4 font-medium">
              Registrarse
            </Button>
          </a>
        </div>
        <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">
          Incluye
        </h3>
        <ul role="list" className="mt-4 space-y-3">
          {Line("Registro de 100 personas")}
          {Line("10 usuarios")}
          {Line("Miembros")}
          {Line("Certificados")}
          {Line("Pagina web")}
          {Line("Blog")}
        </ul>
      </CardContent>
    </Card>
    <Card className="w-full min-w-xs max-w-sm">
      <CardContent className="p-6 relative">
        <div>
          {savings[2] && (
            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
              Ahorra ${savings[2]}
            </div>
          )}
          <h2 className="text-2xl font-medium ">Plan Avanzado</h2>
          <p className="mt-2 text-base text-muted-foreground leading-tight">
            Obtén beneficios y servicios extra{" "}
          </p>

          <p className="mt-5 mb-5">
            <span className=" text-5xl font-medium ">${prices[2]}</span>

            <span className="text-base font-medium text-muted-foreground">
              /{period}
            </span>
          </p>

          <a href={import.meta.env.PUBLIC_APP_BASE + "/signup?redirect=/"}>
            <Button className=" w-full text-lg py-1 mb-4 font-medium">
              Registrarse
            </Button>
          </a>
        </div>
        <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">
          Incluye
        </h3>
        <ul role="list" className="mt-4 space-y-3">
          {Line("Registro de 300 personas")}
          {Line("20 usuarios")}
          {Line("Miembros")}
          {Line("Certificados")}
          {Line("Pagina web")}
          {Line("Blog")}
          {Line("Finanzas")}
          {Line("Inventario")}
          {Line("Presentaciones")}
        </ul>
      </CardContent>
    </Card>
  </div>
);

const Pricing = () => {
  return (
    <Tabs defaultValue="anual">
      <TabsList className="w-72 grid grid-cols-2 mx-auto mb-10">
        <TabsTrigger className="trigger" value="mensual">
          Mensual
        </TabsTrigger>
        <TabsTrigger className="trigger" value="anual">
          Anual <span className="ml-2 text-cyan">-16%</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent className="data-[state=active]:" value="mensual">
        {pricingCards([0, 199, 399], "mes", [null, null, null])}
      </TabsContent>
      <TabsContent value="anual">
        {pricingCards([0, 1990, 3990], "año", [null, 390, 790])}
      </TabsContent>
    </Tabs>
  );
};

export default Pricing;
