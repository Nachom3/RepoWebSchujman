import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock, Mail, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { registerSchema, type RegisterFormValues } from "../../schemas";
import { AuthHeader } from "../AuthHeader";
import { AuthPageShell } from "../AuthPageShell";
import type { RegisterFormProps } from "./RegisterForm.types";

export function RegisterForm({ onSubmit, serverError }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  async function handleSubmit(values: RegisterFormValues) {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.handleSubmit(handleSubmit)(event);
  }

  return (
    <AuthPageShell>
      <Card
        surface="solid"
        padding="none"
        className="w-full !rounded-2xl !p-8 sm:!p-10 shadow-xl"
      >
        <AuthHeader
          icon={UserPlus}
          eyebrow="Registro"
          title="Creá tu cuenta"
          subtitle="Empezá con una experiencia segura y simple."
        />

        <Form {...form}>
          <form className="space-y-5" onSubmit={onFormSubmit} noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="nombre@empresa.com"
                        className="h-11 pl-10 pr-4 py-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="h-11 pl-10 pr-4 py-3 text-sm"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError ? (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="pt-2">
              <Button
                type="submit"
                variant="accent"
                disabled={loading}
                className="w-full rounded-lg font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent-foreground hover:text-accent transition-all"
          >
            Iniciá sesión
          </Link>
        </div>
      </Card>
    </AuthPageShell>
  );
}
