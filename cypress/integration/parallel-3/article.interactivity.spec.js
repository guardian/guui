/* eslint-disable no-undef */
/* eslint-disable func-names */
import { mockApi } from '../../lib/mocks';
import { disableCMP } from '../../lib/disableCMP';
import { setLocalBaseUrl } from '../../lib/setLocalBaseUrl.js';

const READER_REVENUE_TITLE_TEXT = 'Support the';
const articleUrl =
	'https://www.theguardian.com/politics/2019/oct/29/tories-restore-party-whip-to-10-mps-who-sought-to-block-no-deal-brexit';

describe('Interactivity', function () {
	beforeEach(function () {
		disableCMP();
		setLocalBaseUrl();
	});

	describe('Verify elements have been hydrated', function () {
		it('should open the edition dropdown menu when clicked and hide when expected', function () {
			cy.visit(`/Article?url=${articleUrl}`);
			cy.get('[data-cy=dropdown-options]').should('not.be.visible');
			// Open it
			cy.get('[data-cy=dropdown-button]').click();
			cy.get('[data-cy=dropdown-options]').should('be.visible');
			// Pressing esc hides it
			cy.get('body').type('{esc}', { force: true });
			cy.get('[data-cy=dropdown-options]').should('not.be.visible');
			// Open it again
			cy.get('[data-cy=dropdown-button]').click();
			cy.get('[data-cy=dropdown-options]').should('be.visible');
			// Clicking elsewhere in the document hides it
			cy.get('h1').click();
			cy.get('[data-cy=dropdown-options]').should('not.be.visible');
		});
		// eslint-disable-next-line mocha/no-skipped-tests
		it.skip('should display the share count for an article', function () {
			cy.visit(`/Article?url=${articleUrl}`);
			cy.get('[data-cy=share-counts]').should('exist');
		});
		it('should display all the rich links for an article', function () {
			cy.visit(`/Article?url=${articleUrl}`);
			cy.scrollTo('bottom', { duration: 300 });
			cy.get('[data-component=rich-link]')
				.should('exist')
				.its('length')
				// This count of rich links is dependent on the article that we're testing not changing
				// If this assertion fails then it could be because a link was added or removed in
				// which case this check should be updated
				.should('eq', 2);
		});
		describe('When most viewed is mocked', function () {
			beforeEach(mockApi);
			it('should change the list of most viewed items when a tab is clicked', function () {
				cy.visit(`/Article?url=${articleUrl}`);
				cy.contains('Lifestyle');
				cy.get('[data-component="most-popular"]').scrollIntoView({
					duration: 300,
					offset: { top: 150 },
				});
				cy.wait('@getMostReadGeo');
				cy.wait('@getMostRead');
				cy.get('[data-cy=tab-body-0]').should('be.visible');
				cy.get('[data-cy=tab-body-1]').should('not.be.visible');
				cy.get('[data-cy=tab-heading-1]').click();
				cy.get('[data-cy=tab-body-0]').should('not.be.visible');
				cy.get('[data-cy=tab-body-1]').should('be.visible');
			});
		});
		it('should render the reader revenue links in the header', function () {
			cy.visit(`/Article?url=${articleUrl}`);
			cy.scrollTo('bottom', { duration: 300 });
			cy.get('header')
				.contains(READER_REVENUE_TITLE_TEXT)
				.should('be.visible');
		});
	});

	describe('Navigating the pillar menu', function () {
		it('should expand and close the desktop pillar menu when More is clicked', function () {
			cy.visit(`/Article?url=${articleUrl}`);
			cy.get('[data-cy=nav-show-more-button]').click();
			cy.get('[data-cy=expanded-menu]').within(() => {
				cy.contains('Columnists').should('be.visible');
			});
			// Assert first item is highlighted
			cy.get('[data-cy="newsLinks"] > li')
				.first()
				.within(() => {
					cy.get('a').should('have.focus');
				});
			// check focus is on menu button on close
			cy.focused().type('{esc}');
			cy.focused().should('have.attr', 'data-cy', 'nav-show-more-button');

			// TODO: should also include assertion to select menu item when AD z-index fixed
			// See: https://trello.com/c/y8CyFKJm/1524-top-nav-ad-and-nav-z-index-issue
		});

		describe('On mobile', function () {
			it('should expand the mobile pillar menu when the VeggieBurger is clicked', function () {
				cy.viewport('iphone-x');
				cy.visit(`/Article?url=${articleUrl}`);
				cy.get('[data-cy=veggie-burger]').click();
				cy.contains('Crosswords');
				cy.get('[data-cy=column-collapse-Opinion]').click();
				cy.contains('Columnists').should('be.visible');
				// check focus is on veggie burger menu button on close
				cy.focused().type('{esc}');
				cy.focused().should('have.attr', 'data-cy', 'veggie-burger');
			});

			it('should transfer focus to the sub nav when tabbing from the veggie burger without opening the menu', function () {
				cy.viewport('iphone-x');
				cy.visit(`/Article?url=${articleUrl}`);
				cy.get('[data-cy=veggie-burger]').focus().tab();
				cy.get('[data-cy=sub-nav] a').first().should('have.focus');
			});

			it('should immediately focus on the News menu item when the menu first opens', function () {
				cy.viewport('iphone-x');
				cy.visit(`/Article?url=${articleUrl}`);
				cy.get('[data-cy=veggie-burger]').click();
				cy.get('[data-cy=column-collapse-News]').should('have.focus');
			});

			it('should transfer focus to sub menu items when tabbing from section header', function () {
				cy.viewport('iphone-x');
				cy.visit(`/Article?url=${articleUrl}`);
				cy.get('[data-cy=veggie-burger]').click();
				cy.focused().type('{enter}').tab();
				// get the first column (news column)
				cy.get('[data-cy="nav-menu-columns"] li')
					.first()
					.within(() => {
						// get the first element in that column
						cy.get('ul > li > a').first().should('have.focus');
					});
			});

			it('should let reader traverse section titles using keyboard', function () {
				cy.viewport('iphone-x');
				cy.visit(`/Article?url=${articleUrl}`);
				cy.get('[data-cy=veggie-burger]').type('{enter}');
				// Close the news menu
				cy.focused().type('{enter}').tab();
				cy.focused().should(
					'have.attr',
					'data-cy',
					'column-collapse-Opinion',
				);
				// Open the opinion menu
				cy.focused().type('{enter}').tab();
				cy.focused().should(
					'have.attr',
					'data-cy',
					'column-collapse-sublink-The Guardian view',
				);
			});
		});
	});
});
