import { ClassNames } from '@emotion/react';

import { adJson, stringify } from '@root/src/amp/lib/ad-json';

// Largest size first
const inlineSizes = [
	{ width: 300, height: 250 }, // MPU
	{ width: 320, height: 480 }, // Picnic story
	{ width: 250, height: 250 }, // Square
];

// Note: amp-sticky-ad has max height of 100
const stickySizes = [{ width: 320, height: 50 }]; // Mobile Leaderboard

type AdRegion = 'US' | 'AU' | 'ROW';

const dfpAdUnitRoot = 'theguardian.com';

const ampData = (section: string, contentType: string): string => {
	const dfpAccountId = '59666047';

	if (section !== '') {
		return `/${dfpAccountId}/${dfpAdUnitRoot}/${section}/${contentType.toLowerCase()}/amp`;
	}

	return `/${dfpAccountId}/${dfpAdUnitRoot}/amp`;
};

const getPlacementId = (adRegion: AdRegion): number => {
	switch (adRegion) {
		case 'US':
			return 7;
		case 'AU':
			return 6;
		default:
			return 4;
	}
};

const realTimeConfig = (
	adRegion: AdRegion,
	usePrebid: boolean,
	usePermutive: boolean,
): any => {
	const placementID = getPlacementId(adRegion);
	const preBidServerPrefix = 'https://prebid.adnxs.com/pbs/v1/openrtb2/amp';
	const permutiveURL =
		'https://guardian.amp.permutive.com/rtc?type=doubleclick';

	const prebidURL = [
		`${preBidServerPrefix}?tag_id=${placementID}`,
		'w=ATTR(width)',
		'h=ATTR(height)',
		'ow=ATTR(data-override-width)',
		'oh=ATTR(data-override-height)',
		'ms=ATTR(data-multi-size)',
		'slot=ATTR(data-slot)',
		'targeting=TGT',
		'curl=CANONICAL_URL',
		'timeout=TIMEOUT',
		'adcid=ADCID',
		'purl=HREF',
		'gdpr_consent=CONSENT_STRING',
	].join('&');

	const data = {
		urls: [
			usePrebid ? prebidURL : '',
			usePermutive ? permutiveURL : '',
		].filter((url) => url),
	};

	return JSON.stringify(data);
};

interface CommercialConfig {
	usePrebid: boolean;
	usePermutive: boolean;
}

export interface AdProps {
	isSticky?: boolean;
	adRegion: AdRegion;
	edition: Edition;
	section: string;
	contentType: string;
	config: CommercialConfig;
	commercialProperties: CommercialProperties;
}

export const Ad = ({
	isSticky,
	adRegion,
	edition,
	section,
	contentType,
	config,
	commercialProperties,
}: AdProps) => {
	const adSizes = isSticky ? stickySizes : inlineSizes;
	const [{ width, height }] = adSizes; // Set initial size as first element (should be the largest)
	const multiSizes = adSizes.map((e) => `${e.width}x${e.height}`).join(',');

	return (
		<ClassNames>
			{({ css, cx }) => {
				const adClass = css`
					display: none;
				`;

				const usAdRegionClass = css`
					.amp-geo-group-us & {
						display: block;
					}
				`;

				const auAdRegionClass = css`
					.amp-geo-group-au & {
						display: block;
					}
				`;

				const rowAdRegionClass = css`
					.amp-geo-group-eea & {
						display: block;
					}
					.amp-geo-no-group & {
						display: block;
					}
				`;

				const adRegionClasses = {
					US: usAdRegionClass,
					AU: auAdRegionClass,
					ROW: rowAdRegionClass,
				};

				return (
					<amp-ad
						class={cx(adClass, adRegionClasses[adRegion])}
						data-block-on-consent=""
						width={width}
						height={height}
						data-multi-size={multiSizes}
						data-multi-size-validation="false"
						data-npa-on-unknown-consent={true}
						data-loading-strategy="prefer-viewability-over-views"
						layout="fixed"
						type="doubleclick"
						json={stringify(
							adJson(commercialProperties[edition].adTargeting),
						)}
						data-slot={ampData(section, contentType)}
						rtc-config={realTimeConfig(
							adRegion,
							config.usePrebid,
							config.usePermutive,
						)}
					/>
				);
			}}
		</ClassNames>
	);
};
