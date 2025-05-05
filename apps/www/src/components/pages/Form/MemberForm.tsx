import { PostMemberSchema } from "@iglesiasbc/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "@/components/ui/phone-input";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import DatePicker from "@/components/ui/DatePicker";
import { formatToUTC } from "@/lib/timeFunctions";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const defaultValues: z.infer<typeof PostMemberSchema> = {
  name: "",
  cellphone: "",
  baptized: "",
  email: "",
  genre: "",
  civilStatus: "",
  positionId: "",
  birthday: "",
  joinDate: "",
  countryCode: "+52",
};

const positions = [
  { id: 1, value: "Miembro" },
  { id: 2, value: "Visitante" },
  { id: 3, value: "Pastor" },
  { id: 4, value: "Pastor principal" },
  { id: 7, value: "Miembro inactivo" },
  { id: 8, value: "Miembro con actividades" },
];

export default function MemberForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const membersForm = useForm<z.infer<typeof PostMemberSchema>>({
    resolver: zodResolver(PostMemberSchema),
    defaultValues: defaultValues,
  });

  const submit = membersForm.handleSubmit(
    (values: z.infer<typeof PostMemberSchema>) => {
      if (!values.cellphone) values.countryCode = null;
      setLoading(true);
      handleSubmit(values);
    }
  );

  const handleSubmit = async (values: z.infer<typeof PostMemberSchema>) => {
    const body = {
      ...values,
      birthday: formatToUTC(values.birthday) || values.birthday,
      joinDate: formatToUTC(values.joinDate) || values.joinDate,
      id,
    };

    const response = await fetch(
      import.meta.env.PUBLIC_API_BASE + "/forms/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error("Failed to submit form");
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="p-4 py-10 flex flex-col items-center gap-2">
        <Check className="size-10 text-green-500 bg-green-50 border border-green-500 rounded-full p-1" />
        <p className="text-sm max-w-md text-center">Gracias por tu registro.</p>
      </Card>
    );
  }

  return (
    <Form {...membersForm}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <FormField
          control={membersForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={membersForm.control}
          name="baptized"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bautizado(a)</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"true"}>Bautizado(a)</SelectItem>
                    <SelectItem value={"false"}>No bautizado(a)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={membersForm.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={membersForm.control}
          name="civilStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado civil</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casado">Casado</SelectItem>
                    <SelectItem value="Soltero">Soltero</SelectItem>
                    <SelectItem value="Divorciado">Divorciado</SelectItem>
                    <SelectItem value="Comprometido">Comprometido</SelectItem>
                    <SelectItem value="Unión libre">Unión libre</SelectItem>
                    <SelectItem value="Viuda">Viuda</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={membersForm.control}
          name="positionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((v: any) => (
                      <SelectItem key={v.id} value={v.id?.toString()}>
                        {v.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={membersForm.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={membersForm.control}
          name="joinDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de membresia</FormLabel>
              <FormControl>
                <DatePicker field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            Teléfono
            <span className="text-xs text-muted-foreground"> (opcional)</span>
          </FormLabel>
          <div className="flex w-full">
            <FormField
              control={membersForm.control}
              name="countryCode"
              render={({ field }) => (
                <FormControl>
                  <PhoneInput
                    value={field.value || "+52"}
                    onChange={field.onChange}
                    className="pl-2 pr-1 w-[4rem] justify-end rounded-r-none"
                  />
                </FormControl>
              )}
            />
            <FormField
              control={membersForm.control}
              name="cellphone"
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="rounded-l-none border-l-0"
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
        </FormItem>

        <FormField
          control={membersForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Correo{" "}
                <span className="text-xs text-muted-foreground">
                  (opcional)
                </span>
              </FormLabel>
              <FormControl>
                <Input value={field.value || ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
