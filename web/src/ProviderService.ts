import ServiceBase from "./ServiceBase";
import * as proto from "./proto";

import type { Client as BrowserClient } from "nice-grpc-web";
import { Base64 } from "js-base64";

export class ProviderService extends ServiceBase {
    client: BrowserClient<typeof proto.ProviderDefinition>;

    constructor(options?: proto.TrinsicOptions) {
        super(options);

        this.client = this.createClient(proto.ProviderDefinition);
    }

    public async createEcosystem(
        request: proto.CreateEcosystemRequest,
    ): Promise<proto.CreateEcosystemResponse> {
        const response =
            request.name?.trim() || request.details?.email?.trim()
                ? await this.client.createEcosystem(request, {
                      metadata: await this.buildMetadata(
                          proto.CreateEcosystemRequest.encode(request).finish(),
                      ),
                  })
                : await this.client.createEcosystem(request);

        const authToken = Base64.fromUint8Array(
            proto.AccountProfile.encode(response.profile!).finish(),
            true,
        );
        this.options.authToken = authToken;
        return response;
    }
// BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
// target: /home/runner/work/sdk/sdk/web/src/ProviderService.ts

  /** Returns the public key being used to create/verify oberon tokens */
  public async getOberonKey(): Promise<proto.GetOberonKeyResponse> {
    let request = proto.GetOberonKeyRequest.fromPartial({});
    return this.client.getOberonKey(request, {
      metadata: await this.buildMetadata()
    });
  }
  /** Upgrade a wallet's DID from `did:key` to another method */
  public async upgradeDID(request: proto.UpgradeDidRequest): Promise<proto.UpgradeDidResponse> {
    
    return this.client.upgradeDID(request, {
      metadata: await this.buildMetadata(proto.UpgradeDidRequest.encode(request).finish())
    });
  }
  /** Search for issuers/providers/verifiers in the current ecosystem */
  public async searchWalletConfigurations(request: proto.SearchWalletConfigurationsRequest): Promise<proto.SearchWalletConfigurationResponse> {
    
    return this.client.searchWalletConfigurations(request, {
      metadata: await this.buildMetadata(proto.SearchWalletConfigurationsRequest.encode(request).finish())
    });
  }
// END Code generated by protoc-gen-trinsic. DO NOT EDIT.
}
