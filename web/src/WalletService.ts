import ServiceBase from "./ServiceBase";
import {
  SearchRequest,
  SearchResponse,
  TrinsicOptions,
  UniversalWalletDefinition,
} from "./proto";
import * as proto from "./proto";

import type { Client as BrowserClient } from "nice-grpc-web";

export class WalletService extends ServiceBase {
  client: BrowserClient<typeof UniversalWalletDefinition>;

  constructor(options?: TrinsicOptions) {
    super(options);

    this.client = this.createClient(UniversalWalletDefinition);
  }

  public async searchWallet(
    request: SearchRequest = SearchRequest.fromPartial({
      query: "SELECT c.id, c.type, c.data FROM c OFFSET 0 LIMIT 100",
    }),
  ): Promise<SearchResponse> {
    return this.search(request);
  }
// BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
// target: /home/runner/work/sdk/sdk/web/src/WalletService.ts

  /** Retrieve an item from the wallet with a given item identifier */
  public async getItem(request: proto.GetItemRequest): Promise<proto.GetItemResponse> {
    
    return this.client.getItem(request, {
      metadata: await this.buildMetadata(proto.GetItemRequest.encode(request).finish())
    });
  }
  /** Search the wallet using a SQL syntax */
  public async search(request: proto.SearchRequest): Promise<proto.SearchResponse> {
    
    return this.client.search(request, {
      metadata: await this.buildMetadata(proto.SearchRequest.encode(request).finish())
    });
  }
  /** Insert an item into the wallet */
  public async insertItem(request: proto.InsertItemRequest): Promise<proto.InsertItemResponse> {
    
    return this.client.insertItem(request, {
      metadata: await this.buildMetadata(proto.InsertItemRequest.encode(request).finish())
    });
  }
  /** Update an item in the wallet */
  public async updateItem(request: proto.UpdateItemRequest): Promise<proto.UpdateItemResponse> {
    
    return this.client.updateItem(request, {
      metadata: await this.buildMetadata(proto.UpdateItemRequest.encode(request).finish())
    });
  }
  /** Delete an item from the wallet permanently */
  public async deleteItem(request: proto.DeleteItemRequest): Promise<proto.DeleteItemResponse> {
    
    return this.client.deleteItem(request, {
      metadata: await this.buildMetadata(proto.DeleteItemRequest.encode(request).finish())
    });
  }
  /** Delete a wallet and its credentials */
  public async deleteWallet(request: proto.DeleteWalletRequest): Promise<proto.DeleteWalletResponse> {
    
    return this.client.deleteWallet(request, {
      metadata: await this.buildMetadata(proto.DeleteWalletRequest.encode(request).finish())
    });
  }
  /** Create a new wallet and generate an auth token for access */
  public async createWallet(request: proto.CreateWalletRequest): Promise<proto.CreateWalletResponse> {
    
    return this.client.createWallet(request, {
      metadata: await this.buildMetadata(proto.CreateWalletRequest.encode(request).finish())
    });
  }
  /** Retrieve wallet details and configuration */
  public async getWalletInfo(request: proto.GetWalletInfoRequest): Promise<proto.GetWalletInfoResponse> {
    
    return this.client.getWalletInfo(request, {
      metadata: await this.buildMetadata(proto.GetWalletInfoRequest.encode(request).finish())
    });
  }
  /** Retrieve wallet details and configuration about the currently authenticated wallet */
  public async getMyInfo(): Promise<proto.GetMyInfoResponse> {
    let request = proto.GetMyInfoRequest.fromPartial({});
    return this.client.getMyInfo(request, {
      metadata: await this.buildMetadata(proto.GetMyInfoRequest.encode(request).finish())
    });
  }
  /** Retrieve information from an ecosystem wallet by searching for its external identity (email or phone) */
  public async getWalletFromExternalIdentity(request: proto.GetWalletFromExternalIdentityRequest): Promise<proto.GetWalletFromExternalIdentityResponse> {
    
    return this.client.getWalletFromExternalIdentity(request, {
      metadata: await this.buildMetadata(proto.GetWalletFromExternalIdentityRequest.encode(request).finish())
    });
  }
  /** Generate new token for a given wallet and add it to the collection of known auth tokens.
* This endpoint requires authentication and will return a new token ID and auth token.
* Use this endpoint if you want to authorize another device, without having to share your
* existing auth token. */
  public async generateAuthToken(request: proto.GenerateAuthTokenRequest): Promise<proto.GenerateAuthTokenResponse> {
    
    return this.client.generateAuthToken(request, {
      metadata: await this.buildMetadata(proto.GenerateAuthTokenRequest.encode(request).finish())
    });
  }
  /** Revokes a previously issued auth token and updates the collection of known auth tokens.
* This endpoint requires authentication. */
  public async revokeAuthToken(request: proto.RevokeAuthTokenRequest): Promise<proto.RevokeAuthTokenResponse> {
    
    return this.client.revokeAuthToken(request, {
      metadata: await this.buildMetadata(proto.RevokeAuthTokenRequest.encode(request).finish())
    });
  }
  /** Add new external identity to the current wallet, such as email, sms, ethereum address, etc.
* This identity ownership must be confirmed using `AddIdentityConfirm` via OTP, signature, etc. */
  public async addExternalIdentityInit(request: proto.AddExternalIdentityInitRequest): Promise<proto.AddExternalIdentityInitResponse> {
    
    return this.client.addExternalIdentityInit(request, {
      metadata: await this.buildMetadata(proto.AddExternalIdentityInitRequest.encode(request).finish())
    });
  }
  /** Confirm identity added to the current wallet using `AddExternalIdentityInit` */
  public async addExternalIdentityConfirm(request: proto.AddExternalIdentityConfirmRequest): Promise<proto.AddExternalIdentityConfirmResponse> {
    
    return this.client.addExternalIdentityConfirm(request, {
      metadata: await this.buildMetadata(proto.AddExternalIdentityConfirmRequest.encode(request).finish())
    });
  }
  /** Remove an external identity from the current wallet */
  public async removeExternalIdentity(request: proto.RemoveExternalIdentityRequest): Promise<proto.RemoveExternalIdentityResponse> {
    
    return this.client.removeExternalIdentity(request, {
      metadata: await this.buildMetadata(proto.RemoveExternalIdentityRequest.encode(request).finish())
    });
  }
  /** Sign-in to an already existing wallet, using an identity added that was previously registered
* This endpoint does not require authentication, and will return a challenge to be signed or verified */
  public async authenticateInit(request: proto.AuthenticateInitRequest): Promise<proto.AuthenticateInitResponse> {
    
    return this.client.authenticateInit(request, {
      metadata: await this.buildMetadata(proto.AuthenticateInitRequest.encode(request).finish())
    });
  }
  /** Confirm sign-in to an already existing wallet and return authentication token */
  public async authenticateConfirm(request: proto.AuthenticateConfirmRequest): Promise<proto.AuthenticateConfirmResponse> {
    
    return this.client.authenticateConfirm(request, {
      metadata: await this.buildMetadata(proto.AuthenticateConfirmRequest.encode(request).finish())
    });
  }
  /** Resend previous authentication code */
  public async authenticateResendCode(request: proto.AuthenticateResendCodeRequest): Promise<proto.AuthenticateResendCodeResponse> {
    
    return this.client.authenticateResendCode(request, {
      metadata: await this.buildMetadata(proto.AuthenticateResendCodeRequest.encode(request).finish())
    });
  }
  /** List all wallets in the ecosystem */
  public async listWallets(request: proto.ListWalletsRequest): Promise<proto.ListWalletsResponse> {
    
    return this.client.listWallets(request, {
      metadata: await this.buildMetadata(proto.ListWalletsRequest.encode(request).finish())
    });
  }
  /** List credentials which match a given verification template */
  public async listByVerificationTemplate(request: proto.ListByVerificationTemplateRequest): Promise<proto.ListByVerificationTemplateResponse> {
    
    return this.client.listByVerificationTemplate(request, {
      metadata: await this.buildMetadata(proto.ListByVerificationTemplateRequest.encode(request).finish())
    });
  }
// END Code generated by protoc-gen-trinsic. DO NOT EDIT.
}
