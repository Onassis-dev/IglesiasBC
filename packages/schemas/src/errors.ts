import { z } from "zod";

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    return {
      message:
        issue.minimum === 1
          ? `Requerido`
          : `El texto debe tener al menos ${issue.minimum} caracter(es)`,
    };
  }

  if (
    issue.code === z.ZodIssueCode.invalid_type &&
    (issue.received === "undefined" || issue.received === "null")
  ) {
    return {
      message: `Requerido`,
    };
  }

  if (
    issue.code === z.ZodIssueCode.invalid_string &&
    issue.validation === "regex"
  ) {
    return {
      message: `Numero invalido`,
    };
  }

  if (
    issue.code === z.ZodIssueCode.invalid_string &&
    issue.validation === "date"
  ) {
    return {
      message: `Fecha inválida`,
    };
  }

  if (
    issue.code === z.ZodIssueCode.invalid_string &&
    issue.validation === "email"
  ) {
    return {
      message: `Correo invalido`,
    };
  }

  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "nan") {
    return {
      message: `Numero inválido`,
    };
  }

  if (issue.code === z.ZodIssueCode.invalid_date) {
    return {
      message: `Fecha inválida`,
    };
  }
  return { message: ctx.defaultError };
};
