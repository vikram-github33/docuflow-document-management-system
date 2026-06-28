import * as yup from "yup";

export const registerSchema = yup.object({
  firstName: yup.string().required("First name is required"),

  lastName: yup.string().required("Last name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  employeeId: yup.string().optional(),

  phone: yup.string().optional(),

  department: yup.string().optional(),

  designation: yup.string().optional(),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});
