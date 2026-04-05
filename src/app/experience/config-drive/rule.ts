import { ResolverContext } from "./resolver.types";

export type Rule = (ctx: ResolverContext) => boolean;

export const isSupplier: Rule = (ctx) => ctx.role === "supplier";
export const isApprover: Rule = (ctx) => ctx.role === "approver";
export const isFinance: Rule = (ctx) => ctx.role === "finance";

export const or =
  (...rules: Rule[]): Rule =>
  (ctx) =>
    rules.some((rule) => rule(ctx));

export const and =
  (...rules: Rule[]): Rule =>
  (ctx) =>
    rules.every((rule) => rule(ctx));

export const not =
  (rule: Rule): Rule =>
  (ctx) =>
    !rule(ctx);
