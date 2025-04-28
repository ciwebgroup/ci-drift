export interface HeadingsSummary {
    [k: string]: {
        count: number;
        text: string[];
    }
}

export interface MetaSummary {
    title: string;
    metaTitle: string;
    metaDescription: string;
    jsonLd: string;
    indexable: boolean;
    missingAltAttributes: number;
    pageSize: number;
}

export interface CtaSummary {
    phoneNumbers: number;
    webForms: number;
    schedulers: number;
    chatbots: number;
}

export interface ReadabilitySummary {
    wordCount: number;
    sentenseCount: number;
    avgWordsPerSentence: number;
    fleschReadingEaseScore: number;
}

export interface LinkData {
    content: string;
    linkedElement: string;
    type: string;
    url: string;
    target: string;
    noFollow: boolean;
    status: number;
    id: string | null;
    class: string | null;
}

export interface LinkSummary {
    totals: {
        internal: number;
        external: number;
        nonUrlProtocol: number;
        noFollow: number;
    };
    links: LinkData[];
}
