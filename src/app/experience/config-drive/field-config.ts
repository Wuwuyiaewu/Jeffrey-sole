// field-config.ts
import { Rule, isApprover, isFinance, isSupplier, or } from "./rule";

export interface FieldRuleConfig {
  customStyle?: Record<string, string>;
  visible: Rule;
  readOnly: Rule;
}

export const fieldRuleConfig: Record<string, FieldRuleConfig> = {
  productAmt: {
    customStyle: { width: "150px" },
    visible: or(isSupplier, isApprover, isFinance),
    readOnly: or(isApprover, isFinance),
  },
  decision: {
    customStyle: { width: "200px" },
    visible: isApprover,
    readOnly: or(isSupplier, isFinance),
  },
};
