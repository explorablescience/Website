/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommentPayload, DataUserPayload, ErrorReportPayload } from '../data_types';
import { db } from './db';
import crypto from 'crypto';

// Generate a unique user ID based on IP address and navigator properties
function getUniqueUserId(ipAddress: string, navigator: any): string {
    // Extract relevant navigator properties for uniqueness
    const {
        userAgent = '',
        language = '',
        platform = '',
        hardwareConcurrency = '',
        deviceMemory = '',
        vendor = '',
        maxTouchPoints = '',
    } = navigator || {};

    // Concatenate all properties into a single string
    const rawId = [
        ipAddress,
        userAgent,
        language,
        platform,
        hardwareConcurrency,
        deviceMemory,
        vendor,
        maxTouchPoints
    ].join('|');

    // Hash the concatenated string for privacy and uniqueness
    return crypto.createHash('sha256').update(rawId).digest('hex');
}

// Add payload to corresponding subcollection for the user
async function addUserData(userID: string, type: string, payload: unknown) {
    return await db.collection('users').doc(userID).collection(type).add(payload as any);
}

// Add entry to a specified collection to reference user IDs
export async function addUserReference(userID: string, type: string, data: { path: string; id: string }) {
    // Create document with userID as ID to make sure it exists
    await db.collection(type).doc(userID).set({ userID }).catch((err) => {
        console.error('Error creating reference document:', err);
        return Promise.reject(err);
    });

    // Add reference to the specific data entry
    return await db.collection(type).doc(userID).collection('references').add(data);
}


export async function onConnectionReport(payload: DataUserPayload) {
    const userId = getUniqueUserId(payload.ipAddress, payload.navigator);
    return addUserData(userId, 'connections', payload);
}
export async function onErrorReport(payload: ErrorReportPayload) {
    const userId = getUniqueUserId(payload.ipAddress, payload.navigator);
    return await addUserData(userId, 'errors', payload).then(newData => {
        return addUserReference(userId, 'errors', { path: newData.path, id: newData.id });
    });
}
export async function onComment(payload: CommentPayload) {
    const userId = getUniqueUserId(payload.trackingPayload.ipAddress, payload.trackingPayload.navigator);
    return await addUserData(userId, 'comments', payload).then(newData => {
        return addUserReference(userId, 'comments', { path: newData.path, id: newData.id });
    });
}
