import { api } from "@/lib/boilerplate";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { z } from "zod";
import { DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { showPromise } from "@/lib/showFunctions.tsx";
import { Button, RegisterButton } from "@/components/ui/button";
import { ClassSchema, useClassSchema } from "./classes.models";


import { useQuery } from "@tanstack/react-query";
import { useQueryStore } from "@/lib/store";

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const ClassesForm = ({ id, open, setOpen }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const classForm = useClassSchema();

    const { data: item } = useQuery(
        {
            queryKey: ["class", id],
            queryFn: async () => (await api.get(`/classes/${id}`)).data,
            initialData: {},
            enabled: !!id,
        }
    );

    const handleSubmit = async (values: z.infer<typeof ClassSchema>) => {
        if (id) {
            await api.put("/classes", values);
        } else {
            await api.post("/classes", values);
        }
        client.refetchQueries({ queryKey: ["classes"] });
        setOpen(false);
    };

    useEffect(() => {
        console.log(item);
        if (item) {
            classForm.setValue("id", item.id);
            classForm.setValue("title", item.title);
        }
    }, [item]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <RegisterButton>Registrar clase</RegisterButton>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>{id ? "Actualizar clase" : "Registrar nueva clase"}</DialogTitle>
                </DialogHeader>

                <Form {...classForm}>
                    <form onSubmit={classForm.handleSubmit((values: z.infer<typeof ClassSchema>) => showPromise(handleSubmit(values), id ? "Información actualizada" : "Clase registrada"))} className="flex flex-col gap-x-6">
                        <FormField
                            control={classForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="col-span-2" type="submit">
                            Registrar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ClassesForm;
