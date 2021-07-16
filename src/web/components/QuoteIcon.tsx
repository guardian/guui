import { css } from '@emotion/react';

import { QuoteIcon as SourceQuoteIcon } from '@guardian/src-ed-quote-icon';

const quoteBaseStyles = (colour?: string) => css`
	span > svg {
		fill: ${colour && colour};
	}
`;

type Props = {
	colour: string;
	format: Format;
	size: HeadlineSizeType;
};

export const QuoteIcon = ({ format, colour, size }: Props) => (
	<span css={[quoteBaseStyles(colour)]} data-testid="quote-icon">
		<SourceQuoteIcon format={format} size={size} />
	</span>
);
