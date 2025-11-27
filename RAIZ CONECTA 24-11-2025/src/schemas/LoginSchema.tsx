import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("O usuário é obrigatório")
    .max(20, "O usuário deve ter no máximo 20 caracteres"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(5, "A senha deve ter no mínimo 5 caracteres")
    .max(20, "A senha deve ter no máximo 20 caracteres"),
});