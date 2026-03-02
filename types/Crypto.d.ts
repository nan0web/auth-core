/**
 * @module Crypto
 * @description Universal cryptographic primitives for nan0web.
 *
 * Supports Ed25519 signing and verification.
 *
 * @example
 * const { publicKey, privateKey } = Crypto.generateKeyPair()
 * const signature = Crypto.sign(privateKey, 'hello sovereign')
 * const ok = Crypto.verify(publicKey, 'hello sovereign', signature) // true
 */
export default class Crypto {
    /**
     * Generate a new Ed25519 key pair.
     *
     * @returns {{ publicKey: string, privateKey: string }} Base64 encoded keys in DER format (SPKI/PKCS8)
     */
    static generateKeyPair(): {
        publicKey: string;
        privateKey: string;
    };
    /**
     * Sign data using Ed25519 private key.
     *
     * @param {string} privateKeyB64 - Base64 encoded PKCS8 DER private key
     * @param {string|Buffer|Uint8Array} data - Data to sign
     * @returns {string} Base64 encoded signature
     */
    static sign(privateKeyB64: string, data: string | Buffer | Uint8Array): string;
    /**
     * Verify Ed25519 signature.
     *
     * @param {string} publicKeyB64 - Base64 encoded SPKI DER public key
     * @param {string|Buffer|Uint8Array} data - Original data
     * @param {string} signatureB64 - Base64 encoded signature
     * @returns {boolean}
     */
    static verify(publicKeyB64: string, data: string | Buffer | Uint8Array, signatureB64: string): boolean;
}
