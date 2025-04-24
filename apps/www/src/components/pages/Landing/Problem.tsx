import { Check, X } from "lucide-react";

export function Problem() {
  return (
    <>
      <div className="grid reverse sm:grid-cols-2 gap-8 mb-16 items-center">
        <div className="sm:order-2">
          <span className="text-sm border-orange-200 border rounded-full px-2 py-0.5 bg-orange-background text-orange font-medium">
            El problema
          </span>
          <h2 className="text-5xl font-medium mt-1 mb-5">
            Administrar una iglesia es dificil
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-2">
              <X className="size-4 text-orange" />
              <span>Las herramientas son muy costosas</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4 text-orange" />
              <span>Toma mucho tiempo aprender a usar cada herramienta</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4 text-orange" />
              <span>Acceder a tus datos es dificil y tardado</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="size-4 text-orange" />
              <span>Organizar a tus miembros es dificil</span>
            </li>
          </ul>
        </div>
        <img
          src="/problem.webp"
          alt="Problem"
          className="rounded-md sm:order-1"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-sm border-green-200 border rounded-full px-2 py-0.5 bg-green-background text-green font-medium">
            La solución
          </span>
          <h2 className="text-5xl font-medium mt-1 mb-5">
            Usa la mejor herramienta para tu iglesia
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-green" />
              <span>Economica y accesible para todo tipo de iglesias</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-green" />
              <span>Facil de usar y aprender</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-green" />
              <span>Datos centralizados en un solo lugar</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-green" />
              <span>Diseño moderno y profesional</span>
            </li>
          </ul>
        </div>
        <img src="/solution.webp" alt="Problem" className="rounded-md" />
      </div>
    </>
  );
}
