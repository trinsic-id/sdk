// This is overridden by the `browser` field in package.json for web
import { Hashing, Oberon, OkapiMetadata } from "@trinsic/okapi-node";
import { AccountProfile } from "./proto/services/account/v1/account";

export async function blake3HashRequest(
  requestData: Uint8Array
): Promise<Uint8Array> {
  let requestHash = new Uint8Array();
  if (requestData.length > 0) {
    let hashResponse = await Hashing.blake3Hash({ data: requestData });
    requestHash = hashResponse.digest;
  }
  return requestHash;
}

export async function oberonProofRequest(profile: AccountProfile, nonceUint8: Uint8Array): Promise<Uint8Array> {
    let proof = await Oberon.createProof({
        data: profile.authData,
        nonce: nonceUint8,
        token: profile.authToken,
        blinding: [],
    });
    return proof.proof;
}

export async function unblindOberon(cloned: AccountProfile, securityCode: Uint8Array) {
    return await Oberon.unblindToken({
      token: cloned.authToken,
      blinding: [securityCode],
    });
}

export async function blindOberon(cloned: AccountProfile, securityCode: Uint8Array) {
    return await Oberon.blindToken({
      token: cloned.authToken,
      blinding: [securityCode],
    });
}

export async function okapiVersion(): Promise<string> {
    return (await OkapiMetadata.getMetadata()).version;
}