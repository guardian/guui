import React from 'react';

import { Callout } from '@root/src/web/components/Callout/Callout';
import { unescapeData } from '@root/src/lib/escapeData';
import { css } from 'emotion';
import { textSans } from '@guardian/src-foundations/typography';
import { text } from '@guardian/src-foundations/palette';

type Props = {
    html: string;
    alt?: string;
    campaign?: CampaignsType;
    pillar?: Pillar;
};

const emailCaptionStyle = css`
    ${textSans.xsmall()};
    word-break: break-all;
    color: ${text.supporting};
`;

const embedContainer = css`
    iframe {
        /* Some embeds can hijack the iframe and calculate an incorrect width, which pushes the body out */
        width: 100% !important;
    }
    margin-bottom: 16px;
`;

export const EmbedBlockComponent = ({ html, alt, campaign, pillar }: Props) => {
    // SSR if campaign callout
    if (campaign && pillar) {
        return <Callout campaign={campaign} pillar={pillar} />;
    }
    // TODO: Email embeds are being turned into atoms, so we can remove this hack when that happens
    const isEmailEmbed = html.includes('email/form');
    return (
        <div data-cy="embed-block" className={embedContainer}>
            <div dangerouslySetInnerHTML={{ __html: unescapeData(html) }} />
            {isEmailEmbed && alt && (
                <div className={emailCaptionStyle}>{alt}</div>
            )}
        </div>
    );
};
