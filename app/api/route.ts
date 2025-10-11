'use server'
import { CommentPayload, DataStructure, DataType, DataUserPayload, ErrorReportPayload } from "./data_types";
import { onComment, onConnectionReport as onUserData, onErrorReport } from "./database/handle_post";

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
        let success = true;
        let error_message = "";
        switch (data.type) {
            case DataType.DATAUSER:
                onUserData(data.payload as DataUserPayload).catch((error) => {
                    success = false;
                    error_message = 'Error handling user data: ' + error.message;
                });
                break;
            case DataType.ERROR_REPORT:
                onErrorReport(data.payload as ErrorReportPayload).catch((error) => {
                    success = false;
                    error_message = 'Error handling error report: ' + error.message;
                });
                break;
            case DataType.COMMENT:
                onComment(data.payload as CommentPayload).catch((error) => {
                    success = false;
                    error_message = 'Error handling comment: ' + error.message;
                });
                break;
            default:
                success = false;
                error_message = 'Bad Request: Unknown data type';
                break;
        }
        // Acknowledge receipt
        if (success) {
            return Promise.resolve(new Response('OK', { status: 200 }));
        } else {
            return Promise.resolve(new Response(error_message, { status: 400 }));
        }
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