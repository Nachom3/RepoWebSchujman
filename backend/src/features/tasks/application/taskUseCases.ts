export type TaskStatusValue = "PENDIENTE" | "EN_PROCESO" | "TERMINADA" | "ATRASADA";

export type TaskRecord = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: TaskStatusValue;
  stage: string | null;
  startDate: Date | null;
  endDate: Date | null;
  completedAt: Date | null;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = {
  projectId: number;
  title: string;
  description?: string;
  status?: TaskStatusValue;
  stage?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  progress?: number;
};

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "projectId">>;

export type TasksRepository = {
  create(input: CreateTaskInput): Promise<TaskRecord>;
  list(input: { projectId?: number; status?: TaskStatusValue }): Promise<TaskRecord[]>;
  findById(id: number): Promise<TaskRecord | null>;
  update(id: number, input: UpdateTaskInput): Promise<TaskRecord>;
  delete(id: number): Promise<TaskRecord>;
  projectExists(id: number): Promise<boolean>;
};

export class TaskNotFoundError extends Error {
  constructor() {
    super("Task not found");
  }
}

export class TaskProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
  }
}

export class CreateTaskUseCase {
  constructor(private readonly tasks: TasksRepository) {}

  async execute(input: CreateTaskInput): Promise<TaskRecord> {
    if (!(await this.tasks.projectExists(input.projectId))) {
      throw new TaskProjectNotFoundError();
    }
    return this.tasks.create(input);
  }
}

export class ListTasksUseCase {
  constructor(private readonly tasks: TasksRepository) {}

  execute(input: { projectId?: number; status?: TaskStatusValue }): Promise<TaskRecord[]> {
    return this.tasks.list(input);
  }
}

export class GetTaskUseCase {
  constructor(private readonly tasks: TasksRepository) {}

  async execute(id: number): Promise<TaskRecord> {
    const task = await this.tasks.findById(id);
    if (!task) {
      throw new TaskNotFoundError();
    }
    return task;
  }
}

export class UpdateTaskUseCase {
  constructor(private readonly tasks: TasksRepository) {}

  async execute(id: number, input: UpdateTaskInput): Promise<TaskRecord> {
    try {
      return await this.tasks.update(id, input);
    } catch {
      throw new TaskNotFoundError();
    }
  }
}

export class DeleteTaskUseCase {
  constructor(private readonly tasks: TasksRepository) {}

  async execute(id: number): Promise<TaskRecord> {
    try {
      return await this.tasks.delete(id);
    } catch {
      throw new TaskNotFoundError();
    }
  }
}
