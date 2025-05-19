import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppWindow,
  Archive,
  DollarSign,
  FileBadge,
  MessageSquareQuote,
  Presentation,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";

type Feature = {
  id: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  iconColor: string;
  img: string;
};

const features: Feature[] = [
  {
    id: "miembros",
    icon: Users2,
    label: "Miembros",
    title: "Toda la información de tus miembros en un solo lugar",
    description:
      "Registra y consulta fácilmente a todos los miembros de tu congregación. Accede a estadísticas de crecimiento, lista de cumpleaños del mes y contáctalos rápidamente por llamada o WhatsApp.",
    iconColor: "text-purple",
    img: "/screenshots/members.webp",
  },
  {
    id: "certificados",
    icon: FileBadge,
    label: "Certificados",
    title: "Genera certificados personalizados",
    description:
      "Crea certificados con diseño profesional en segundos, sin necesidad de conocimientos de diseño. Perfectos para toda ocasión, listos para imprimir o compartir.",
    iconColor: "text-cyan",
    img: "/screenshots/certificates.webp",
  },
  {
    id: "pagina-web",
    icon: AppWindow,
    label: "Página web",
    title: "Tu iglesia en internet",
    description:
      "Crea una página web profesional en minutos. Solo llena la información de tu iglesia y publica eventos, horarios, redes sociales, predicaciones y más, sin conocimientos técnicos.",
    iconColor: "text-gray",
    img: "/screenshots/website.webp",
  },
  {
    id: "blog",
    icon: MessageSquareQuote,
    label: "Blog",
    title: "Comparte reflexiones y noticias",
    description:
      "Publica artículos, devocionales y comunicados para mantener a tu congregación informada e inspirada toda la semana. Fácil de usar y pensado para todos.",
    iconColor: "text-orange",
    img: "/screenshots/blog.webp",
  },
  {
    id: "presentaciones",
    icon: Presentation,
    label: "Presentaciones",
    title: "Presentaciones para tus servicios",
    description:
      "Diseña presentaciones para tus servicios en minutos. Proyecta letras de cantos, versículos y mensajes con un panel rápido e intuitivo.",
    iconColor: "text-pink",
    img: "/screenshots/presentations.webp",
  },
  {
    id: "finanzas",
    icon: DollarSign,
    label: "Finanzas",
    title: "Control financiero claro y simple",
    description:
      "Administra los ingresos y egresos de la iglesia con facilidad. Clasifica movimientos por categoría y genera reportes automáticos para mantener finanzas transparentes.",
    iconColor: "text-green",
    img: "/screenshots/finances.webp",
  },
  {
    id: "inventario",
    icon: Archive,
    label: "Inventario",
    title: "Gestiona el inventario de la iglesia",
    description:
      "Lleva el control de los bienes físicos de tu iglesia como mobiliario, equipo de sonido, biblias y más, todo en un solo lugar.",
    iconColor: "text-yellow",
    img: "/screenshots/inventory.webp",
  },
];

export function Features() {
  useEffect(() => {
    features.forEach((feature) => {
      const img = new Image();
      img.src = feature.img;
    });
  }, []);

  return (
    <Tabs defaultValue="miembros" className="w-full">
      <TabsList className="grid grid-cols-7 h-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="flex flex-col items-center gap-1"
            >
              <Icon className={`size-4 mt-1 ${feature.iconColor}`} />
              <span className="hidden lg:block">{feature.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <Card className="mt-4 p-2 sm:p-8">
        {features.map((feature) => (
          <TabsContent
            key={feature.id}
            value={feature.id}
            className="m-0 grid sm:grid-cols-[2fr_4fr] gap-2 justify-items-end"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-6">
                {feature.title}
              </h3>
              {feature.description}
            </div>
            <img
              src={feature.img}
              alt={feature.title}
              className="self-end sm:h-96 rounded-lg border"
            />
          </TabsContent>
        ))}
      </Card>
    </Tabs>
  );
}
