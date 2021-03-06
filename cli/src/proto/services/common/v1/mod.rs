/// Nonce used to generate an oberon proof
#[derive(::serde::Serialize, ::serde::Deserialize, Clone, PartialEq, ::prost::Message)]
pub struct Nonce {
    /// UTC unix millisecond timestamp the request was made
    #[prost(int64, tag = "1")]
    pub timestamp: i64,
    /// blake3256 hash of the request body
    #[prost(bytes = "vec", tag = "2")]
    pub request_hash: ::prost::alloc::vec::Vec<u8>,
}
#[derive(::serde::Serialize, ::serde::Deserialize, Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum ResponseStatus {
    Success = 0,
    WalletAccessDenied = 10,
    WalletExists = 11,
    ItemNotFound = 20,
    SerializationError = 200,
    UnknownError = 100,
}
