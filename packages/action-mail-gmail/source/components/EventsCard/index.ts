// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        RESET_ICON_URL,
        OBLITERATE_ICON_URL,

        PROPERTIES_SETTINGS,

        DEFAULT_TIME_LOCALE,
    } from '~data/constants';

    import {
        MailConfiguration,
        Settings,
    } from '~data/interfaces';

    import {
        propertiesGet,
        propertiesGetEvents,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export const getEvents = (
    toMail: string,
) => {
    try {
        const settings: Settings | undefined = propertiesGet(PROPERTIES_SETTINGS);

        const events: GoogleAppsScript.Card_Service.CardSection[] = [];

        const eventsData = propertiesGetEvents(toMail);
        if (eventsData.length === 0) {
            return [];
        }

        const sortedEventsData = eventsData.sort((a, b) => {
            if (a.sentAt > b.sentAt) return -1;
            if (b.sentAt > a.sentAt) return 1;

            return 0;
        });

        for (const eventData of sortedEventsData) {
            try {
                const {
                    id,
                    success,
                    error,
                    data,
                    sentAt,
                    sender,
                } = eventData;


                const errorString = error
                    ? ` · ${error}`
                    : '';

                const successText = success
                    ? `[sent${errorString}]`
                    : `[error${errorString}]`;

                const cleanSender = sender
                    .replace('<', '&lt;')
                    .replace('>', '&gt;');

                const dateValue = new Date(sentAt).toLocaleString(settings?.timeLocale || DEFAULT_TIME_LOCALE);

                const text = CardService.newTextParagraph()
                    .setText(`${successText} from ${cleanSender} on ${dateValue}`);


                const dataValue = Object.keys(data).length === 0
                    ? 'no actions'
                    : JSON.stringify(data, null, 2);
                const dataText = CardService.newTextParagraph()
                    .setText(dataValue);


                const resendAction = CardService.newAction()
                    .setFunctionName('resendEvent')
                    .setParameters({
                        id,
                        mail: toMail,
                    });
                const resendButton = CardService.newDecoratedText()
                    .setText('Resend Event')
                    .setIconUrl(RESET_ICON_URL)
                    .setOnClickAction(resendAction);


                const forgetAction = CardService.newAction()
                    .setFunctionName('forgetEvent')
                    .setParameters({
                        id,
                        mail: toMail,
                    });
                const forgetButton = CardService.newDecoratedText()
                    .setText('Forget Event')
                    .setIconUrl(OBLITERATE_ICON_URL)
                    .setOnClickAction(forgetAction);

                const section = CardService.newCardSection()
                    .addWidget(text)
                    .addWidget(dataText)
                    .addWidget(resendButton)
                    .addWidget(forgetButton);

                events.push(section);
            } catch (error) {
                continue;
            }
        }

        return events;
    } catch (error) {
        return [];
    }
}


export const NoEventsCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);

    const header = CardService.newTextParagraph()
            .setText(`<b>No Events</b>`);

    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header)

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}


const EventsCard = (
    configID: string,
) => {
    const noEventsCard = NoEventsCard();


    const configData: MailConfiguration | undefined = propertiesGet(configID);
    if (!configData) {
        return noEventsCard;
    }


    const {
        toMail,
    } = configData;

    const events = getEvents(toMail);
    if (events.length === 0) {
        return noEventsCard;
    }


    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const header = CardService.newTextParagraph()
        .setText(`<b>Events for ${toMail}</b>`);


    const forgetEventsAction = CardService.newAction()
        .setFunctionName('forgetEvents')
        .setParameters({
            mail: toMail,
        });
    const forgetEventsButton = CardService.newDecoratedText()
        .setText('Forget Events')
        .setIconUrl(OBLITERATE_ICON_URL)
        .setOnClickAction(forgetEventsAction);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header)
        .addWidget(forgetEventsButton);


    const card = CardService.newCardBuilder()
        .addSection(section);


    for (const event of events) {
        card.addSection(event);
    }


    return card
        .build();
}
// #endregion module



// #region exports
export default EventsCard;
// #endregion exports
