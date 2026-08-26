import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { RegisterForm, type RegisterFormValues } from "@/features/auth";
import { useAuth } from "@/context/auth-context";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  async function handleSubmit({ email, password }: RegisterFormValues) {
    setServerError("");
    try {
      await register(email, password);
      toast.success("Cuenta creada. Iniciá sesión.");
      navigate("/login");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "No se pudo crear la cuenta.";
      setServerError(message);
      toast.error(message);
    }
  }

  return <RegisterForm onSubmit={handleSubmit} serverError={serverError} />;
}
