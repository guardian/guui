import React from 'react';
import { css, cx } from 'emotion';
import { pillarMap, pillarPalette } from '@root/src/lib/pillars';
import { border } from '@guardian/src-foundations/palette';

import { Standfirst } from '@root/src/lofi/components/Standfirst';

const standfirstLinks = pillarMap(
    (pillar) =>
        css`
            font-weight: normal;
            a {
                color: ${pillarPalette[pillar].dark};
                text-decoration: none;
                border-bottom: 1px solid ${border.secondary};
                transition: border-color 0.15s ease-out;
            }
        `,
);

type Props = {
    designType: DesignType;
    pillar: Pillar;
    standfirst: string; // Can be html
};

export const ArticleStandfirst = ({
    designType,
    pillar,
    standfirst,
}: Props) => (
    <div className={cx(standfirstLinks[pillar])}>
        <Standfirst designType={designType} standfirst={standfirst} />
    </div>
);
