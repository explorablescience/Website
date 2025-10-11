export const runtime = 'nodejs';
import { CommentPayload, DataStructure, DataType, DataUserPayload, ErrorReportPayload } from "./data_types";
import { onComment, onConnectionReport as onUserData, onErrorReport } from "./database/handle_post";

async function handlePost(request: Request) : Promise<Response> {
    if (request.method !== 'POST') {
        return Promise.resolve(new Response('Method Not Allowed', { status: 405 }));
    }
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return Promise.resolve(new Response('Unsupported Media Type', { status: 415 }));
    }
    return await request.json().then(async (data: DataStructure) => {
        if (!data.type || !data.payload) {
            return Promise.resolve(new Response('Bad Request: Missing type or payload', { status: 400 }));
        }
        // Handle different data types and await DB operations so errors are
        // returned to the client instead of happening asynchronously.
        try {
            switch (data.type) {
                case DataType.DATAUSER:
                    await onUserData(data.payload as DataUserPayload);
                    break;
                case DataType.ERROR_REPORT:
                    await onErrorReport(data.payload as ErrorReportPayload);
                    break;
                case DataType.COMMENT:
                    await onComment(data.payload as CommentPayload);
                    break;
                default:
                    console.error('Error handling unknown data type:', data.type);
                    return new Response('Bad Request: Unknown data type', { status: 400 });
            }

            // If we reach here the DB operation succeeded
            return new Response('OK', { status: 200 });
        } catch (error) {
            console.error('Error handling payload:', error);
            const message = error instanceof Error ? error.message : String(error);
            // Return 500 for server-side errors (including DEADLINE_EXCEEDED)
            return new Response('Error handling payload: ' + message, { status: 500 });
        }
    }).catch((error) => {
        console.error('Error parsing JSON:', error);
        return Promise.resolve(new Response('Bad Request: Invalid JSON', { status: 400 }));
    });
}

export async function POST(request: Request) {
    try {
        return await handlePost(request);
    }
    catch (reason) {
        const message = reason instanceof Error ? reason.message : 'Unexpected error occurred';
        return new Response(message, { status: 500 })
    }
}