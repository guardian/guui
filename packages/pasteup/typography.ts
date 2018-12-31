type Category = 'headline' | 'body' | 'textSans';

export const serif = {
    headline: ['GH Guardian Headline', 'Georgia', 'serif'].join(','),
    body: ['GuardianTextEgyptian', 'Georgia', 'serif'].join(','),
};

export const sans = {
    body: [
        'GuardianTextSans',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'Lucida Grande',
        'sans-serif',
    ].join(','),
};

const fontScaleMapping: any = {
    headline: {
        1: { fontSize: 14, lineHeight: 18 },
        2: { fontSize: 16, lineHeight: 20 },
        3: { fontSize: 20, lineHeight: 24 },
        4: { fontSize: 24, lineHeight: 28 },
        5: { fontSize: 28, lineHeight: 32 },
        6: { fontSize: 32, lineHeight: 36 },
        7: { fontSize: 36, lineHeight: 40 },
        8: { fontSize: 40, lineHeight: 44 },
        9: { fontSize: 44, lineHeight: 48 },
    },
    body: {
        1: { fontSize: 14, lineHeight: 20 },
        2: { fontSize: 16, lineHeight: 24 },
        3: { fontSize: 18, lineHeight: 28 },
    },
    textSans: {
        1: { fontSize: 12, lineHeight: 16 },
        2: { fontSize: 13, lineHeight: 18 },
        3: { fontSize: 14, lineHeight: 20 },
        4: { fontSize: 14, lineHeight: 22 },
        5: { fontSize: 16, lineHeight: 22 },
        6: { fontSize: 18, lineHeight: 18 },
    },
};

const fontSizeNumber = (category: Category, level: number): number =>
    fontScaleMapping[category][level].fontSize;

const lineHeightNumber = (category: Category, level: number): number =>
    fontScaleMapping[category][level].lineHeight;

const fontSizeCss = (category: Category, level: number): string =>
    `font-size: ${fontSizeNumber(category, level)}px`;

const lineHeightCss = (category: Category, level: number): string =>
    `font-height: ${lineHeightNumber(category, level)}px`;

const fontFamily = (category: Category): string => {
    switch (category) {
        case 'headline': {
            return serif.headline;
            break;
        }
        case 'body': {
            return serif.body;
            break;
        }
        default: {
            return sans.body;
            break;
        }
    }
};

const fontfamilyCss = (category: Category): string =>
    `font-family: ${fontFamily(category)}`;

// fontCss('headline', 2) = 'font-family: 16px; line-height: 20px; font-family: GH Guardian Headline, Georgia, serif';
export const fontCss = (category: Category, level: number): string =>
    [
        fontSizeCss(category, level),
        lineHeightCss(category, level),
        fontfamilyCss(category),
    ].join('; ');
