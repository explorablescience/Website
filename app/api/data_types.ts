export type DataStructure = {
    type: DataType;
    payload: unknown;
};

export enum DataType {
    CONNECTION_REPORT = "connection_report",
    ERROR_REPORT = "error_report",
    COMMENT = "comment"
}
