// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: services/trust-registry/v1/trust-registry.proto

package trinsic.services.trustregistry.v1;

/**
 *
 *
 * <pre>
 * Response to `GetMemberAuthorizationStatusRequest`
 * </pre>
 *
 * Protobuf type {@code services.trustregistry.v1.GetMemberResponse}
 */
public final class GetMemberResponse extends com.google.protobuf.GeneratedMessageV3
    implements
    // @@protoc_insertion_point(message_implements:services.trustregistry.v1.GetMemberResponse)
    GetMemberResponseOrBuilder {
  private static final long serialVersionUID = 0L;
  // Use GetMemberResponse.newBuilder() to construct.
  private GetMemberResponse(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }

  private GetMemberResponse() {}

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(UnusedPrivateParameter unused) {
    return new GetMemberResponse();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet getUnknownFields() {
    return this.unknownFields;
  }

  public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
    return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
        .internal_static_services_trustregistry_v1_GetMemberResponse_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
        .internal_static_services_trustregistry_v1_GetMemberResponse_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            trinsic.services.trustregistry.v1.GetMemberResponse.class,
            trinsic.services.trustregistry.v1.GetMemberResponse.Builder.class);
  }

  public static final int AUTHORIZED_MEMBER_FIELD_NUMBER = 1;
  private trinsic.services.trustregistry.v1.AuthorizedMember authorizedMember_;
  /**
   *
   *
   * <pre>
   * Member for given did in given framework
   * </pre>
   *
   * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
   *
   * @return Whether the authorizedMember field is set.
   */
  @java.lang.Override
  public boolean hasAuthorizedMember() {
    return authorizedMember_ != null;
  }
  /**
   *
   *
   * <pre>
   * Member for given did in given framework
   * </pre>
   *
   * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
   *
   * @return The authorizedMember.
   */
  @java.lang.Override
  public trinsic.services.trustregistry.v1.AuthorizedMember getAuthorizedMember() {
    return authorizedMember_ == null
        ? trinsic.services.trustregistry.v1.AuthorizedMember.getDefaultInstance()
        : authorizedMember_;
  }
  /**
   *
   *
   * <pre>
   * Member for given did in given framework
   * </pre>
   *
   * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
   */
  @java.lang.Override
  public trinsic.services.trustregistry.v1.AuthorizedMemberOrBuilder
      getAuthorizedMemberOrBuilder() {
    return getAuthorizedMember();
  }

  private byte memoizedIsInitialized = -1;

  @java.lang.Override
  public final boolean isInitialized() {
    byte isInitialized = memoizedIsInitialized;
    if (isInitialized == 1) return true;
    if (isInitialized == 0) return false;

    memoizedIsInitialized = 1;
    return true;
  }

  @java.lang.Override
  public void writeTo(com.google.protobuf.CodedOutputStream output) throws java.io.IOException {
    if (authorizedMember_ != null) {
      output.writeMessage(1, getAuthorizedMember());
    }
    getUnknownFields().writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (authorizedMember_ != null) {
      size += com.google.protobuf.CodedOutputStream.computeMessageSize(1, getAuthorizedMember());
    }
    size += getUnknownFields().getSerializedSize();
    memoizedSize = size;
    return size;
  }

  @java.lang.Override
  public boolean equals(final java.lang.Object obj) {
    if (obj == this) {
      return true;
    }
    if (!(obj instanceof trinsic.services.trustregistry.v1.GetMemberResponse)) {
      return super.equals(obj);
    }
    trinsic.services.trustregistry.v1.GetMemberResponse other =
        (trinsic.services.trustregistry.v1.GetMemberResponse) obj;

    if (hasAuthorizedMember() != other.hasAuthorizedMember()) return false;
    if (hasAuthorizedMember()) {
      if (!getAuthorizedMember().equals(other.getAuthorizedMember())) return false;
    }
    if (!getUnknownFields().equals(other.getUnknownFields())) return false;
    return true;
  }

  @java.lang.Override
  public int hashCode() {
    if (memoizedHashCode != 0) {
      return memoizedHashCode;
    }
    int hash = 41;
    hash = (19 * hash) + getDescriptor().hashCode();
    if (hasAuthorizedMember()) {
      hash = (37 * hash) + AUTHORIZED_MEMBER_FIELD_NUMBER;
      hash = (53 * hash) + getAuthorizedMember().hashCode();
    }
    hash = (29 * hash) + getUnknownFields().hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      java.nio.ByteBuffer data) throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseDelimitedWithIOException(
        PARSER, input, extensionRegistry);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(PARSER, input);
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3.parseWithIOException(
        PARSER, input, extensionRegistry);
  }

  @java.lang.Override
  public Builder newBuilderForType() {
    return newBuilder();
  }

  public static Builder newBuilder() {
    return DEFAULT_INSTANCE.toBuilder();
  }

  public static Builder newBuilder(trinsic.services.trustregistry.v1.GetMemberResponse prototype) {
    return DEFAULT_INSTANCE.toBuilder().mergeFrom(prototype);
  }

  @java.lang.Override
  public Builder toBuilder() {
    return this == DEFAULT_INSTANCE ? new Builder() : new Builder().mergeFrom(this);
  }

  @java.lang.Override
  protected Builder newBuilderForType(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
    Builder builder = new Builder(parent);
    return builder;
  }
  /**
   *
   *
   * <pre>
   * Response to `GetMemberAuthorizationStatusRequest`
   * </pre>
   *
   * Protobuf type {@code services.trustregistry.v1.GetMemberResponse}
   */
  public static final class Builder extends com.google.protobuf.GeneratedMessageV3.Builder<Builder>
      implements
      // @@protoc_insertion_point(builder_implements:services.trustregistry.v1.GetMemberResponse)
      trinsic.services.trustregistry.v1.GetMemberResponseOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor getDescriptor() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_GetMemberResponse_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_GetMemberResponse_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              trinsic.services.trustregistry.v1.GetMemberResponse.class,
              trinsic.services.trustregistry.v1.GetMemberResponse.Builder.class);
    }

    // Construct using trinsic.services.trustregistry.v1.GetMemberResponse.newBuilder()
    private Builder() {}

    private Builder(com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
    }

    @java.lang.Override
    public Builder clear() {
      super.clear();
      if (authorizedMemberBuilder_ == null) {
        authorizedMember_ = null;
      } else {
        authorizedMember_ = null;
        authorizedMemberBuilder_ = null;
      }
      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor getDescriptorForType() {
      return trinsic.services.trustregistry.v1.TrustRegistryOuterClass
          .internal_static_services_trustregistry_v1_GetMemberResponse_descriptor;
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.GetMemberResponse getDefaultInstanceForType() {
      return trinsic.services.trustregistry.v1.GetMemberResponse.getDefaultInstance();
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.GetMemberResponse build() {
      trinsic.services.trustregistry.v1.GetMemberResponse result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public trinsic.services.trustregistry.v1.GetMemberResponse buildPartial() {
      trinsic.services.trustregistry.v1.GetMemberResponse result =
          new trinsic.services.trustregistry.v1.GetMemberResponse(this);
      if (authorizedMemberBuilder_ == null) {
        result.authorizedMember_ = authorizedMember_;
      } else {
        result.authorizedMember_ = authorizedMemberBuilder_.build();
      }
      onBuilt();
      return result;
    }

    @java.lang.Override
    public Builder clone() {
      return super.clone();
    }

    @java.lang.Override
    public Builder setField(
        com.google.protobuf.Descriptors.FieldDescriptor field, java.lang.Object value) {
      return super.setField(field, value);
    }

    @java.lang.Override
    public Builder clearField(com.google.protobuf.Descriptors.FieldDescriptor field) {
      return super.clearField(field);
    }

    @java.lang.Override
    public Builder clearOneof(com.google.protobuf.Descriptors.OneofDescriptor oneof) {
      return super.clearOneof(oneof);
    }

    @java.lang.Override
    public Builder setRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field, int index, java.lang.Object value) {
      return super.setRepeatedField(field, index, value);
    }

    @java.lang.Override
    public Builder addRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field, java.lang.Object value) {
      return super.addRepeatedField(field, value);
    }

    @java.lang.Override
    public Builder mergeFrom(com.google.protobuf.Message other) {
      if (other instanceof trinsic.services.trustregistry.v1.GetMemberResponse) {
        return mergeFrom((trinsic.services.trustregistry.v1.GetMemberResponse) other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(trinsic.services.trustregistry.v1.GetMemberResponse other) {
      if (other == trinsic.services.trustregistry.v1.GetMemberResponse.getDefaultInstance())
        return this;
      if (other.hasAuthorizedMember()) {
        mergeAuthorizedMember(other.getAuthorizedMember());
      }
      this.mergeUnknownFields(other.getUnknownFields());
      onChanged();
      return this;
    }

    @java.lang.Override
    public final boolean isInitialized() {
      return true;
    }

    @java.lang.Override
    public Builder mergeFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws java.io.IOException {
      if (extensionRegistry == null) {
        throw new java.lang.NullPointerException();
      }
      try {
        boolean done = false;
        while (!done) {
          int tag = input.readTag();
          switch (tag) {
            case 0:
              done = true;
              break;
            case 10:
              {
                input.readMessage(
                    getAuthorizedMemberFieldBuilder().getBuilder(), extensionRegistry);

                break;
              } // case 10
            default:
              {
                if (!super.parseUnknownField(input, extensionRegistry, tag)) {
                  done = true; // was an endgroup tag
                }
                break;
              } // default:
          } // switch (tag)
        } // while (!done)
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        throw e.unwrapIOException();
      } finally {
        onChanged();
      } // finally
      return this;
    }

    private trinsic.services.trustregistry.v1.AuthorizedMember authorizedMember_;
    private com.google.protobuf.SingleFieldBuilderV3<
            trinsic.services.trustregistry.v1.AuthorizedMember,
            trinsic.services.trustregistry.v1.AuthorizedMember.Builder,
            trinsic.services.trustregistry.v1.AuthorizedMemberOrBuilder>
        authorizedMemberBuilder_;
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     *
     * @return Whether the authorizedMember field is set.
     */
    public boolean hasAuthorizedMember() {
      return authorizedMemberBuilder_ != null || authorizedMember_ != null;
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     *
     * @return The authorizedMember.
     */
    public trinsic.services.trustregistry.v1.AuthorizedMember getAuthorizedMember() {
      if (authorizedMemberBuilder_ == null) {
        return authorizedMember_ == null
            ? trinsic.services.trustregistry.v1.AuthorizedMember.getDefaultInstance()
            : authorizedMember_;
      } else {
        return authorizedMemberBuilder_.getMessage();
      }
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public Builder setAuthorizedMember(trinsic.services.trustregistry.v1.AuthorizedMember value) {
      if (authorizedMemberBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        authorizedMember_ = value;
        onChanged();
      } else {
        authorizedMemberBuilder_.setMessage(value);
      }

      return this;
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public Builder setAuthorizedMember(
        trinsic.services.trustregistry.v1.AuthorizedMember.Builder builderForValue) {
      if (authorizedMemberBuilder_ == null) {
        authorizedMember_ = builderForValue.build();
        onChanged();
      } else {
        authorizedMemberBuilder_.setMessage(builderForValue.build());
      }

      return this;
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public Builder mergeAuthorizedMember(trinsic.services.trustregistry.v1.AuthorizedMember value) {
      if (authorizedMemberBuilder_ == null) {
        if (authorizedMember_ != null) {
          authorizedMember_ =
              trinsic.services.trustregistry.v1.AuthorizedMember.newBuilder(authorizedMember_)
                  .mergeFrom(value)
                  .buildPartial();
        } else {
          authorizedMember_ = value;
        }
        onChanged();
      } else {
        authorizedMemberBuilder_.mergeFrom(value);
      }

      return this;
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public Builder clearAuthorizedMember() {
      if (authorizedMemberBuilder_ == null) {
        authorizedMember_ = null;
        onChanged();
      } else {
        authorizedMember_ = null;
        authorizedMemberBuilder_ = null;
      }

      return this;
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public trinsic.services.trustregistry.v1.AuthorizedMember.Builder getAuthorizedMemberBuilder() {

      onChanged();
      return getAuthorizedMemberFieldBuilder().getBuilder();
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    public trinsic.services.trustregistry.v1.AuthorizedMemberOrBuilder
        getAuthorizedMemberOrBuilder() {
      if (authorizedMemberBuilder_ != null) {
        return authorizedMemberBuilder_.getMessageOrBuilder();
      } else {
        return authorizedMember_ == null
            ? trinsic.services.trustregistry.v1.AuthorizedMember.getDefaultInstance()
            : authorizedMember_;
      }
    }
    /**
     *
     *
     * <pre>
     * Member for given did in given framework
     * </pre>
     *
     * <code>.services.trustregistry.v1.AuthorizedMember authorized_member = 1;</code>
     */
    private com.google.protobuf.SingleFieldBuilderV3<
            trinsic.services.trustregistry.v1.AuthorizedMember,
            trinsic.services.trustregistry.v1.AuthorizedMember.Builder,
            trinsic.services.trustregistry.v1.AuthorizedMemberOrBuilder>
        getAuthorizedMemberFieldBuilder() {
      if (authorizedMemberBuilder_ == null) {
        authorizedMemberBuilder_ =
            new com.google.protobuf.SingleFieldBuilderV3<
                trinsic.services.trustregistry.v1.AuthorizedMember,
                trinsic.services.trustregistry.v1.AuthorizedMember.Builder,
                trinsic.services.trustregistry.v1.AuthorizedMemberOrBuilder>(
                getAuthorizedMember(), getParentForChildren(), isClean());
        authorizedMember_ = null;
      }
      return authorizedMemberBuilder_;
    }

    @java.lang.Override
    public final Builder setUnknownFields(final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.setUnknownFields(unknownFields);
    }

    @java.lang.Override
    public final Builder mergeUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.mergeUnknownFields(unknownFields);
    }

    // @@protoc_insertion_point(builder_scope:services.trustregistry.v1.GetMemberResponse)
  }

  // @@protoc_insertion_point(class_scope:services.trustregistry.v1.GetMemberResponse)
  private static final trinsic.services.trustregistry.v1.GetMemberResponse DEFAULT_INSTANCE;

  static {
    DEFAULT_INSTANCE = new trinsic.services.trustregistry.v1.GetMemberResponse();
  }

  public static trinsic.services.trustregistry.v1.GetMemberResponse getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<GetMemberResponse> PARSER =
      new com.google.protobuf.AbstractParser<GetMemberResponse>() {
        @java.lang.Override
        public GetMemberResponse parsePartialFrom(
            com.google.protobuf.CodedInputStream input,
            com.google.protobuf.ExtensionRegistryLite extensionRegistry)
            throws com.google.protobuf.InvalidProtocolBufferException {
          Builder builder = newBuilder();
          try {
            builder.mergeFrom(input, extensionRegistry);
          } catch (com.google.protobuf.InvalidProtocolBufferException e) {
            throw e.setUnfinishedMessage(builder.buildPartial());
          } catch (com.google.protobuf.UninitializedMessageException e) {
            throw e.asInvalidProtocolBufferException().setUnfinishedMessage(builder.buildPartial());
          } catch (java.io.IOException e) {
            throw new com.google.protobuf.InvalidProtocolBufferException(e)
                .setUnfinishedMessage(builder.buildPartial());
          }
          return builder.buildPartial();
        }
      };

  public static com.google.protobuf.Parser<GetMemberResponse> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<GetMemberResponse> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public trinsic.services.trustregistry.v1.GetMemberResponse getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }
}
