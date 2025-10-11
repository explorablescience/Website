'use server'
import { DataStructure, DataType } from "./data_types";

function handlePost(request: Request) : Promise<Response> {
    if (request.method !== 'POST') {
        return Promise.resolve(new Response('Method Not Allowed', { status: 405 }));
    }
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return Promise.resolve(new Response('Unsupported Media Type', { status: 415 }));
    }
    return request.json().then((data: DataStructure) => {
        if (!data.type || !data.payload) {
            return Promise.resolve(new Response('Bad Request: Missing type or payload', { status: 400 }));
        }
        // Handle different data types
        switch (data.type) {
            case DataType.CONNECTION_REPORT:
                console.log('Received connection report:', data.payload);
                break;
            case DataType.ERROR_REPORT:
                console.log('Received error report:', data.payload);
                break;
            case DataType.COMMENT:
                console.log('Received comment:', data.payload);
                break;
            default:
                return Promise.resolve(new Response('Bad Request: Unknown type', { status: 400 }));
        }
        // Acknowledge receipt
        return Promise.resolve(new Response('OK', { status: 200 }));
    }).catch((error) => {
        console.error('Error parsing JSON:', error);
        return Promise.resolve(new Response('Bad Request: Invalid JSON', { status: 400 }));
    });
}

export async function POST(request: Request) {
    try {
        return handlePost(request);
    }
    catch (reason) {
        const message = reason instanceof Error ? reason.message : 'Unexpected error occurred';
        return new Response(message, { status: 500 })
    }
}