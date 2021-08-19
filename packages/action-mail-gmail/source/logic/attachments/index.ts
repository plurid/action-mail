// #region imports
    // #region external
    import {
        Attachment,
        MailConfiguration,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const getAttachments = (
    config: MailConfiguration,
    message: GoogleAppsScript.Gmail.GmailMessage,
) => {
    const attachments: Attachment[] = [];

    const messageAttachments = message.getAttachments();

    if (config.useAttachments) {
        for (const messageAttachment of messageAttachments) {
            const name = messageAttachment.getName();
            const hash = messageAttachment.getHash();
            const size = messageAttachment.getSize();
            const contentType = messageAttachment.getContentType();
            const bytes = messageAttachment.getBytes();

            const attachment: Attachment = {
                name,
                hash,
                size,
                contentType,
                bytes,
            };
            attachments.push(attachment);
        }
    }

    return attachments;
}
// #endregion module
