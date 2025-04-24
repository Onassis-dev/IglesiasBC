import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "¿Necesito ser experto en tecnología?",
    answer:
      "No. IglesiasBC está diseñado para ser fácil de usar, incluso si no tienes experiencia técnica.",
  },
  {
    question: "¿Puedo acceder desde mi celular?",
    answer:
      "Sí. Puedes usar IglesiasBC desde cualquier dispositivo con internet, incluyendo tu celular.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Usamos tecnología en la nube con respaldos automáticos para proteger tu información y que siempre este disponible para ti.",
  },
  {
    question: "Quien puede ver mis datos?",
    answer:
      "Puedes dar acceso a cada modulo por separado a cada persona que necesites. Por ejemplo dar acceso a finanzas e inventario a tu tesorero, tu decides quien puede ver cada cosa. Nadie mas puede ver tus datos sin tu permiso.",
  },
];

export function FAQs() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {questions.map((question, index) => (
        <AccordionItem
          value={`question-${index}`}
          className="border rounded-md px-4"
        >
          <AccordionTrigger>{question.question}</AccordionTrigger>
          <AccordionContent>{question.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
