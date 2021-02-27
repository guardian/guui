import { cmp } from '@guardian/consent-management-platform';
import { getPrivacyFramework } from '@root/src/web/lib/getPrivacyFramework';

const newPrivacyLinkName = 'privacy-settings';

export const injectPrivacySettingsLink = (): void => {
	const privacyLink = document.querySelector('a[data-link-name=privacy]');

	if (
		!document.querySelector(`a[data-link-name=${newPrivacyLinkName}]`) &&
		privacyLink
	) {
		const privacyLinkListItem = privacyLink.parentElement;

		if (privacyLinkListItem) {
			getPrivacyFramework()
				.then((framework) => {
					const newPrivacyLink = privacyLink.cloneNode(
						false,
					) as Element;

					newPrivacyLink.setAttribute(
						'data-link-name',
						newPrivacyLinkName,
					);
					newPrivacyLink.setAttribute('href', '#');
					newPrivacyLink.innerHTML = framework.ccpa
						? 'California resident – Do Not Sell'
						: 'Privacy settings';

					const newPrivacyLinkListItem = privacyLinkListItem.cloneNode(
						false,
					) as Element;

					newPrivacyLinkListItem.appendChild(newPrivacyLink);

					privacyLinkListItem.insertAdjacentElement(
						'beforebegin',
						newPrivacyLinkListItem,
					);

					newPrivacyLink.addEventListener(
						'click',
						cmp.showPrivacyManager,
					);
				})
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				.catch((e) => console.error(`privacy settings - error: ${e}`));
		}
	}
};
