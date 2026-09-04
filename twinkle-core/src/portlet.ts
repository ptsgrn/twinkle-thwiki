import { setDefaultConfig } from './Config';

/**
 * Set portlet configurations, which are skin-specific
 * XXX: move to Config.ts and avoid the function
 */
export function setPortletConfig() {
	// Some skin dependent config.
	switch (mw.config.get('skin')) {
		case 'vector':
			setDefaultConfig([
				{ name: 'portletArea', value: 'right-navigation' },
				{ name: 'portletId', value: 'p-twinkle' },
				{ name: 'portletName', value: 'TW' },
				{ name: 'portletType', value: 'menu' },
				{ name: 'portletNext', value: 'p-search' },
			]);
			break;
		case 'timeless':
			setDefaultConfig([
				{ name: 'portletArea', value: '#page-tools .sidebar-inner' },
				{ name: 'portletId', value: 'p-twinkle' },
				{ name: 'portletName', value: 'Twinkle' },
				{ name: 'portletType', value: null },
				{ name: 'portletNext', value: 'p-userpagetools' },
			]);
			break;
		default:
			setDefaultConfig([
				{ name: 'portletArea', value: null },
				{ name: 'portletId', value: 'p-cactions' },
				{ name: 'portletName', value: null },
				{ name: 'portletType', value: null },
				{ name: 'portletNext', value: null },
			]);
	}
}

/**
 * Builds a portlet menu if it doesn't exist yet, and add the portlet link.
 * @param task: Either a URL for the portlet link or a function to execute.
 * @param text
 * @param id
 * @param tooltip
 */
export function addPortletLink(task: string | (() => void), text: string, id: string, tooltip: string): HTMLLIElement {
	const portletId = addPortlet();
	let link = mw.util.addPortletLink(portletId, typeof task === 'string' ? task : '#', text, id, tooltip);
	$('.client-js .skin-vector #p-cactions').css('margin-right', 'initial');
	if (typeof task === 'function') {
		$(link).click(function (ev) {
			task();
			ev.preventDefault();
		});
	}
	if ($.collapsibleTabs) {
		$.collapsibleTabs.handleResize();
	}
	return link;
}

/**
 * Adds the Twinkle portlet to the skin-specific navigation area.
 *
 * @returns the id of the portlet that links should be added to
 */
function addPortlet(): string {
	let navigation: string;
	let id: string;
	let text: string;
	let nextnodeid: string;
	const skin = mw.config.get('skin');

	switch (skin) {
		case 'vector':
		case 'vector-2022':
			navigation = '#right-navigation';
			id = 'p-twinkle';
			text = 'TW';
			// p-cactions is the only selector hint that produces a dropdown in Vector skins.
			nextnodeid = 'p-cactions';
			break;
		case 'timeless':
			navigation = '#page-tools .sidebar-inner';
			id = 'p-twinkle';
			text = 'Twinkle';
			nextnodeid = 'p-userpagetools';
			break;
		default:
			return 'p-cactions';
	}

	// Make sure navigation is a valid CSS selector.
	const root = document.querySelector(navigation);
	if (!root || document.getElementById(id)) {
		return id;
	}

	mw.util.addPortlet(id, text, '#' + nextnodeid);

	// p-cactions is the only selector hint that produces the desired dropdown,
	// so move the newly-created portlet to its intended position afterwards.
	if (skin === 'vector') {
		$('#p-twinkle').insertAfter('#p-cactions');
	} else if (skin === 'vector-2022') {
		const $landmark = $('#right-navigation > .vector-page-tools-landmark');
		$('#p-twinkle-dropdown').insertBefore($landmark);

		// This landmark is not a stable interface, so warn if Vector changes it.
		if (!$landmark.length) {
			mw.log.warn('Unexpected change in DOM');
		}
	}

	return id;
}
