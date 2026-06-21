import type {
  CreateClientFormData,
  UpdateClientFormData,
} from "../../types"

export interface ClientFormProps {
  initialData?: CreateClientFormData & { id?: number }
  onSubmit: (
    data: CreateClientFormData | UpdateClientFormData,
  ) => Promise<void>
  isLoading?: boolean
}
