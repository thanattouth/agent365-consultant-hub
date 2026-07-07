export type GuardrailStatus = "pass" | "review" | "block";

export type RiskFlag =
  | "prompt_injection"
  | "secret_request"
  | "permission_bypass"
  | "destructive_admin_action"
  | "licensing_certainty"
  | "production_risk";

export type GuardrailResult = {
  status: GuardrailStatus;
  riskFlags: RiskFlag[];
  requiresHumanReview: boolean;
  guidance: string[];
};
