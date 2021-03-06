// #region module
export interface MailConfiguration {
    toMail: string;
    endpoint: string;
    endpointType: string;
    token: string;
    tokenType: string;
    publicKey: string;
    parseSubject?: boolean;
    gatewayToken?: string;
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
    error?: string;
    data: any;
    messageID: string;
    id: string;
    parsedAt: number;
    sentAt: number;
    sender: string;
    receiver: string;
}


export interface CryptedValue {
    text: string;
    aes: string;
}


export interface ActionMailCall {
    data: CryptedValue;
    metadata: CryptedValue;
    endpoint: string;
    endpointType: string;
    token: string | undefined;
    tokenType: string;
    gatewayToken: string | undefined;
}
// #endregion module
