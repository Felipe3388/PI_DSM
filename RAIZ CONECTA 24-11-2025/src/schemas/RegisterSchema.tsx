import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  userType: yup.string().required("Selecione um tipo"),
  cpfCnpj: yup.string().required("Documento é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(5, "Senha deve ter no mínimo 5 caracteres"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], "As senhas devem coincidir")
    .required("Confirmação é obrigatória"),
});