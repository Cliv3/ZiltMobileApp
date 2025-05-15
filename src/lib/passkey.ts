import { PasskeyKit, PasskeyServer } from 'passkey-kit';

const PASSKEY_ID_KEY = 'snapchain:keyId';
const CONTRACT_ID_KEY = 'snapchain:contractId';

export function savePasskeyId(id: string) {
  localStorage.setItem(PASSKEY_ID_KEY, id);
}
export function getPasskeyId() {
  return localStorage.getItem(PASSKEY_ID_KEY);
}

export function saveContractId(id: string) {
  localStorage.setItem(CONTRACT_ID_KEY, id);
}
export function getContractId() {
  return localStorage.getItem(CONTRACT_ID_KEY);
}

export function clearPasskeyId() {
  localStorage.removeItem(PASSKEY_ID_KEY);
}

export function clearContractId() {
  localStorage.removeItem(CONTRACT_ID_KEY);
}

export const account = new PasskeyKit({
  rpcUrl: import.meta.env.VITE_RPC_URL,
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE,
  walletWasmHash: import.meta.env.VITE_WALLET_WASM_HASH,
  timeoutInSeconds: 30,
});

export const server = new PasskeyServer({
  rpcUrl: import.meta.env.VITE_RPC_URL,
  launchtubeUrl: import.meta.env.VITE_LAUNCHTUBE_URL,
  launchtubeJwt: import.meta.env.VITE_LAUNCHTUBE_JWT,
});

export async function passkeySignup() {
  try {
    const { keyIdBase64, contractId, signedTx } = await account.createWallet(
      'SnapChain',
      'user123',
    );
    if (!signedTx) throw new Error('built transaction missing');
    await server.send(signedTx);
    savePasskeyId(keyIdBase64);
    saveContractId(contractId);
    return { contractId, keyIdBase64 };
  } catch (err) {
    console.error('Signup error:', err);
    alert(`error signing up: ${JSON.stringify(err)}`);
    throw err;
  }
}

export async function passkeyLogin() {
  try {
    const { keyIdBase64, contractId } = await account.connectWallet();
    savePasskeyId(keyIdBase64);
    saveContractId(contractId);
    return { keyIdBase64, contractId };
  } catch (err) {
    console.error(err);
    alert('error logging in');
    throw err;
  }
} 