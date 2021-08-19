// #region imports
    // #region external
    import {
        MailConfiguration,
        Metadata,
    } from '~data/interfaces';

    import {
        uuid,
    } from '~services/utilities';

    import {
        getAttachments,
    } from '~logic/attachments';

    import {
        getMailFromAddress,
    } from '~logic/general';
    // #endregion external
// #endregion imports



// #region module
export const generateMetadata = (
    config: MailConfiguration,
    message: GoogleAppsScript.Gmail.GmailMessage,
) => {
    const to = getMailFromAddress(message.getTo()) || '';

    const id = uuid();
    const parsedAt = Date.now();

    const messageID = message.getId();
    const subject = message.getSubject();
    const body = message.getPlainBody();
    const sender = message.getFrom();
    const date = message.getDate();

    const attachments = getAttachments(
        config,
        message,
    );

    const metadata: Metadata = {
        id,
        parsedAt,
        message: {
            id: messageID,
            sender,
            receiver: to,
            subject,
            body,
            date,
            attachments,
        },
    };

    return metadata;
}
// #endregion module
