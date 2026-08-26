import type { RegisterFormValues } from "../../schemas";

export interface RegisterFormProps {
  readonly onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  readonly serverError?: string;
}
