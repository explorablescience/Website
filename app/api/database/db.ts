import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Read env vars
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// For safety, avoid printing the private key. Print presence/absence only.
console.log('FIREBASE_PROJECT_ID present:', !!projectId);
console.log('FIREBASE_CLIENT_EMAIL present:', !!clientEmail);
console.log('FIREBASE_PRIVATE_KEY present:', !!rawPrivateKey);

function normalizePrivateKey(raw?: string | undefined) {
    if (!raw) return undefined;
    let key = raw.trim();

    // If the key contains literal "\\n" sequences, replace them with real newlines
    if (key.indexOf('\\n') !== -1) {
        key = key.replace(/\\n/g, '\n');
    }

    // If the key does not contain the PEM header, attempt base64 decode
    if (!/-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(key)) {
        try {
            const compact = key.replace(/\s+/g, '');
            const base64Like = /^[A-Za-z0-9+/=]+$/.test(compact) && compact.length % 4 === 0;
            if (base64Like) {
                const decoded = Buffer.from(compact, 'base64').toString('utf8');
                if (/-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(decoded)) {
                    key = decoded;
                }
            }
        } catch {
            // ignore and continue with the original key
        }
    }

    return key;
}

const privateKey = normalizePrivateKey(rawPrivateKey);

if (!getApps().length) {
    if (!projectId || !clientEmail || !privateKey) {
        console.warn('[firebase] Missing or invalid credentials — Firestore not initialized.');
        console.warn(`FIREBASE_PROJECT_ID present: ${!!projectId}, FIREBASE_CLIENT_EMAIL present: ${!!clientEmail}, FIREBASE_PRIVATE_KEY present: ${!!privateKey}`);
    } else {
        try {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('[firebase] initializeApp succeeded');
        } catch (err) {
            console.error('[firebase] initializeApp failed — check FIREBASE_* env vars and private key format.', err);
            throw err;
        }
    }
}

export const db = getFirestore();
