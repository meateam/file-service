import { ServerUnaryCall } from 'grpc';
import { IQuota } from './quota.interface';
import { QuotaService } from './quota.service';

export class QuotaMethods {

  public static async GetOwnerQuota(call: ServerUnaryCall<{ ownerID: string }>):
      Promise<{ownerID: string, limit: number, used: number}> {

    const ownerID: string = call.request.ownerID;
    const quota: IQuota = await QuotaService.getByOwnerID(ownerID);
    return quota;
  }
  public static async IsAllowedToGetQuota(call: ServerUnaryCall<{ requestingUser: string, ownerID: string }>):
      Promise<{ allowed: boolean }> {

    const requestingUser: string = call.request.requestingUser;
    const ownerID: string = call.request.ownerID;
    const allowed: boolean = await QuotaService.isAllowedToGetQuota(requestingUser, ownerID);
    return { allowed };
  }
}
