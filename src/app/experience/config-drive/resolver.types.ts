export type Role = "supplier" | "approver" | "finance";

export interface ResolverContext {
  role: Role;
  model: Record<string, unknown>;
}
