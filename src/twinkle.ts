import { Twinkle, init, SiteConfig } from './core';
import messages from './messages.json';
import mwMessageList from './mw-messages';

// import modules
import { Fluff } from './fluff';

// no customisation; import directly from core
import { DiffCore as Diff } from './core';

// register some globals for debugging, as per twinkle v2
import './globals';
import { Block } from './block';
import { BatchDelete } from './batchdelete';
import { Unlink } from './unlink';
import { Protect } from './protect';
import { CSD } from './speedy';

// Check if account is experienced enough to use Twinkle
if (!Morebits.userIsInGroup('autoconfirmed') && !Morebits.userIsInGroup('confirmed')) {
	throw new Error('Twinkle: forbidden!');
}

Twinkle.userAgent = `Twinkle (${mw.config.get('wgWikiID')})`;

Twinkle.summaryAd = '';

Twinkle.changeTags = 'twinkle';

Twinkle.messageOverrides = messages;

Twinkle.extraMwMessages = mwMessageList;

// List of module classes enabled
Twinkle.registeredModules = [Block, Fluff, Diff, BatchDelete, Unlink, Protect, CSD];

/**
 * Adjust the following configurations if necessary
 * Check the documentation for each property here:
 * https://twinkle.toolforge.org/core-docs/modules/siteconfig.html
 */

SiteConfig.permalinkSpecialPageName = 'พิเศษ:ลิงก์ถาวร';

SiteConfig.botUsernameRegex = /(bot|บอต)\b/i;

SiteConfig.flaggedRevsNamespaces = [];

SiteConfig.redirectTagAliases = ['#REDIRECT', '#เปลี่ยนทาง'];

SiteConfig.signatureTimestampFormat = function (sigTimestamp) {
	const monthNames =
		'มกราคม กุมภาพันธ์ มีนาคม เมษายน พฤษภาคม มิถุนายน กรกฎาคม สิงหาคม กันยายน ตุลาคม พฤศจิกายน ธันวาคม'.split(
			' ',
		);
	const match = sigTimestamp.match(/^(\d{2}):(\d{2}), (\d{1,2}) (\S+) (\d{4}) \(\+07\)$/);
	if (!match) {
		return null;
	}
	const [, hour, minute, day, monthName, year] = match;
	const month = monthNames.indexOf(monthName);
	if (month === -1) {
		return null;
	}
	const date = new Date(Date.UTC(+year - 543, month, +day, +hour - 7, +minute));
	return [
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
	];
};

// Go!
init();
