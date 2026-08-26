import type { LoginFormValues } from "../../schemas";

export interface LoginFormProps {
  readonly onSubmit: (values: LoginFormValues) => Promise<void> | void;
  readonly serverError?: string;
}
