export type HealthCheckStatus = "ok" | "down";

export interface HealthCheckResult {
  database: HealthCheckStatus;
}

export type HealthRepository = {
  checkDatabase(): Promise<HealthCheckStatus>;
};

export class CheckHealthUseCase {
  constructor(private readonly health: HealthRepository) {}

  async execute(): Promise<HealthCheckResult> {
    const database = await this.health.checkDatabase();
    return { database };
  }
}
