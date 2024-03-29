// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/connect/v1/connect.proto

package trinsic.services.connect.v1;

/**
 *
 *
 * <pre>
 * The type of verification to perform
 * </pre>
 *
 * Protobuf enum {@code services.connect.v1.VerificationType}
 */
public enum VerificationType implements com.google.protobuf.ProtocolMessageEnum {
  /**
   *
   *
   * <pre>
   * Government-issued ID (driver's license, passport, etc)
   * </pre>
   *
   * <code>GOVERNMENT_ID = 0;</code>
   */
  GOVERNMENT_ID(0),
  UNRECOGNIZED(-1),
  ;

  /**
   *
   *
   * <pre>
   * Government-issued ID (driver's license, passport, etc)
   * </pre>
   *
   * <code>GOVERNMENT_ID = 0;</code>
   */
  public static final int GOVERNMENT_ID_VALUE = 0;

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
  public static VerificationType valueOf(int value) {
    return forNumber(value);
  }

  /**
   * @param value The numeric wire value of the corresponding enum entry.
   * @return The enum associated with the given numeric wire value.
   */
  public static VerificationType forNumber(int value) {
    switch (value) {
      case 0:
        return GOVERNMENT_ID;
      default:
        return null;
    }
  }

  public static com.google.protobuf.Internal.EnumLiteMap<VerificationType> internalGetValueMap() {
    return internalValueMap;
  }

  private static final com.google.protobuf.Internal.EnumLiteMap<VerificationType> internalValueMap =
      new com.google.protobuf.Internal.EnumLiteMap<VerificationType>() {
        public VerificationType findValueByNumber(int number) {
          return VerificationType.forNumber(number);
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
    return trinsic.services.connect.v1.ConnectOuterClass.getDescriptor().getEnumTypes().get(0);
  }

  private static final VerificationType[] VALUES = values();

  public static VerificationType valueOf(com.google.protobuf.Descriptors.EnumValueDescriptor desc) {
    if (desc.getType() != getDescriptor()) {
      throw new java.lang.IllegalArgumentException("EnumValueDescriptor is not for this type.");
    }
    if (desc.getIndex() == -1) {
      return UNRECOGNIZED;
    }
    return VALUES[desc.getIndex()];
  }

  private final int value;

  private VerificationType(int value) {
    this.value = value;
  }

  // @@protoc_insertion_point(enum_scope:services.connect.v1.VerificationType)
}
