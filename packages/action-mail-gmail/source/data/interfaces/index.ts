// #region module
export interface Attachment {
    name: string;
    size: number;
    blob: GoogleAppsScript.Base.Blob;
}


export interface Metadata {
    id: string;
    parsedAt: number;
    message: MetadataMessage,
}


export interface MetadataMessage {
    id: string;
    sender: string;
    receiver: string;
    subject: string
    body: string
    date: GoogleAppsScript.Base.Date;
    attachments: Attachment[];
}


export interface SentMailEvent {
    success: boolean;
    data: any;
    metadata: Metadata;
    id: string;
    parsedAt: number;
    sentAt: number;
    sender: string;
    receiver: string;
}
// #endregion module
