import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function ExpiredAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      setIsOpen(true);
      setIsLoading(false);
      return;
    }

    const verifyForm = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_API_BASE}/forms/${id}`
        );
        if (!response.ok) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error verifying form link:", error);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyForm();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-md"
      >
        <div className="flex flex-col items-center text-center p-6 gap-4">
          <AlertTriangle className="size-12 text-destructive" />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Enlace Inválido o Expirado
            </DialogTitle>
            <DialogDescription className="text-center">
              El enlace para este formulario es inválido o ha expirado. Por
              favor, contacta a la administración para obtener uno nuevo si es
              necesario.
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}
