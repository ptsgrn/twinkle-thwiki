import { NS_MAIN, ProtectCore } from './core';
import { hatnoteRegex } from './common';

export class Protect extends ProtectCore {
	footerlinks = {
		'แม่แบบป้องกันหน้า': 'Template:Protection templates',
		'นโยบายการป้องกัน': 'WP:PROT',
		'วิธีใช้ Twinkle': 'WP:TW/DOC#protect',
		'แสดงความคิดเห็น': 'WT:TW',
	};

	portletTooltip = Morebits.userIsSysop ? 'ป้องกันหน้า' : 'ส่งคำขอป้องกันหน้า';
	windowTitle = Morebits.userIsSysop
		? 'ใช้ ส่งคำขอ หรือใส่ป้ายป้องกันหน้า'
		: 'ส่งคำขอหรือใส่ป้ายหน้าถูกป้องกัน';

	requestPageName = 'วิกิพีเดีย:แจ้งผู้ดูแลระบบ/แจ้งความ';
	requestPageAcronym = 'AN/I';

	getProtectionLevels() {
		return $.extend(true, super.getProtectionLevels(), {
			autoconfirmed: {
				// Per [[WP:ACPERM]]
				applicable: (type) =>
					!(type === 'create' && mw.config.get('wgNamespaceNumber') === NS_MAIN),
			},
		});
	}

	existingTagRegex = /\s*(?:<noinclude>)?\s*\{\{\s*(pp-[^{}]*?|protected|(?:t|v|s|p-|usertalk-v|usertalk-s|sb|move)protected(?:2)?|protected template|privacy protection|(กึ่ง)?ล็อก(แม่แบบ|โต้เถียง|ย้าย|สร้างบทความ|สร้าง)?)\s*?\}\}\s*(?:<\/noinclude>)?\s*/gi;

	disableTaggingOnRedirectTemplateRegex = /{{(?:redr|this is a redirect|r(?:edirect)?(?:.?cat.*)?[ _]?sh)/i;

	insertTagIntoPage(text: string, tag: string): string {
		return new Morebits.wikitext.page(text).insertAfterTemplates(tag, hatnoteRegex).getText();
	}

	existingRequestRegex = new RegExp(
		'===\\s*(\\[\\[)?\\s*:?\\s*' +
			Morebits.string.escapeRegExp(Morebits.pageNameNorm) +
			'\\s*(\\]\\])?\\s*===',
		'm'
	);

	getProtectionPresets(): quickFormElementData[] {
		return [
			{ label: 'ไม่ป้องกัน', value: 'unprotect' },
			{
				label: 'ป้องกันเต็มรูปแบบ',
				list: [
					{ label: 'ทั่วไป (เต็มรูปแบบ)', value: 'pp-protected' },
					{
						label: 'ข้อพิพาทเนื้อหา/สงครามแก้ไข (เต็มรูปแบบ)',
						value: 'pp-dispute',
						reason: 'ข้อพิพาทเนื้อหา/สงครามแก้ไข',
					},
					{
						label: 'การก่อกวนอย่างต่อเนื่อง (เต็มรูปแบบ)',
						value: 'pp-vandalism',
						reason: '[[WP:VAND|การก่อกวน]]จำนวนมาก',
					},
					{
						label: 'หน้าคุยของผู้ใช้ที่ถูกบล็อก (เต็มรูปแบบ)',
						value: 'pp-usertalk',
						reason: 'การใช้หน้าคุยกับผู้ใช้ที่ไม่เหมาะสมในขณะที่ถูกบล็อก',
					},
				],
			},
			{
				label: 'กึ่งป้องกัน',
				list: [
					{ label: 'ทั่วไป (กึ่งป้องกัน)', value: 'pp-semi-protected' },
					{
						label: 'การก่อกวนอย่างต่อเนื่อง (กึ่งป้องกัน)',
						selected: true,
						value: 'pp-semi-vandalism',
						reason: '[[WP:VAND|การก่อกวน]]จำนวนมาก',
					},
					{
						label: 'การแก้ไขที่ทำให้เสียระบบ (กึ่งป้องกัน)',
						value: 'pp-semi-disruptive',
						reason:
							'[[วิกิพีเดีย:การแก้ไขที่ทำให้เสียระบบ|การแก้ไขที่ทำให้เสียระบบ]]อย่างต่อเนื่อง',
					},
					{
						label: 'เพิ่มเนื้อหาที่ไม่มีอ้างอิง (กึ่งป้องกัน)',
						value: 'pp-semi-unsourced',
						reason:
							'การเพิ่ม[[WP:INTREF|เนื้อหาที่ไม่มีอ้างอิงหรือมีแหล่งที่มาไม่ดี]]อย่างต่อเนื่อง',
					},
					{
						label: 'ละเมิดนโยบายบุคคลที่ยังมีชีวิตอยู่ (กึ่งป้องกัน)',
						value: 'pp-semi-blp',
						reason: 'การละเมิด[[WP:BLP|นโยบายบุคคลที่ยังมีชีวิตอยู่]]',
					},
					{
						label: 'หุ่นเชิด (กึ่งป้องกัน)',
						value: 'pp-semi-sock',
						reason: '[[WP:SOCK|หุ่นเชิด]]',
					},
					{
						label: 'หน้าคุยของผู้ใช้ที่ถูกบล็อก (กึ่งป้องกัน)',
						value: 'pp-semi-usertalk',
						reason: 'การใช้หน้าคุยกับผู้ใช้ที่ไม่เหมาะสมในขณะที่ถูกบล็อก',
					},
					{
						label: 'แม่แบบความเสี่ยงสูง (กึ่งป้องกัน)',
						value: 'pp-semi-template',
						reason: '[[WP:แม่แบบความเสี่ยงสูง|แม่แบบความเสี่ยงสูง]]',
					},
				],
			},
			{
				label: 'การป้องกันการย้ายหน้า',
				list: [
					{ label: 'ทั่วไป (การย้าย)', value: 'pp-move' },
					{
						label: 'ข้อพิพาท/สงครามการย้าย (การย้าย)',
						value: 'pp-move-dispute',
						reason: 'ข้อพิพาท/สงครามการย้าย',
					},
					{
						label: 'การก่อกวนการย้ายหน้า (การย้าย)',
						value: 'pp-move-vandalism',
						reason: 'การก่อกวนการย้ายหน้า',
					},
					{
						label: 'หน้าที่มีการมองเห็นสูง (การย้าย)',
						value: 'pp-move-indef',
						reason: 'หน้าสำคัญ',
					},
				],
			},
		];
	}

	getCreateProtectionPresets(): quickFormElementData[] {
		return [
			{ label: 'การยกเลิกการป้องกัน', value: 'unprotect' },
			{
				label: 'การป้องกันการสร้างหน้า',
				list: [
					{ label: 'ทั่วไป ({{pp-create}})', value: 'pp-create' },
					{ label: 'ชื่อที่ไม่เหมาะสม', value: 'pp-create-offensive', reason: 'ชื่อที่ไม่เหมาะสม' },
					{
						label: 'สร้างซ้ำหลายครั้ง',
						selected: true,
						value: 'pp-create-salt',
						reason: 'สร้างซ้ำหลายครั้ง',
					},
					{
						label: 'การละเมิดนโยบายบุคคลที่ยังมีชีวิตอยู่ที่เพิ่งลบล่าสุด',
						value: 'pp-create-blp',
						reason: 'การละเมิดนโยบายบุคคลที่ยังมีชีวิตอยู่ที่เพิ่งลบล่าสุด',
					},
				],
			},
		];
	}

	// NOTICE: keep this synched with [[MediaWiki:Protect-dropdown]]
	// Also note: stabilize = Pending Changes level
	// expiry will override any defaults
	protectionPresetsInfo = {
		'pp-protected': {
			edit: 'sysop',
			move: 'sysop',
			reason: null,
		},
		'pp-dispute': {
			edit: 'sysop',
			move: 'sysop',
			reason: '[[WP:PP|ข้อพิพาทเนื้อหา/สงครามแก้ไข]]',
		},
		'pp-vandalism': {
			edit: 'sysop',
			move: 'sysop',
			reason: '[[WP:VAND|การก่อกวน]]จำนวนมาก',
		},
		'pp-usertalk': {
			edit: 'sysop',
			move: 'sysop',
			expiry: 'infinity',
			reason: '[[WP:PP|การใช้หน้าคุยกับผู้ใช้ที่ไม่เหมาะสมในขณะที่ถูกบล็อก]]',
		},
		'pp-template': {
			edit: 'templateeditor',
			move: 'templateeditor',
			expiry: 'infinity',
			reason: '[[WP:แม่แบบความเสี่ยงสูง|แม่แบบความเสี่ยงสูง]]',
		},
		'pp-semi-vandalism': {
			edit: 'autoconfirmed',
			reason: '[[WP:VAND|การก่อกวน]]จำนวนมาก',
			template: 'pp-vandalism',
		},
		'pp-semi-disruptive': {
			edit: 'autoconfirmed',
			reason: '[[WP:Disruptive editing|การแก้ไขที่ทำให้เสียระบบ]]อย่างต่อเนื่อง',
			template: 'pp-protected',
		},
		'pp-semi-unsourced': {
			edit: 'autoconfirmed',
			reason: 'การเพิ่ม[[WP:INTREF|เนื้อหาที่ไม่มีอ้างอิงหรือมีแหล่งที่มาไม่ดี]]อย่างต่อเนื่อง',
			template: 'pp-protected',
		},
		'pp-semi-blp': {
			edit: 'autoconfirmed',
			reason: 'การละเมิดนโยบาย[[WP:BLP|บุคคลที่ยังมีชีวิตอยู่]]',
			template: 'pp-blp',
		},
		'pp-semi-usertalk': {
			edit: 'autoconfirmed',
			move: 'autoconfirmed',
			expiry: 'infinity',
			reason: '[[WP:PP|การใช้หน้าคุยกับผู้ใช้ที่ไม่เหมาะสมในขณะที่ถูกบล็อก]]',
			template: 'pp-usertalk',
		},
		'pp-semi-template': {
			// removed for now
			edit: 'autoconfirmed',
			move: 'autoconfirmed',
			expiry: 'infinity',
			reason: '[[WP:แม่แบบความเสี่ยงสูง|แม่แบบความเสี่ยงสูง]]',
			template: 'pp-template',
		},
		'pp-semi-sock': {
			edit: 'autoconfirmed',
			reason: '[[WP:หุ่นเชิด|การใช้หุ่นเชิด]]แก้ไขอย่างต่อเนื่อง',
			template: 'pp-sock',
		},
		'pp-semi-protected': {
			edit: 'autoconfirmed',
			reason: null,
			template: 'pp-protected',
		},
		'pp-move': {
			move: 'sysop',
			reason: null,
		},
		'pp-move-dispute': {
			move: 'sysop',
			reason: '[[WP:MOVP|ข้อพิพาท/สงครามย้าย]]',
		},
		'pp-move-vandalism': {
			move: 'sysop',
			reason: '[[WP:MOVP|การก่อกวนการย้ายหน้า]]',
		},
		'pp-move-indef': {
			move: 'sysop',
			expiry: 'infinity',
			reason: '[[WP:MOVP|หน้าที่มีผู้ชมสูง]]',
		},
		'unprotect': {
			edit: 'all',
			move: 'all',
			stabilize: 'none',
			create: 'all',
			reason: null,
			template: 'none',
		},
		'pp-create-offensive': {
			create: 'sysop',
			reason: '[[WP:SALT|ชื่อที่ไม่เหมาะสม]]',
		},
		'pp-create-salt': {
			create: 'extendedconfirmed',
			reason: '[[WP:SALT|สร้างซ้ำหลายครั้ง]]',
		},
		'pp-create-blp': {
			create: 'extendedconfirmed',
			reason: '[[WP:BLPDEL|บุคคลที่ยังมีชีวิตอยู่ที่ถูกลบล่าสุด]]',
		},
		'pp-create': {
			create: 'extendedconfirmed',
			reason: '{{pp-create}}',
		},
	};

	protectionTags = [
		{
			label: 'ไม่มี (ลบแม่แบบการป้องกันที่มีอยู่)',
			value: 'none',
		},
		{
			label: 'ไม่มี (ไม่ลบแม่แบบการป้องกันที่มีอยู่)',
			value: 'noop',
		},
		{
			label: 'แม่แบบการป้องกันการแก้ไข',
			list: [
				{ label: '{{pp-vandalism}}: การก่อกวน', value: 'pp-vandalism' },
				{ label: '{{pp-dispute}}: ข้อพิพาท/สงครามแก้ไข', value: 'pp-dispute' },
				{ label: '{{pp-blp}}: การละเมิด BLP', value: 'pp-blp' },
				{ label: '{{pp-sock}}: การใช้หุ่นเชิด', value: 'pp-sock' },
				{ label: '{{pp-template}}: แม่แบบความเสี่ยงสูง', value: 'pp-template' },
				{ label: '{{pp-usertalk}}: การใช้หน้าคุยกับผู้ใช้ที่ไม่เหมาะสม', value: 'pp-usertalk' },
				{ label: '{{pp-protected}}: การป้องกันทั่วไป', value: 'pp-protected' },
				{ label: '{{pp-semi-indef}}: การป้องกันกึ่งถาวรระยะยาวทั่วไป', value: 'pp-semi-indef' },
			],
		},
		{
			label: 'Move protection templates',
			list: [
				{ label: '{{pp-move-dispute}}: ข้อพิพาท/สงครามย้าย', value: 'pp-move-dispute' },
				{ label: '{{pp-move-vandalism}}: การก่อกวนการย้ายหน้า', value: 'pp-move-vandalism' },
				{ label: '{{pp-move-indef}}: การป้องกันถาวรระยะยาวทั่วไป', value: 'pp-move-indef' },
				{ label: '{{pp-move}}: อื่นๆ', value: 'pp-move' },
			],
		},
	];
}
