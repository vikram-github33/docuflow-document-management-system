import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Link,
  Avatar,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signUpUser } from "services/auth.service";
import { Link as RouterLink } from "react-router-dom";
// ── Validation schema ─────────────────────────────────────────────────────────
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  employeeId: yup.string().required("Employee ID is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Phone is required"),
  department: yup.string().required("Department is required"),
  designation: yup.string().required("Designation is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms")
    .required(),
});

type FormValues = yup.InferType<typeof schema>;

// ── Field helper ──────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  name: keyof FormValues;
  type?: string;
  register: any;
  errors: any;
  showToggle?: boolean;
  show?: boolean;
  onToggle?: () => void;
  placeholder?: string;
}

function Field({
  label,
  name,
  type = "text",
  register,
  errors,
  showToggle,
  show,
  onToggle,
  placeholder,
}: FieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={showToggle ? (show ? "text" : "password") : type}
      placeholder={placeholder}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={
        showToggle
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={onToggle}
                    edge="end"
                    tabIndex={-1}
                  >
                    {show ? (
                      <VisibilityOffIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 14 },
        "& .MuiInputLabel-root": { fontSize: 14 },
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      employeeId: "",
      phone: "",
      department: "",
      designation: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      const { confirmPassword, agreeTerms, ...payload } = data;
      console.log("data", data);
      await signUpUser(payload);
      setSuccess(true);
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ??
          "Registration failed. Please try again.",
      );
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f0f4f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            p: 4,
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 56,
              height: 56,
              fontSize: 24,
              fontWeight: 700,
              mx: "auto",
              mb: 2,
            }}
          >
            D
          </Avatar>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Account created!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Your account has been created successfully. Please sign in.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            href="/login"
            disableElevation
            sx={{
              borderRadius: 2.5,
              py: 1.4,
              textTransform: "none",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Go to Sign in
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          maxWidth: 560,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Logo + heading ── */}
        <Box sx={{ textAlign: "center", mb: 3.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
              mb: 2.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#1976d2",
                width: 44,
                height: 44,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              D
            </Avatar>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ letterSpacing: "-0.01em" }}
            >
              DocuFlow
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join your enterprise workspace
          </Typography>
        </Box>

        {/* ── API error ── */}
        {apiError && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, borderRadius: 2 }}
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}

        {/* ── Form ── */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* First name + Last name */}
            <Grid item xs={12} sm={6}>
              <Field
                label="First name"
                name="firstName"
                register={register}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                label="Last name"
                name="lastName"
                register={register}
                errors={errors}
              />
            </Grid>

            {/* Work email (full width) */}
            <Grid item xs={12}>
              <Field
                label="Work email"
                name="email"
                type="email"
                placeholder="you@company.com"
                register={register}
                errors={errors}
              />
            </Grid>

            {/* Employee ID + Phone */}
            <Grid item xs={12} sm={6}>
              <Field
                label="Employee ID"
                name="employeeId"
                register={register}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                label="Phone"
                name="phone"
                register={register}
                errors={errors}
              />
            </Grid>

            {/* Department + Designation */}
            <Grid item xs={12} sm={6}>
              <Field
                label="Department"
                name="department"
                register={register}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                label="Designation"
                name="designation"
                register={register}
                errors={errors}
              />
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }}>
                <Typography variant="caption" color="text.disabled">
                  Security
                </Typography>
              </Divider>
            </Grid>

            {/* Password + Confirm password */}
            <Grid item xs={12} sm={6}>
              <Field
                label="Password"
                name="password"
                register={register}
                errors={errors}
                showToggle
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                label="Confirm password"
                name="confirmPassword"
                register={register}
                errors={errors}
                showToggle
                show={showConfirm}
                onToggle={() => setShowConfirm((p) => !p)}
              />
            </Grid>

            {/* Terms */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register("agreeTerms")}
                    sx={{ color: errors.agreeTerms ? "error.main" : undefined }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color={errors.agreeTerms ? "error" : "text.secondary"}
                  >
                    I agree to the{" "}
                    <Link href="#" underline="hover" sx={{ fontWeight: 500 }}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" underline="hover" sx={{ fontWeight: 500 }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.agreeTerms && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 4, display: "block", mt: -0.5 }}
                >
                  {errors.agreeTerms.message}
                </Typography>
              )}
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disableElevation
                sx={{
                  py: 1.4,
                  borderRadius: 2.5,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Create account
              </LoadingButton>
            </Grid>

            {/* Sign in link */}
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 600,
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default SignupPage;
