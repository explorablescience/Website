export type DataStructure = {
    type: DataType;
    payload: unknown;
};

export enum DataType {
    DATAUSER = "connection_report",
    ERROR_REPORT = "error_report",
    COMMENT = "comment"
}

export type DataUserPayload = {
    timestamp: string;
    ipAddress: string;
    window: unknown;
    document: unknown;
    navigator: unknown;
};

export type ErrorReportPayload = {
    timestamp: string;
    ipAddress: string;
    error: unknown;
    performances: unknown;
    window: unknown;
    document: unknown;
    navigator: unknown;
};

export type CommentPayload = {
    name: string;
    email: string;
    message: string;
    trackingPayload: DataUserPayload;
};
