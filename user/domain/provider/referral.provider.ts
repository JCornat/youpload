export interface ReferralProvider {
  generate(): Promise<string>;
}
