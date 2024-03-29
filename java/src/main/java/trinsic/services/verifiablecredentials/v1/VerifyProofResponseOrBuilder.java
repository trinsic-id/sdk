// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/verifiable-credentials/v1/verifiable-credentials.proto

package trinsic.services.verifiablecredentials.v1;

public interface VerifyProofResponseOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:services.verifiablecredentials.v1.VerifyProofResponse)
    com.google.protobuf.MessageOrBuilder {

  /**
   *
   *
   * <pre>
   * Whether all validations in `validation_results` passed
   * </pre>
   *
   * <code>bool is_valid = 1;</code>
   *
   * @return The isValid.
   */
  boolean getIsValid();

  /**
   *
   *
   * <pre>
   * Results of each validation check performed,
   * such as schema conformance, revocation status, signature, etc.
   * Detailed results are provided for failed validations.
   * </pre>
   *
   * <code>
   * map&lt;string, .services.verifiablecredentials.v1.ValidationMessage&gt; validation_results = 3;
   * </code>
   */
  int getValidationResultsCount();
  /**
   *
   *
   * <pre>
   * Results of each validation check performed,
   * such as schema conformance, revocation status, signature, etc.
   * Detailed results are provided for failed validations.
   * </pre>
   *
   * <code>
   * map&lt;string, .services.verifiablecredentials.v1.ValidationMessage&gt; validation_results = 3;
   * </code>
   */
  boolean containsValidationResults(java.lang.String key);
  /** Use {@link #getValidationResultsMap()} instead. */
  @java.lang.Deprecated
  java.util.Map<java.lang.String, trinsic.services.verifiablecredentials.v1.ValidationMessage>
      getValidationResults();
  /**
   *
   *
   * <pre>
   * Results of each validation check performed,
   * such as schema conformance, revocation status, signature, etc.
   * Detailed results are provided for failed validations.
   * </pre>
   *
   * <code>
   * map&lt;string, .services.verifiablecredentials.v1.ValidationMessage&gt; validation_results = 3;
   * </code>
   */
  java.util.Map<java.lang.String, trinsic.services.verifiablecredentials.v1.ValidationMessage>
      getValidationResultsMap();
  /**
   *
   *
   * <pre>
   * Results of each validation check performed,
   * such as schema conformance, revocation status, signature, etc.
   * Detailed results are provided for failed validations.
   * </pre>
   *
   * <code>
   * map&lt;string, .services.verifiablecredentials.v1.ValidationMessage&gt; validation_results = 3;
   * </code>
   */

  /* nullable */
  trinsic.services.verifiablecredentials.v1.ValidationMessage getValidationResultsOrDefault(
      java.lang.String key,
      /* nullable */
      trinsic.services.verifiablecredentials.v1.ValidationMessage defaultValue);
  /**
   *
   *
   * <pre>
   * Results of each validation check performed,
   * such as schema conformance, revocation status, signature, etc.
   * Detailed results are provided for failed validations.
   * </pre>
   *
   * <code>
   * map&lt;string, .services.verifiablecredentials.v1.ValidationMessage&gt; validation_results = 3;
   * </code>
   */
  trinsic.services.verifiablecredentials.v1.ValidationMessage getValidationResultsOrThrow(
      java.lang.String key);
}
