import { BlockCore, BlockPresetInfo, msg } from './core';

export class Block extends BlockCore {
	footerlinks = {
		'แม่แบบบล็อกผู้ใช้': 'Template:Uw-block/doc/Block_templates',
		'นโยบายการบล็อก': 'WP:BLOCK',
		'การตั้งค่าการบล็อก': 'WP:TW/PREF#block',
		'วิธีใช้ Twinkle': 'WP:TW/DOC#block',
		'ให้ข้อเสนอแนะ': 'WT:TW',
	};

	portletId = 'twinkle-block';

	beforeAddMenu() {
		this.portletName = 'บล็อกผู้ใช้';
		this.portletTooltip = 'บล็อกผู้ใช้ที่เกี่ยวกับหน้านี้';
	}

	blockPresetsInfo = {
		'anonblock': {
			expiry: '31 hours',
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{anonblock}}',
			sig: '~~~~',
		},
		'anonblock - school': {
			expiry: '36 hours',
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{anonblock}} <!-- อาจเป็นสถานศึกษาตามหลักฐานพฤติกรรม -->',
			templateName: 'anonblock',
			sig: '~~~~',
		},
		'บล็อกพร็อกซี': {
			expiry: '1 year',
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			hardblock: true,
			reason: '{{บล็อกพร็อกซี}}',
			sig: null,
		},
		'บล็อกโดยผู้ตรวจสอบผู้ใช้': {
			expiry: '1 week',
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{บล็อกโดยผู้ตรวจสอบผู้ใช้}}',
			sig: '~~~~',
			requireGroup: 'checkuser',
		},
		'บล็อกโดยผู้ตรวจสอบผู้ใช้-บัญชี': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{บล็อกโดยผู้ตรวจสอบผู้ใช้-บัญชี}}',
			sig: '~~~~',
			requireGroup: 'checkuser',
		},
		'บล็อกโดยผู้ตรวจสอบผู้ใช้-กว้าง': {
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{บล็อกโดยผู้ตรวจสอบผู้ใช้-กว้าง}}',
			sig: '~~~~',
			requireGroup: 'checkuser',
		},
		'uw-ablock': {
			autoblock: true,
			expiry: '31 hours',
			forAnonOnly: true,
			nocreate: true,
			pageParam: true,
			reasonParam: true,
			summary: 'ที่อยู่ไอพีของคุณถูกบล็อกจากการแก้ไข',
			suppressArticleInSummary: true,
		},
		'uw-adblock': {
			autoblock: true,
			nocreate: true,
			pageParam: true,
			reason: 'ใช้วิกิพีเดียเพื่อการ[[WP:SPAM|สแปม]]หรือ[[WP:ADVERT|โฆษณา]]',
			summary: 'คุณถูกบล็อกจากการแก้ไขเพื่อ[[WP:SOAP|โฆษณาหรือการโปรโมตตัวเอง]]',
		},
		'uw-bioblock': {
			autoblock: true,
			nocreate: true,
			pageParam: true,
			reason:
				'Violations of the [[WP:Biographies of living persons|biographies of living persons]] policy',
			summary:
				"You have been blocked from editing for violations of Wikipedia's [[WP:BLP|biographies of living persons policy]]",
		},
		'uw-block': {
			autoblock: true,
			expiry: '24 hours',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reasonParam: true,
			summary: 'คุณถูกบล็อกจากการแก้ไข',
			suppressArticleInSummary: true,
		},
		'uw-blockindef': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reasonParam: true,
			summary: 'คุณถูกบล็อกจากการแก้ไขอย่างถาวร',
			suppressArticleInSummary: true,
		},
		'uw-blocknotalk': {
			disabletalk: true,
			pageParam: true,
			reasonParam: true,
			summary: 'คุณถูกบล็อกจากการแก้ไขและสิทธิ์การเข้าถึงหน้าพูดคุยของคุณถูกปิดใช้งาน',
			suppressArticleInSummary: true,
		},
		'uw-botublock': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason: '{{uw-botublock}} <!-- Username implies a bot, soft block -->',
			summary:
				'คุณถูกบล็อกจากการแก้ไขอย่างถาวรเนื่องจาก[[WP:U|ชื่อผู้ใช้]]ของคุณบ่งชี้ว่าเป็นบัญชี[[WP:BOT|บอต]]ซึ่งยังไม่ได้รับการอนุมัติ',
		},
		'uw-botuhblock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: '{{uw-botuhblock}} <!-- Username implies a bot, hard block -->',
			summary:
				'You have been indefinitely blocked from editing because your username is a blatant violation of the [[WP:U|username policy]].',
		},
		'uw-causeblock': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason: '{{uw-causeblock}} <!-- Username represents a non-profit, soft block -->',
			summary:
				'You have been indefinitely blocked from editing because your [[WP:U|username]] gives the impression that the account represents a group, organization or website',
		},
		'uw-compblock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: 'Compromised account',
			summary:
				'You have been indefinitely blocked from editing because it is believed that your [[WP:SECURE|account has been compromised]]',
		},
		'uw-copyrightblock': {
			autoblock: true,
			expiry: 'infinity',
			nocreate: true,
			pageParam: true,
			reason: '[[WP:Copyright violations|Copyright violations]]',
			summary:
				'You have been blocked from editing for continued [[WP:COPYVIO|copyright infringement]]',
		},
		'uw-dblock': {
			autoblock: true,
			nocreate: true,
			reason: 'Persistent removal of content',
			pageParam: true,
			summary: 'You have been blocked from editing for continued [[WP:VAND|removal of material]]',
		},
		'uw-disruptblock': {
			autoblock: true,
			nocreate: true,
			reason: '[[WP:Disruptive editing|Disruptive editing]]',
			summary: 'You have been blocked from editing for [[WP:DE|disruptive editing]]',
		},
		'uw-efblock': {
			autoblock: true,
			nocreate: true,
			reason: 'Repeatedly triggering the [[WP:Edit filter|Edit filter]]',
			summary:
				'You have been blocked from editing for disruptive edits that repeatedly triggered the [[WP:EF|edit filter]]',
		},
		'uw-ewblock': {
			autoblock: true,
			expiry: '24 hours',
			nocreate: true,
			pageParam: true,
			reason: '[[WP:Edit warring|Edit warring]]',
			summary:
				'You have been blocked from editing to prevent further [[WP:DE|disruption]] caused by your engagement in an [[WP:EW|edit war]]',
		},
		'uw-hblock': {
			autoblock: true,
			nocreate: true,
			pageParam: true,
			reason: '[[WP:No personal attacks|Personal attacks]] or [[WP:Harassment|harassment]]',
			summary:
				'You have been blocked from editing for attempting to [[WP:HARASS|harass]] other users',
		},
		'uw-ipevadeblock': {
			forAnonOnly: true,
			nocreate: true,
			reason: '[[WP:Blocking policy#Evasion of blocks|Block evasion]]',
			summary:
				'Your IP address has been blocked from editing because it has been used to [[WP:EVADE|evade a previous block]]',
		},
		'uw-lblock': {
			autoblock: true,
			expiry: 'infinity',
			nocreate: true,
			reason: 'Making [[WP:No legal threats|legal threats]]',
			summary:
				'You have been blocked from editing for making [[WP:NLT|legal threats or taking legal action]]',
		},
		'uw-nothereblock': {
			autoblock: true,
			expiry: 'infinity',
			nocreate: true,
			reason: 'Clearly [[WP:NOTHERE|not here to build an encyclopedia]]',
			forRegisteredOnly: true,
			summary:
				'You have been indefinitely blocked from editing because it appears that you are not here to [[WP:NOTHERE|build an encyclopedia]]',
		},
		'uw-npblock': {
			autoblock: true,
			nocreate: true,
			pageParam: true,
			reason: 'Creating [[WP:Patent nonsense|patent nonsense]] or other inappropriate pages',
			summary: 'You have been blocked from editing for creating [[WP:PN|nonsense pages]]',
		},
		'uw-pablock': {
			autoblock: true,
			expiry: '31 hours',
			nocreate: true,
			reason: '[[WP:No personal attacks|Personal attacks]] or [[WP:Harassment|harassment]]',
			summary:
				'You have been blocked from editing for making [[WP:NPA|personal attacks]] toward other users',
		},
		'uw-sblock': {
			autoblock: true,
			nocreate: true,
			reason: 'Using Wikipedia for [[WP:SPAM|spam]] purposes',
			summary:
				'You have been blocked from editing for using Wikipedia for [[WP:SPAM|spam]] purposes',
		},
		'uw-soablock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reason: '[[WP:Spam|Spam]] / [[WP:NOTADVERTISING|advertising]]-only account',
			summary:
				'You have been indefinitely blocked from editing because your account is being used only for [[WP:SPAM|spam, advertising, or promotion]]',
		},
		'uw-socialmediablock': {
			autoblock: true,
			nocreate: true,
			pageParam: true,
			reason:
				'Using Wikipedia as a [[WP:NOTMYSPACE|blog, web host, social networking site or forum]]',
			summary:
				'You have been blocked from editing for using user and/or article pages as a [[WP:NOTMYSPACE|blog, web host, social networking site or forum]]',
		},
		'uw-sockblock': {
			autoblock: true,
			forRegisteredOnly: true,
			nocreate: true,
			reason: 'Abusing [[WP:Sock puppetry|multiple accounts]]',
			summary: 'You have been blocked from editing for abusing [[WP:SOCK|multiple accounts]]',
		},
		'uw-softerblock': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason: '{{uw-softerblock}} <!-- Promotional username, soft block -->',
			summary:
				'You have been indefinitely blocked from editing because your [[WP:U|username]] gives the impression that the account represents a group, organization or website',
		},
		'uw-spamublock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: '{{uw-spamublock}} <!-- Promotional username, promotional edits -->',
			summary:
				'You have been indefinitely blocked from editing because your account is being used only for [[WP:SPAM|spam or advertising]] and your username is a violation of the [[WP:U|username policy]]',
		},
		'uw-spoablock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: '[[WP:SOCK|Sock puppetry]]',
			summary:
				'This account has been blocked as a [[WP:SOCK|sock puppet]] created to violate Wikipedia policy',
		},
		'uw-talkrevoked': {
			disabletalk: true,
			reason: 'Revoking talk page access: inappropriate use of user talk page while blocked',
			prependReason: true,
			summary: 'Your user talk page access has been disabled',
			useInitialOptions: true,
		},
		'uw-ublock': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason: '{{uw-ublock}} <!-- Username violation, soft block -->',
			reasonParam: true,
			summary:
				'You have been indefinitely blocked from editing because your username is a violation of the [[WP:U|username policy]]',
		},
		'uw-ublock-double': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason: '{{uw-ublock-double}} <!-- Username closely resembles another user, soft block -->',
			summary:
				'You have been indefinitely blocked from editing because your [[WP:U|username]] is too similar to the username of another Wikipedia user',
		},
		'uw-ucblock': {
			autoblock: true,
			expiry: '31 hours',
			nocreate: true,
			pageParam: true,
			reason: 'Persistent addition of [[WP:INTREF|unsourced content]]',
			summary:
				'You have been blocked from editing for persistent addition of [[WP:INTREF|unsourced content]]',
		},
		'uw-uhblock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: '{{uw-uhblock}} <!-- Username violation, hard block -->',
			reasonParam: true,
			summary:
				'You have been indefinitely blocked from editing because your username is a blatant violation of the [[WP:U|username policy]]',
		},
		'uw-ublock-wellknown': {
			expiry: 'infinity',
			forRegisteredOnly: true,
			reason:
				'{{uw-ublock-wellknown}} <!-- Username represents a well-known person, soft block -->',
			summary:
				'You have been indefinitely blocked from editing because your [[WP:U|username]] matches the name of a well-known living individual',
		},
		'uw-uhblock-double': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			reason: '{{uw-uhblock-double}} <!-- Attempted impersonation of another user, hard block -->',
			summary:
				'You have been indefinitely blocked from editing because your [[WP:U|username]] appears to impersonate another established Wikipedia user',
		},
		'uw-upeblock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reason:
				'[[WP:PAID|Undisclosed paid editing]] in violation of the WMF [[WP:TOU|Terms of Use]]',
			summary:
				'You have been indefinitely blocked from editing because your account is being used in violation of [[WP:PAID|Wikipedia policy on undisclosed paid advocacy]]',
		},
		'uw-vaublock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reason: '{{uw-vaublock}} <!-- Username violation, vandalism-only account -->',
			summary:
				'You have been indefinitely blocked from editing because your account is being [[WP:VOA|used only for vandalism]] and your username is a blatant violation of the [[WP:U|username policy]]',
		},
		'uw-vblock': {
			autoblock: true,
			expiry: '31 hours',
			nocreate: true,
			pageParam: true,
			reason: '[[WP:การก่อกวน|ก่อกวน]]',
			summary: 'คุณถูกบล็อกจากการแก้ไขเพื่อป้องกัน[[WP:VAND|การก่อกวน]]เพิ่มเติม',
		},
		'uw-voablock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: true,
			reason: '[[WP:Vandalism-only account|Vandalism-only account]]',
			summary:
				'You have been indefinitely blocked from editing because your account is being [[WP:VOA|used only for vandalism]]',
		},
		'zombie proxy': {
			expiry: '1 month',
			forAnonOnly: true,
			nocreate: true,
			nonstandard: true,
			reason: '{{zombie proxy}}',
			sig: null,
		},

		// Begin partial block templates, accessed in Twinkle.block.blockGroupsPartial
		'uw-acpblock': {
			autoblock: true,
			expiry: '48 hours',
			nocreate: true,
			pageParam: false,
			reasonParam: true,
			reason: 'Misusing [[WP:Sock puppetry|multiple accounts]]',
			summary:
				'You have been [[WP:PB|blocked from creating accounts]] for misusing [[WP:SOCK|multiple accounts]]',
		},
		'uw-acpblockindef': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: true,
			pageParam: false,
			reasonParam: true,
			reason: 'Misusing [[WP:Sock puppetry|multiple accounts]]',
			summary:
				'You have been indefinitely [[WP:PB|blocked from creating accounts]] for misusing [[WP:SOCK|multiple accounts]]',
		},
		'uw-aepblock': {
			autoblock: true,
			nocreate: false,
			pageParam: false,
			reason: '[[WP:Arbitration enforcement|Arbitration enforcement]]',
			reasonParam: true,
			summary:
				'You have been [[WP:PB|partially blocked]] from editing for violating an [[WP:Arbitration|arbitration decision]]',
		},
		'uw-epblock': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: false,
			noemail: true,
			pageParam: false,
			reasonParam: true,
			reason: 'Email [[WP:Harassment|harassment]]',
			summary:
				'You have been [[WP:PB|blocked from emailing]] other editors for [[WP:Harassment|harassment]]',
		},
		'uw-ewpblock': {
			autoblock: true,
			expiry: '24 hours',
			nocreate: false,
			pageParam: false,
			reasonParam: true,
			reason: '[[WP:Edit warring|Edit warring]]',
			summary:
				'You have been [[WP:PB|partially blocked]] from editing certain areas of the encyclopedia to prevent further [[WP:DE|disruption]] due to [[WP:EW|edit warring]]',
		},
		'uw-pblock': {
			autoblock: true,
			expiry: '24 hours',
			nocreate: false,
			pageParam: false,
			reasonParam: true,
			summary: 'You have been [[WP:PB|partially blocked]] from certain areas of the encyclopedia',
		},
		'uw-pblockindef': {
			autoblock: true,
			expiry: 'infinity',
			forRegisteredOnly: true,
			nocreate: false,
			pageParam: false,
			reasonParam: true,
			summary:
				'You have been indefinitely [[WP:PB|partially blocked]] from certain areas of the encyclopedia',
		},
	} as const;

	blockGroups: (quickFormElementData & {
		list: {
			value: keyof Block['blockPresetsInfo'];
		}[];
	})[] = [
		{
			label: 'เหตุผลการบล็อกทั่วไป',
			list: [
				{ label: 'บล็อกไอพี', value: 'anonblock' },
				{ label: 'บล็อกไอพี - น่าจะเป็นโรงเรียน', value: 'anonblock - school' },
				// { label: 'school block', value: 'school block' },
				{ label: 'บล็อกทั่วไป (ระบุเหตุผลเอง)', value: 'uw-block' }, // ends up being default for registered users
				{ label: 'บล็อกทั่วไป (ระบุเหตุผลเอง) - IP', value: 'uw-ablock', selected: true }, // set only when blocking IP
				{ label: 'บล็อกทั่วไป (ระบุเหตุผลเอง) - ถาวร', value: 'uw-blockindef' },
				{ label: 'การแก้ไขที่ทำให้เสียระบบ', value: 'uw-disruptblock' },
				{ label: 'การใช้หน้าคุยโดยไม่เหมาะสมขณะถูกบล็อก', value: 'uw-talkrevoked' },
				{ label: 'ไม่ได้ตั้งใจมาเพื่อสร้างสารานุกรม', value: 'uw-nothereblock' },
				{ label: 'เพิ่มเนื้อหาที่ไม่มีแหล่งอ้างอิง', value: 'uw-ucblock' },
				{ label: 'การก่อกวน', value: 'uw-vblock' },
				{ label: 'บัญชีก่อกวนอย่างเดียว', value: 'uw-voablock' },
			],
		},
		{
			label: 'เหตุผลจำเพาะ',
			list: [
				{ label: 'โฆษณา', value: 'uw-adblock' },
				// { label: 'Arbitration enforcement', value: 'uw-aeblock' },
				{ label: 'การหลีกเลี่ยงการบล็อก - IP', value: 'uw-ipevadeblock' },
				{ label: 'การละเมิดนโยบายบุคคลมีชีวิตอยู่', value: 'uw-bioblock' },
				{ label: 'การละเมิดลิขสิทธิ์', value: 'uw-copyrightblock' },
				{ label: 'การสร้างหน้าที่ไม่มีสาระ', value: 'uw-npblock' },
				{ label: 'เกี่ยวข้องกับตัวกรอง', value: 'uw-efblock' },
				{ label: 'สงความแก้ไข', value: 'uw-ewblock' },
				{ label: 'การบล็อกโดยไม่ให้สิทธิ์หน้าคุย', value: 'uw-blocknotalk' },
				{ label: 'การรังควาน', value: 'uw-hblock' },
				{ label: 'ขู่ดำเนินคดี', value: 'uw-lblock' },
				{ label: 'โจมตีตัวบุคคลหรือรังควาน', value: 'uw-pablock' },
				{ label: 'บัญชีอาจถูกบุกรุก', value: 'uw-compblock' },
				{ label: 'ก่อกวนลบเนื้อหา', value: 'uw-dblock' },
				{ label: 'ผู้เชิดหุ่น', value: 'uw-sockblock' },
				{ label: 'บัญชีหุ่นเชิด', value: 'uw-spoablock' },
				{ label: 'พยายามทำเป็นสื่อสังคม', value: 'uw-socialmediablock' },
				{ label: 'สแปม', value: 'uw-sblock' },
				{ label: 'บัญชีสแปม/โฆษณาเท่านั้น', value: 'uw-soablock' },
				// { label: 'Unapproved bot', value: 'uw-botblock' },
				{ label: 'ได้รับค่าจ้างไม่ชี้แจง', value: 'uw-upeblock' },
				// { label: 'Violating the three-revert rule', value: 'uw-3block' },
			],
		},
		{
			label: 'การละเมิดนโยบายชื่อผู้ใช้',
			list: [
				// { label: 'Bot username, soft block', value: 'uw-botublock' },
				{ label: 'Bot username, hard block', value: 'uw-botuhblock' },
				{ label: 'Promotional username, hard block', value: 'uw-spamublock' },
				{ label: 'Promotional username, soft block', value: 'uw-softerblock' },
				{ label: 'Similar username, soft block', value: 'uw-ublock-double' },
				{ label: 'Username violation, soft block', value: 'uw-ublock' },
				{ label: 'Username violation, hard block', value: 'uw-uhblock' },
				{ label: 'Username impersonation, hard block', value: 'uw-uhblock-double' },
				{
					label: 'Username represents a well-known person, soft block',
					value: 'uw-ublock-wellknown',
				},
				{ label: 'Username represents a non-profit, soft block', value: 'uw-causeblock' },
				{ label: 'Username violation, vandalism-only account', value: 'uw-vaublock' },
			],
		},
		{
			label: 'Templated reasons',
			list: [
				{ label: 'บล็อกพร็อกซี', value: 'บล็อกพร็อกซี' },
				{ label: 'บล็อกโดยผู้ตรวจสอบผู้ใช้', value: 'บล็อกโดยผู้ตรวจสอบผู้ใช้' },
				{ label: 'บล็อกโดยผู้ตรวจสอบผู้ใช้-บัญชี', value: 'บล็อกโดยผู้ตรวจสอบผู้ใช้-บัญชี' },
				{ label: 'บล็อกโดยผู้ตรวจสอบผู้ใช้-กว้าง', value: 'บล็อกโดยผู้ตรวจสอบผู้ใช้-กว้าง' },
				// { label: 'colocationwebhost', value: 'colocationwebhost' },
				// { label: 'oversightblock', value: 'oversightblock' },
				// { label: 'rangeblock', value: 'rangeblock' }, // Only for IP ranges, selected for non-/64 ranges in filtered_block_groups
				// { label: 'spamblacklistblock', value: 'spamblacklistblock' },
				// { label: 'tor', value: 'tor' },
				// { label: 'webhostblock', value: 'webhostblock' },
				{ label: 'zombie proxy', value: 'zombie proxy' },
			],
		},
	];

	blockGroupsPartial = [
		{
			label: 'แม่แบบบล็อกบางส่วนทั่วไป',
			list: [
				{ label: 'แม่แบบบล็อกบางส่วนทั่วไป (ระบุเหตุผลเอง)', value: 'uw-pblock', selected: true },
				{ label: 'แม่แบบบล็อกบางส่วนทั่วไป (ระบุเหตุผลเอง) - ตลอดกาล', value: 'uw-pblockindef' },
				{ label: 'สงครามแก้ไข', value: 'uw-ewpblock' },
			],
		},
		{
			label: 'เหตุผลบล็อกบางส่วนจำเพาะ',
			list: [
				{ label: 'การบังคับกรณีตามคำตัดสินของ คอต.', value: 'uw-aepblock' },
				{ label: 'การล่วงละเมิดทางอีเมล', value: 'uw-epblock' },
				{ label: 'การใช้งานบัญชีหลายบัญชีอย่างไม่เหมาะสม', value: 'uw-acpblock' },
				{ label: 'การใช้งานบัญชีหลายบัญชีอย่างไม่เหมาะสม - ตลอดกาล', value: 'uw-acpblockindef' },
			],
		},
	];

	// disable Gadget/Gadget definition and their talk namespaces
	disablePartialBlockNamespaces = [2300, 2301, 2302, 2303];

	toggle_see_alsos(e: QuickFormEvent) {
		let checkbox = e.target;
		if (!checkbox.form) return;

		var reason = checkbox.form.reason.value.replace(
			new RegExp('( <!--|;) ' + 'ดูเพิ่มที่ ' + this.seeAlsos.join(' และ ') + '( -->)?'),
			'',
		);

		this.seeAlsos = this.seeAlsos.filter((el) => el !== checkbox.value);

		if (checkbox.checked) {
			this.seeAlsos.push(checkbox.value);
		}

		var seeAlsoMessage = this.seeAlsos.join(' และ ');

		if (!this.seeAlsos.length) {
			checkbox.form.reason.value = reason;
		} else if (reason.indexOf('{{') !== -1) {
			checkbox.form.reason.value = reason + ' <!-- ดูเพิ่มที่ ' + seeAlsoMessage + ' -->';
		} else {
			checkbox.form.reason.value = reason + '; ดูเพิ่มที่ ' + seeAlsoMessage;
		}
	}

	getBlockNoticeWikitextAndSummary(params) {
		var text = '{{',
			settings = this.blockPresetsInfo[params.template];
		if (!settings.nonstandard) {
			text += 'subst:' + params.template;
			if (params.article && settings.pageParam) {
				text += '|page=' + params.article;
			}
			if (params.dstopic) {
				text += '|topic=' + params.dstopic;
			}

			if (!/te?mp|^\s*$|min/.exec(params.expiry)) {
				if (params.indefinite) {
					text += '|indef=yes';
				} else if (!params.blank_duration && !new Morebits.date(params.expiry).isValid()) {
					// Block template wants a duration, not date
					text += '|time=' + params.expiry;
				}
			}

			if (!this.isRegistered && !params.hardblock) {
				text += '|anon=yes';
			}

			if (params.reason) {
				text += '|reason=' + params.reason;
			}
			if (params.disabletalk) {
				text += '|notalk=yes';
			}

			// Currently, all partial block templates are "standard"
			// Building the template, however, takes a fair bit of logic
			if (params.partial) {
				if (params.pagerestrictions.length || params.namespacerestrictions.length) {
					text += '|area=' + (params.indefinite ? 'certain ' : 'from certain ');
					if (params.pagerestrictions.length) {
						text +=
							'pages (' +
							mw.language.listToText(
								params.pagerestrictions.map((p) => {
									return '[[:' + p + ']]';
								}),
							);
						text += params.namespacerestrictions.length ? ') and certain ' : ')';
					}
					if (params.namespacerestrictions.length) {
						// 1 => Talk, 2 => User, etc.
						var namespaceNames = params.namespacerestrictions.map((id) => {
							return this.menuFormattedNamespaces[id];
						});
						text +=
							'[[Wikipedia:Namespace|namespaces]] (' + mw.language.listToText(namespaceNames) + ')';
					}
				} else if (params.area) {
					text += '|area=' + params.area;
				} else {
					if (params.noemail) {
						text += '|email=yes';
					}
					if (params.nocreate) {
						text += '|accountcreate=yes';
					}
				}
			}
		} else {
			text += params.template;
		}

		if (settings.sig) {
			text += '|sig=' + settings.sig;
		}
		text += '}}';

		// build the edit summary
		var summary = settings.summary as string;
		if (settings.suppressArticleInSummary !== true && params.article) {
			summary += ' ในหน้า [[:' + params.article + ']]';
		}

		return [text, summary] as [string, string];
	}

	dsinfo = {
		'': {
			code: '',
		},
		'Abortion': {
			code: 'rf',
			page: ':m:Wikimedia Thailand/Rangsitpol Family Topic Ban',
		},
	};
}
