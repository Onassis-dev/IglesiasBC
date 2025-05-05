import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const countries = [
  { name: "México", code: "MX", dialCode: "+52" },
  { name: "Estados Unidos", code: "US", dialCode: "+1" },
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Brasil", code: "BR", dialCode: "+55" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Perú", code: "PE", dialCode: "+51" },
  { name: "Venezuela", code: "VE", dialCode: "+58" },
  { name: "España", code: "ES", dialCode: "+34" },
  { name: "Francia", code: "FR", dialCode: "+33" },
  { name: "Italia", code: "IT", dialCode: "+39" },
  { name: "Alemania", code: "DE", dialCode: "+49" },
  { name: "Reino Unido", code: "GB", dialCode: "+44" },
  { name: "Canadá", code: "CA", dialCode: "+1" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Japón", code: "JP", dialCode: "+81" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Rusia", code: "RU", dialCode: "+7" },
  { name: "Sudáfrica", code: "ZA", dialCode: "+27" },
  { name: "Egipto", code: "EG", dialCode: "+20" },
  { name: "Arabia Saudita", code: "SA", dialCode: "+966" },
  { name: "Nigeria", code: "NG", dialCode: "+234" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
  { name: "Pakistán", code: "PK", dialCode: "+92" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Vietnam", code: "VN", dialCode: "+84" },
  { name: "Tailandia", code: "TH", dialCode: "+66" },
  { name: "Corea del Sur", code: "KR", dialCode: "+82" },
  { name: "Malasia", code: "MY", dialCode: "+60" },
  { name: "Singapur", code: "SG", dialCode: "+65" },
  { name: "Nueva Zelanda", code: "NZ", dialCode: "+64" },
  { name: "Suecia", code: "SE", dialCode: "+46" },
  { name: "Noruega", code: "NO", dialCode: "+47" },
  { name: "Dinamarca", code: "DK", dialCode: "+45" },
  { name: "Finlandia", code: "FI", dialCode: "+358" },
  { name: "Países Bajos", code: "NL", dialCode: "+31" },
  { name: "Bélgica", code: "BE", dialCode: "+32" },
  { name: "Suiza", code: "CH", dialCode: "+41" },
  { name: "Austria", code: "AT", dialCode: "+43" },
  { name: "Polonia", code: "PL", dialCode: "+48" },
  { name: "Portugal", code: "PT", dialCode: "+351" },
  { name: "Grecia", code: "GR", dialCode: "+30" },
  { name: "Turquía", code: "TR", dialCode: "+90" },
  { name: "Israel", code: "IL", dialCode: "+972" },
  { name: "Líbano", code: "LB", dialCode: "+961" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Emiratos Árabes Unidos", code: "AE", dialCode: "+971" },
  { name: "Omán", code: "OM", dialCode: "+968" },
  { name: "Jordania", code: "JO", dialCode: "+962" },
  { name: "Bahrein", code: "BH", dialCode: "+973" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
  { name: "Maldivas", code: "MV", dialCode: "+960" },
  { name: "Nepal", code: "NP", dialCode: "+977" },
  { name: "Afganistán", code: "AF", dialCode: "+93" },
  { name: "Kazajistán", code: "KZ", dialCode: "+7" },
  { name: "Uzbekistán", code: "UZ", dialCode: "+998" },
  { name: "Turkmenistán", code: "TM", dialCode: "+993" },
  { name: "Kirguistán", code: "KG", dialCode: "+996" },
  { name: "Tayikistán", code: "TJ", dialCode: "+992" },
  { name: "Mongolia", code: "MN", dialCode: "+976" },
  { name: "Armenia", code: "AM", dialCode: "+374" },
  { name: "Georgia", code: "GE", dialCode: "+995" },
  { name: "Irán", code: "IR", dialCode: "+98" },
  { name: "Iraq", code: "IQ", dialCode: "+964" },
  { name: "Afganistán", code: "AF", dialCode: "+93" },
  { name: "Myanmar", code: "MM", dialCode: "+95" },
];

const PhoneInput = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className}
        >
          {value}
          <ChevronsUpDown className="opacity-50 size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Seleccionar país..." className="h-9" />
          <CommandList>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.dialCode}
                  keywords={[
                    country.name
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, ""),
                    country.dialCode,
                  ]}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <img
                    loading="lazy"
                    src={`/flags/${country.code}.svg`}
                    alt={country.name}
                    className="w-5 rounded-[3px] mr-2"
                  />
                  {country.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {country.dialCode}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PhoneInput;
