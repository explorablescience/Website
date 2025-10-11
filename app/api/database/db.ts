import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!getApps().length) {
    if (!projectId || !clientEmail || !privateKey) {
        console.warn('[firebase] Missing credentials, Firestore not initialized.\n' +
            `FIREBASE_PROJECT_ID=${!!projectId}, FIREBASE_CLIENT_EMAIL=${!!clientEmail}, FIREBASE_PRIVATE_KEY=${!!privateKey}`);
    } else {
        try {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        } catch (err) {
            console.error('[firebase] initializeApp failed — check FIREBASE_* env vars and private key format.', err);
            throw err;
        }
    }
}

export const db = getFirestore();
