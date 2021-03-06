// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/verifiable-credentials/v1/verifiable-credentials.proto

package trinsic.services.verifiablecredentials.v1;

public interface CreateProofResponseOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.verifiablecredentials.v1.CreateProofResponse)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * Valid JSON-LD proof for the specified credential
   * </pre>
   *
   * <code>string proof_document_json = 1;</code>
   *
   * @return The proofDocumentJson.
   */
  java.lang.String getProofDocumentJson();
  /**
   *
   *
   * <pre>
   * Valid JSON-LD proof for the specified credential
   * </pre>
   *
   * <code>string proof_document_json = 1;</code>
   *
   * @return The bytes for proofDocumentJson.
   */
  com.google.protobuf.ByteString getProofDocumentJsonBytes();
}
