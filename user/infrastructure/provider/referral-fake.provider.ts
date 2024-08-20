import {ReferralProvider} from "../../domain/provider/referral.provider.ts";

export class ReferralFakeProvider implements ReferralProvider{
  async generate(): Promise<string> {
    return '';
  }
}