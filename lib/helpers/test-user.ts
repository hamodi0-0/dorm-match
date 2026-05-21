export const TEST_ACCOUNT_EMAIL = "test@dormr.app";
export const TEST_ACCOUNT_PASSWORD = "DormrTest123!";

export function isTestAccount(email?: string | null): boolean {
  return email === TEST_ACCOUNT_EMAIL;
}
