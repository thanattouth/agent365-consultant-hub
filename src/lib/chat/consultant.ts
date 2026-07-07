import { getChatAnswerProvider } from "./providers";
import type { DraftConsultantResponse, DraftConsultantResponseInput } from "./providers/types";

export async function draftConsultantResponse(
  input: DraftConsultantResponseInput,
): Promise<DraftConsultantResponse> {
  const provider = getChatAnswerProvider();

  return provider.draftResponse(input);
}
