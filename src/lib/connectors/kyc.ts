// Mock KYC / AML connector

export interface KYCResult {
  userId: string;
  verified: boolean;
  riskScore: number; // 0-100
  timestamp: string;
}

/**
 * Simulate a KYC check for a user
 * @param userId string
 * @returns Promise<KYCResult>
 */
export async function verifyUserKYC(userId: string): Promise<KYCResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Random result for demo purposes
  const verified = Math.random() > 0.2; // 80% chance verified
  const riskScore = Math.floor(Math.random() * 50); // 0-50 low risk

  return {
    userId,
    verified,
    riskScore,
    timestamp: new Date().toISOString(),
  };
}
