import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { LoginForm, type LoginFormValues } from "@/features/auth";
import { useAuth } from "@/context/auth-context";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  async function handleSubmit({ email, password }: LoginFormValues) {
    setServerError("");
    try {
      await login(email, password);
      toast.success("Sesión iniciada");
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "No se pudo iniciar sesión.";
      setServerError(message);
      toast.error(message);
    }
  }

  return <LoginForm onSubmit={handleSubmit} serverError={serverError} />;
}
