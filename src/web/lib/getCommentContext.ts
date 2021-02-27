import { joinUrl } from '@root/src/lib/joinUrl';

// GET http://discussion.guardianapis.com/discussion-api/comment/3519111/context
// {
//     status: 'ok',
//     commentId: 3519111,
//     commentAncestorId: 3519111,
//     discussionKey: '/p/27y27',
//     discussionWebUrl:
//         'https://www.theguardian.com/commentisfree/cifamerica/2009/may/14/washington-post-torture-libel',
//     discussionApiUrl:
//         'https://discussion.guardianapis.com/discussion-api/discussion//p/27y27?orderBy=oldest&pageSize=20&page=1',
//     orderBy: 'oldest',
//     pageSize: 20,
//     page: 1,
// };

type CommentContextType = {
	status: 'ok' | 'error';
	commentId: number;
	commentAncestorId: number;
	discussionKey: string;
	discussionWebUrl: string;
	discussionApiUrl: string;
	orderBy: OrderByType;
	pageSize: PageSizeType; // TODO: Review these https://trello.com/c/7v4VDNY0/1326-review-page-size-values
	page: number;
};

type OrderByType = 'newest' | 'oldest' | 'recommendations';
type ThreadsType = 'collapsed' | 'expanded' | 'unthreaded';
type PageSizeType = 25 | 50 | 100;

interface FilterOptions {
	orderBy: OrderByType;
	pageSize: PageSizeType;
	threads: ThreadsType;
}

const initFiltersFromLocalStorage = (): FilterOptions => {
	let threads: { [key: string]: ThreadsType } | undefined;
	let pageSize: { [key: string]: PageSizeType } | undefined;
	let orderBy: { [key: string]: OrderByType } | undefined;

	try {
		// Try to read from local storage
		orderBy = JSON.parse(
			localStorage.getItem('gu.prefs.discussion.order') || '{}',
		);
		threads = JSON.parse(
			localStorage.getItem('gu.prefs.discussion.threading') || '{}',
		);
		pageSize = JSON.parse(
			localStorage.getItem('gu.prefs.discussion.pagesize') || '{}',
		);
	} catch (error) {
		// Sometimes it's not possible to access localStorage, we accept this and don't want to
		// capture these errors
		return {
			orderBy: 'newest',
			pageSize: 25,
			threads: 'collapsed',
		};
	}

	// If we found something in LS, use it, otherwise return defaults
	return {
		orderBy: orderBy && orderBy.value ? orderBy.value : 'newest',
		threads: threads && threads.value ? threads.value : 'collapsed',
		pageSize: pageSize && pageSize.value ? pageSize.value : 25,
	};
};

const buildParams = (filters: FilterOptions) => {
	return {
		// Frontend uses the 'recommendations' key to store this options but the api expects
		// 'mostRecommended' so we have to map here to support both
		orderBy:
			filters.orderBy === 'recommendations'
				? 'mostRecommended'
				: filters.orderBy,
		pageSize: filters.pageSize,
		displayThreaded:
			filters.threads === 'collapsed' || filters.threads === 'expanded',
	};
};

export const getCommentContext = async (
	ajaxUrl: string,
	commentId: number,
): Promise<CommentContextType> => {
	const url = joinUrl([ajaxUrl, 'comment', commentId.toString(), 'context']);
	const filters = initFiltersFromLocalStorage();
	const paramsObj = buildParams(filters);

	const params = Object.keys(paramsObj)
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		.map((key) => `${key}=${paramsObj[key]}`)
		.join('&');

	return fetch(`${url}?${params}`)
		.then((response) => {
			if (!response.ok) {
				throw Error(
					response.statusText ||
						`getCommentContext | An api call returned HTTP status ${response.status}`,
				);
			}
			return response;
		})
		.then((response) => response.json())
		.catch((error) => {
			window.guardian.modules.sentry.reportError(
				error,
				'get-comment-page',
			);
		});
};
