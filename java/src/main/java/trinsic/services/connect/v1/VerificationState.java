// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/connect/v1/connect.proto

package trinsic.services.connect.v1;

/**
 *
 *
 * <pre>
 * The states an individual Verification can be in
 * </pre>
 *
 * Protobuf enum {@code services.connect.v1.VerificationState}
 */
public enum VerificationState implements com.google.protobuf.ProtocolMessageEnum {
  /**
   *
   *
   * <pre>
   * This verification has not yet been performed in the flow
   * </pre>
   *
   * <code>VERIFICATION_PENDING = 0;</code>
   */
  VERIFICATION_PENDING(0),
  /**
   *
   *
   * <pre>
   * This verification has been successfully completed
   * </pre>
   *
   * <code>VERIFICATION_SUCCESS = 3;</code>
   */
  VERIFICATION_SUCCESS(3),
  /**
   *
   *
   * <pre>
   * This verification has failed
   * </pre>
   *
   * <code>VERIFICATION_FAILED = 4;</code>
   */
  VERIFICATION_FAILED(4),
  UNRECOGNIZED(-1),
  ;

  /**
   *
   *
   * <pre>
   * This verification has not yet been performed in the flow
   * </pre>
   *
   * <code>VERIFICATION_PENDING = 0;</code>
   */
  public static final int VERIFICATION_PENDING_VALUE = 0;
  /**
   *
   *
   * <pre>
   * This verification has been successfully completed
   * </pre>
   *
   * <code>VERIFICATION_SUCCESS = 3;</code>
   */
  public static final int VERIFICATION_SUCCESS_VALUE = 3;
  /**
   *
   *
   * <pre>
   * This verification has failed
   * </pre>
   *
   * <code>VERIFICATION_FAILED = 4;</code>
   */
  public static final int VERIFICATION_FAILED_VALUE = 4;

  public final int getNumber() {
    if (this == UNRECOGNIZED) {
      throw new java.lang.IllegalArgumentException(
          "Can't get the number of an unknown enum value.");
    }
    return value;
  }

  /**
   * @param value The numeric wire value of the corresponding enum entry.
   * @return The enum associated with the given numeric wire value.
   * @deprecated Use {@link #forNumber(int)} instead.
   */
  @java.lang.Deprecated
  public static VerificationState valueOf(int value) {
    return forNumber(value);
  }

  /**
   * @param value The numeric wire value of the corresponding enum entry.
   * @return The enum associated with the given numeric wire value.
   */
  public static VerificationState forNumber(int value) {
    switch (value) {
      case 0:
        return VERIFICATION_PENDING;
      case 3:
        return VERIFICATION_SUCCESS;
      case 4:
        return VERIFICATION_FAILED;
      default:
        return null;
    }
  }

  public static com.google.protobuf.Internal.EnumLiteMap<VerificationState> internalGetValueMap() {
    return internalValueMap;
  }

  private static final com.google.protobuf.Internal.EnumLiteMap<VerificationState>
      internalValueMap =
          new com.google.protobuf.Internal.EnumLiteMap<VerificationState>() {
            public VerificationState findValueByNumber(int number) {
              return VerificationState.forNumber(number);
            }
          };

  public final com.google.protobuf.Descriptors.EnumValueDescriptor getValueDescriptor() {
    if (this == UNRECOGNIZED) {
      throw new java.lang.IllegalStateException(
          "Can't get the descriptor of an unrecognized enum value.");
    }
    return getDescriptor().getValues().get(ordinal());
  }

  public final com.google.protobuf.Descriptors.EnumDescriptor getDescriptorForType() {
    return getDescriptor();
  }

  public static final com.google.protobuf.Descriptors.EnumDescriptor getDescriptor() {
    return trinsic.services.connect.v1.ConnectOuterClass.getDescriptor().getEnumTypes().get(2);
  }

  private static final VerificationState[] VALUES = values();

  public static VerificationState valueOf(
      com.google.protobuf.Descriptors.EnumValueDescriptor desc) {
    if (desc.getType() != getDescriptor()) {
      throw new java.lang.IllegalArgumentException("EnumValueDescriptor is not for this type.");
    }
    if (desc.getIndex() == -1) {
      return UNRECOGNIZED;
    }
    return VALUES[desc.getIndex()];
  }

  private final int value;

  private VerificationState(int value) {
    this.value = value;
  }

  // @@protoc_insertion_point(enum_scope:services.connect.v1.VerificationState)
}
