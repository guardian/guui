import minifyCssString from 'minify-css-string';

type FontFamily =
	| 'GH Guardian Headline'
	| 'Guardian Egyptian Web' // Legacy of GH Guardian Headline
	| 'GuardianTextEgyptian'
	| 'Guardian Text Egyptian Web' // Legacy of GuardianTextEgyptian
	| 'GuardianTextSans'
	| 'Guardian Text Sans Web'; // Legacy of GuardianTextSans

type FontStyle = 'normal' | 'italic';

interface FontDisplay {
	family: FontFamily;
	woff2: string;
	woff: string;
	ttf: string;
	weight: number;
	style: FontStyle;
}

const fontList: FontDisplay[] = [
	// GH Guardian Headline, with legacy family name of Guardian Egyptian Web
	{
		family: 'GH Guardian Headline',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.ttf',
		weight: 300,
		style: 'normal',
	},
	{
		family: 'Guardian Egyptian Web',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Light.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Light.ttf',
		weight: 300,
		style: 'normal',
	},
	{
		family: 'GH Guardian Headline',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.ttf',
		weight: 300,
		style: 'italic',
	},
	{
		family: 'Guardian Egyptian Web',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-LightItalic.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-LightItalic.ttf',
		weight: 300,
		style: 'italic',
	},
	{
		family: 'GH Guardian Headline',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2',
		woff:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Medium.ttf',
		weight: 500,
		style: 'normal',
	},
	{
		family: 'Guardian Egyptian Web',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2',
		woff:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Medium.ttf',
		weight: 500,
		style: 'normal',
	},
	{
		family: 'GH Guardian Headline',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.ttf',
		weight: 500,
		style: 'italic',
	},
	{
		family: 'Guardian Egyptian Web',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-MediumItalic.ttf',
		weight: 500,
		style: 'italic',
	},
	{
		family: 'GH Guardian Headline',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
	{
		family: 'Guardian Egyptian Web',
		woff2:
			'fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2',
		woff:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.woff',
		ttf:
			'fonts/guardian-headline/latin1-not-hinted/GHGuardianHeadline-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
	// GuardianTextEgyptian, with legacy family name of Guardian Text Egyptian Web
	{
		family: 'GuardianTextEgyptian',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2',
		woff:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Regular.ttf',
		weight: 400,
		style: 'normal',
	},
	{
		family: 'Guardian Text Egyptian Web',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2',
		woff:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Regular.ttf',
		weight: 400,
		style: 'normal',
	},
	{
		family: 'GuardianTextEgyptian',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2',
		woff:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.ttf',
		weight: 400,
		style: 'italic',
	},
	{
		family: 'Guardian Text Egyptian Web',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2',
		woff:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-RegularItalic.ttf',
		weight: 400,
		style: 'italic',
	},
	{
		family: 'GuardianTextEgyptian',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2',
		woff:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
	{
		family: 'Guardian Text Egyptian Web',
		woff2:
			'fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2',
		woff:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.woff',
		ttf:
			'fonts/guardian-textegyptian/latin1-not-hinted/GuardianTextEgyptian-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
	// GuardianTextSans, with legacy family name of Guardian Text Sans Web
	{
		family: 'GuardianTextSans',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2',
		woff:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Regular.ttf',
		weight: 400,
		style: 'normal',
	},
	{
		family: 'Guardian Text Sans Web',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2',
		woff:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Regular.ttf',
		weight: 400,
		style: 'normal',
	},
	{
		family: 'GuardianTextSans',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2',
		woff:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.ttf',
		weight: 400,
		style: 'italic',
	},
	{
		family: 'Guardian Text Sans Web',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-RegularItalic.woff2',
		woff:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-RegularItalic.ttf',
		weight: 400,
		style: 'italic',
	},
	{
		family: 'GuardianTextSans',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2',
		woff:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
	{
		family: 'Guardian Text Sans Web',
		woff2:
			'fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2',
		woff:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.woff',
		ttf:
			'fonts/guardian-textsans/latin1-not-hinted/GuardianTextSans-Bold.ttf',
		weight: 700,
		style: 'normal',
	},
];

const assetsUrl = (path: string): string =>
	`https://assets.guim.co.uk/static/frontend/${path}`;

const template: (_: FontDisplay) => string = ({
	family,
	woff2,
	woff,
	ttf,
	weight,
	style,
}) => `
    @font-face {
        font-family: "${family}";
        src: url(${assetsUrl(woff2)}) format("woff2"),
                url(${assetsUrl(woff)}) format("woff"),
                url(${assetsUrl(ttf)}) format("truetype");
        font-weight: ${weight};
        font-style: ${style};
        font-display: swap;
    }
`;

const getStyleString: () => string = () => {
	return fontList.reduce(
		(styleString, font) => `${styleString}${template(font)}`,
		'',
	);
};

export const getFontsCss = (): string =>
	minifyCssString(getStyleString()) as string;
