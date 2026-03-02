import { generateKeyPairSync, sign, verify, createPrivateKey, createPublicKey } from 'node:crypto'

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
	static generateKeyPair() {
		const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
			publicKeyEncoding: { type: 'spki', format: 'der' },
			privateKeyEncoding: { type: 'pkcs8', format: 'der' },
		})
		return {
			publicKey: publicKey.toString('base64'),
			privateKey: privateKey.toString('base64'),
		}
	}

	/**
	 * Sign data using Ed25519 private key.
	 *
	 * @param {string} privateKeyB64 - Base64 encoded PKCS8 DER private key
	 * @param {string|Buffer|Uint8Array} data - Data to sign
	 * @returns {string} Base64 encoded signature
	 */
	static sign(privateKeyB64, data) {
		const key = createPrivateKey({
			key: Buffer.from(privateKeyB64, 'base64'),
			format: 'der',
			type: 'pkcs8',
		})
		const signature = sign(null, Buffer.from(data), key)
		return signature.toString('base64')
	}

	/**
	 * Verify Ed25519 signature.
	 *
	 * @param {string} publicKeyB64 - Base64 encoded SPKI DER public key
	 * @param {string|Buffer|Uint8Array} data - Original data
	 * @param {string} signatureB64 - Base64 encoded signature
	 * @returns {boolean}
	 */
	static verify(publicKeyB64, data, signatureB64) {
		try {
			const key = createPublicKey({
				key: Buffer.from(publicKeyB64, 'base64'),
				format: 'der',
				type: 'spki',
			})
			return verify(null, Buffer.from(data), key, Buffer.from(signatureB64, 'base64'))
		} catch {
			return false
		}
	}
}
