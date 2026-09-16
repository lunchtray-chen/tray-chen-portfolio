#!/usr/bin/env node
/*
 * Generates the PASSWORD_SALT / PASSWORD_HASH pair for a chosen password, plus a
 * TOKEN_SECRET. Prompts for the password so it never lands in your shell history.
 *
 *   cd worker && npm run hash
 *
 * ITERATIONS must stay in sync with PBKDF2_ITERATIONS in src/index.js.
 */

import { webcrypto } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const ITERATIONS = 20000

const toHex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

const rl = createInterface({ input: stdin, output: stdout })
const password = await rl.question('Password to protect the Artifex projects: ')
rl.close()

if (!password) {
  console.error('No password entered.')
  process.exit(1)
}

const salt = webcrypto.getRandomValues(new Uint8Array(16))
const key = await webcrypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  'PBKDF2',
  false,
  ['deriveBits'],
)
const bits = await webcrypto.subtle.deriveBits(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  key,
  256,
)

const tokenSecret = toHex(webcrypto.getRandomValues(new Uint8Array(32)))

console.log(`
Run each of these and paste the matching value when prompted:

  npx wrangler secret put PASSWORD_SALT
    ${toHex(salt)}

  npx wrangler secret put PASSWORD_HASH
    ${toHex(bits)}

  npx wrangler secret put TOKEN_SECRET
    ${tokenSecret}

For local dev, put the same three values in worker/.dev.vars (gitignored).
Changing the password later = re-run this and update PASSWORD_SALT + PASSWORD_HASH.
Leave TOKEN_SECRET alone unless you want to log everyone out.
`)
