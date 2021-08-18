// #region module
export interface MailConfiguration {
    toMail: string;
    endpoint: string;
    endpointType: string;
    token: string;
    tokenType: string;
    publicKey: string;
    parseSubject?: boolean;
    useAttachments?: boolean;
    spacer?: string;
    camelCaseKeys?: boolean;
    fielders?: string;
}


export interface Settings {
    timeLocale: string;
}


export interface Attachment {
    name: string;
    hash: string;
    size: number;
    contentType: string;
    bytes: number[];
}


export interface Metadata {
    id: string;
    parsedAt: number;
    message: MetadataMessage;
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
    messageID: string;
    id: string;
    parsedAt: number;
    sentAt: number;
    sender: string;
    receiver: string;
}
// #endregion module
