import { Api, criterion, Dialog, getPref, makeArray, Page, SpeedyCore, Twinkle } from './core';

export class CSD extends SpeedyCore {
	footerlinks = {
		'เงื่อนไขสำหรับการลบทันที': 'WP:CSD',
		'วิธีใช้ Twinkle': 'WP:TW/DOC#speedy',
		'เสนอแนะการใช้งาน': 'WT:TW',
	};

	windowTitle = 'เลือกเงื่อนไขสำหรับการลบทันที';

	beforeAddMenu() {
		this.portletName = 'ลบทันที';
		this.portletTooltip = Morebits.userIsSysop
			? 'ลบหน้านี้ตามนโยบายลบทันที'
			: 'ติดป้ายแจ้งลบให้ผู้ดูแลระบบลบหน้านี้ตามนโยบายลบทันที';
	}

	getTaggingCode() {
		const specificTemplates: Record<string, string> = {
			ท4: 'ลบ-ท4',
			ท5: 'ลบ-ท5',
			ท6: 'ลบ-ท6',
			ท10: 'ลบ-ท10',
			ปท1: 'ลบ-ปท1',
			ฟ5: 'ลบ-ฟ5',
			ม2: 'ลบ-ม2',
			ผ1: 'ลบ-ผ1',
		};

		const generalReasons: string[] = [];
		const criterionTemplates: string[] = [];

		this.params.csd.forEach((value: string, index: number) => {
			const criterion = this.flatObject[value];
			if (value === 'reason') {
				const customReason = this.params.templateParams[index]['1'];
				if (customReason) {
					generalReasons.push(customReason);
				}
				return;
			}

			const templateName = specificTemplates[criterion.code];

			if (!templateName) {
				const excerpt = String(criterion.label).replace(/^[^:]+:\s*/, '');
				generalReasons.push(`[[WP:${criterion.code}|${criterion.code}]]: ${excerpt}`);
				return;
			}

			const templateParams = this.params.templateParams[index];
			const parameters = Object.keys(templateParams)
				.map((parameter) => `|${parameter}=${templateParams[parameter]}`)
				.join('');
			criterionTemplates.push(`{{${templateName}${parameters}}}`);
		});

		if (generalReasons.length) {
			criterionTemplates.unshift(`{{ลบ|${generalReasons.join(', ')}}}`);
		}

		return criterionTemplates.join('\n');
	}

	criteriaLists: Array<{
		label: string;
		visible: (self: SpeedyCore) => boolean;
		list: criterion[];
	}> = [
		{
			label: 'เหตุผลกำหนดเอง',
			visible: (self) => !self.mode.isMultiple,
			list: [
				{
					label: 'เหตุผลอื่นที่ไม่ตรงกับเกณฑ์ด้านล่าง',
					value: 'reason',
					code: 'ลบ',
					tooltip: 'ระบุเหตุผลที่จะใส่ในแม่แบบ {{ลบ|เหตุผล}}',
					subgroup: {
						name: 'reason_1',
						parameter: '1',
						type: 'input',
						label: 'เหตุผล: ',
						size: 60,
					},
					hideWhenMultiple: true,
				},
			],
		},
		{
			label: 'ทั่วไป',
			visible: () => true,
			list: [
				{
					label: 'ท1: ไม่มีเนื้อหาอย่างชัดเจน ไม่มีความหมาย หรือไม่อาจเข้าใจได้',
					value: 'ท1',
					code: 'ท1',
					tooltip:
						'ทั้งหน้าเป็นข้อความไม่ปะติดปะต่อหรือไร้ความหมาย และไม่มีเนื้อหาหรือประวัติที่มีความหมาย',
					hideInNamespaces: [2],
				},
				{
					label: 'ท2: หน้าทดลอง',
					value: 'ท2',
					code: 'ท2',
					tooltip:
						'หน้าที่สร้างเพื่อทดลองการแก้ไขหรือฟังก์ชันของวิกิพีเดีย ไม่รวมหน้าทดลองเขียนหลัก หน้าในเนมสเปซผู้ใช้ และแม่แบบสมบูรณ์ที่ไม่ได้ใช้หรือซ้ำซ้อน',
					hideInNamespaces: [2],
				},
				{
					label: 'ท3: การก่อกวนและหลอกลวงชัดแจ้ง',
					value: 'ท3',
					code: 'ท3',
					tooltip:
						'ทั้งหน้าเป็นการก่อกวน ข้อมูลเท็จหรือเรื่องหลอกลวงอย่างชัดแจ้ง รวมถึงหน้าเปลี่ยนทางที่เกิดจากการก่อกวนย้ายหน้า',
				},
				{
					label: 'ท4: การลบทางเทคนิค',
					value: 'ท4',
					code: 'ท4',
					tooltip:
						'การบำรุงรักษาที่ไม่มีข้อพิพาท เช่น เปิดทางให้ย้ายหน้า ลบหน้าแก้ความกำกวมที่ไม่จำเป็น หรือแก้หน้าที่สร้างผิดที่',
					subgroup: {
						name: 'ท4_rationale',
						parameter: 'rationale',
						type: 'input',
						label: 'เหตุผลทางเทคนิค: ',
						size: 60,
					},
				},
				{
					label: 'ท5: ผู้เริ่มเขียนแจ้งลบ',
					value: 'ท5',
					code: 'ท5',
					tooltip:
						'ผู้ที่เพิ่มเนื้อหาสาระสำคัญเพียงผู้เดียวร้องขอโดยสุจริต หรือทำหน้าว่างในกรณีที่นับเป็นคำขอลบได้ ไม่ใช้กับหน้าคุยกับผู้ใช้',
				},
				{
					label: 'ท6: หน้าซึ่งขึ้นกับหน้าว่าง',
					value: 'ท6',
					code: 'ท6',
					tooltip:
						'เช่น หน้าพูดคุยหรือหน้าย่อยกำพร้า หน้าไฟล์ที่ไม่มีไฟล์ และหน้าเปลี่ยนทางเสีย โดยไม่รวมหน้าที่ยังเป็นประโยชน์ต่อโครงการ',
					subgroup: {
						name: 'ท6_page',
						parameter: '1',
						type: 'input',
						label: 'หน้าที่ไม่มีอยู่หรือถูกลบแล้ว (ถ้ามี): ',
						size: 60,
					},
				},
				{
					label: 'ท7: หน้าโจมตี ข่มขู่ หรือก่อกวน',
					value: 'ท7',
					code: 'ท7',
					tooltip:
						'หน้าที่มีจุดประสงค์เพียงดูหมิ่น โจมตี ข่มขู่ หรือก่อกวน และไม่มีรุ่นเป็นกลางในประวัติให้ย้อนกลับ',
					redactContents: true,
				},
				{
					label: 'ท8: การโฆษณาหรือส่งเสริมชัดเจน',
					value: 'ท8',
					code: 'ท8',
					tooltip:
						'ทั้งหน้าเป็นการส่งเสริมและต้องเขียนใหม่โดยพื้นฐานจึงจะเป็นสารานุกรม การส่งเสริมไม่จำกัดเฉพาะเชิงพาณิชย์',
				},
				{
					label: 'ท9: การสร้างหน้าที่เคยถูกลบใหม่',
					value: 'ท9',
					code: 'ท9',
					tooltip:
						'สำเนาที่เหมือนอย่างมีนัยสำคัญกับหน้าซึ่งการอภิปรายลบล่าสุดมีมติให้ลบ โดยยังไม่ได้ปรับปรุงเพียงพอและเหตุแห่งการลบยังคงอยู่',
				},
				{
					label: 'ท10: ฉบับร่างหรือหน้าชั่วคราวที่ไม่ได้รับการพัฒนาต่อ',
					value: 'ท10',
					code: 'ท10',
					tooltip:
						'หน้าในเนมสเปซฉบับร่างหรือฉบับร่างในเนมสเปซผู้ใช้ที่ไม่มีผู้ใช้แก้ไขเป็นเวลาหกเดือน โดยไม่นับการแก้ไขของบอต',
					showInNamespaces: [2, 118],
					hideWhenRedirect: true,
					subgroup: {
						type: 'hidden',
						name: 'ท10_timestamp',
						parameter: 'ts',
						value: '$TIMESTAMP',
					},
				},
			],
		},
		{
			label: 'บทความ',
			visible: (self) => !self.isRedirect && [0, 100].includes(self.namespace),
			list: [
				{
					label: 'บ1: ขาดบริบท',
					value: 'บ1',
					code: 'บ1',
					tooltip: 'บทความสั้นมากจนมีบริบทไม่เพียงพอที่จะระบุว่าหัวเรื่องของบทความคืออะไร',
				},
				{
					label: 'บ2: บทความภาษาต่างประเทศ หรือคาดว่าใช้โปรแกรมแปลภาษา',
					value: 'บ2',
					code: 'บ2',
					tooltip:
						'เนื้อหาส่วนใหญ่หรือทั้งหมดไม่ใช่ภาษาไทย หรือเป็นภาษาไทยที่เรียบเรียงไม่ถูกต้องจนอ่านจับใจความไม่ได้',
				},
				{
					label: 'บ3: ขาดเนื้อหา',
					value: 'บ3',
					code: 'บ3',
					tooltip:
						'มีเพียงลิงก์ หมวดหมู่ ส่วนดูเพิ่ม การกล่าวชื่อซ้ำ ข้อความสนทนา แม่แบบ หรือภาพ โดยไม่มีเนื้อหาสารานุกรม',
				},
				{
					label: 'บ4: บทความที่ย้ายข้ามโครงการแล้ว',
					value: 'บ4',
					code: 'บ4',
					tooltip:
						'นิยาม แหล่งข้อมูลปฐมภูมิ หรือเรื่องที่มีมติให้ย้าย ถูกย้ายไปโครงการอื่นและบันทึกสารสนเทศผู้แต่งเรียบร้อยแล้ว',
				},
				{
					label: 'บ5: ไม่มีสิ่งชี้บอกความสำคัญ',
					value: 'บ5',
					code: 'บ5',
					tooltip:
						'บทความเกี่ยวกับบุคคล สัตว์เฉพาะตัว องค์การ เนื้อหาเว็บ หรือผลงานดนตรีที่ไม่ชี้ความสำคัญหรือความโดดเด่น ไม่รวมสถาบันการศึกษา',
				},
				{
					label: 'บ6: บทความเพิ่งสร้างที่เป็นสำเนาของหัวเรื่องที่มีอยู่เดิม',
					value: 'บ6',
					code: 'บ6',
					tooltip:
						'บทความใหม่ซ้ำเรื่องที่มีอยู่ ไม่ได้เพิ่มหรือปรับปรุงสาระที่รวมได้ และชื่อไม่ควรเก็บเป็นหน้าเปลี่ยนทาง',
				},
			],
		},
		{
			label: 'หน้าเปลี่ยนทาง',
			visible: (self) => self.isRedirect,
			list: [
				{
					label: 'ปท1: การเปลี่ยนทางข้ามเนมสเปซ',
					value: 'ปท1',
					code: 'ปท1',
					tooltip:
						'หน้าเปลี่ยนทางจากเนมสเปซหลักไปเนมสเปซอื่น ยกเว้นหมวดหมู่ แม่แบบ วิกิพีเดีย วิธีใช้ และสถานีย่อย',
					showInNamespaces: [0],
				},
				{
					label: 'ปท2: ความผิดพลาดในการพิมพ์',
					value: 'ปท2',
					code: 'ปท2',
					tooltip:
						'หน้าเปลี่ยนทางที่เพิ่งสร้างจากคำพิมพ์ผิดหรือชื่อผิดที่ไม่น่าใช้ ไม่รวมคำผิดที่เป็นประโยชน์หรือหน้าเปลี่ยนทางจากการย้ายหรือรวมหน้า',
				},
			],
		},
		{
			label: 'ไฟล์',
			visible: (self) => !self.isRedirect && self.namespace === 6,
			list: [
				{
					label: 'ฟ1: เกิน',
					value: 'ฟ1',
					code: 'ฟ1',
					tooltip:
						'สำเนาที่ไม่ได้ใช้หรือมีคุณภาพหรือความละเอียดต่ำกว่าของไฟล์อื่นในวิกิพีเดียภาษาไทยซึ่งมีรูปแบบไฟล์เดียวกัน ไม่รวมไฟล์ในคอมมอนส์',
				},
				{
					label: 'ฟ2: ภาพวิบัติหรือว่าง',
					value: 'ฟ2',
					code: 'ฟ2',
					tooltip:
						'ไฟล์วิบัติ สูญหาย หรือว่าง รวมถึงหน้าคำอธิบายไฟล์คอมมอนส์ที่ไม่มีสารสนเทศเฉพาะโครงการที่จำเป็นต้องเก็บ',
				},
				{
					label: 'ฟ3: สัญญาอนุญาตไม่มีผลใช้ได้',
					value: 'ฟ3',
					code: 'ฟ3',
					tooltip:
						'สื่อที่จำกัดใช้แบบไม่แสวงหากำไร ห้ามดัดแปลง ใช้เฉพาะวิกิพีเดีย หรือต้องได้รับอนุญาตก่อน และไม่เข้าเกณฑ์การใช้เนื้อหาไม่เสรี',
				},
				{
					label: 'ฟ4: ขาดสารสนเทศสัญญาอนุญาต',
					value: 'ฟ4',
					code: 'ฟ4',
					tooltip: 'ไฟล์ที่ยังขาดข้อมูลจำเป็นสำหรับยืนยันสถานภาพลิขสิทธิ์หลังติดป้ายมาแล้วเจ็ดวัน',
				},
				{
					label: 'ฟ5: สื่อไม่เสรีไม่ได้ใช้',
					value: 'ฟ5',
					code: 'ฟ5',
					tooltip:
						'สื่อไม่เสรีที่ไม่ใช้ในบทความหลังติดป้ายเกินเจ็ดวัน หรือใช้เฉพาะในบทความที่ถูกลบและไม่น่าจะนำไปใช้ในบทความอื่น',
				},
				{
					label: 'ฟ6: การอ้างใช้ลิขสิทธิ์ของผู้อื่นโดยชอบไม่ถูกต้อง',
					value: 'ฟ6',
					code: 'ฟ6',
					tooltip:
						'สื่อไม่เสรีที่อ้างใช้โดยชอบอย่างไม่สมเหตุผล อาจลบทันทีหรือหลังพ้นระยะสองหรือเจ็ดวันตามชนิดของปัญหา',
				},
				{
					label: 'ฟ7: มีไฟล์เดียวกันบนวิกิมีเดียคอมมอนส์',
					value: 'ฟ7',
					code: 'ฟ7',
					tooltip:
						'คอมมอนส์มีสำเนารูปแบบเดียวกันที่คุณภาพไม่ต่ำกว่า ข้อมูลสิทธิและประวัติครบถ้วน ไม่มีป้ายห้ามย้าย และไฟล์ท้องถิ่นไม่ได้รับการป้องกัน',
				},
				{
					label: 'ฟ8: ไฟล์ไม่ใช่สื่อซึ่งไม่เป็นประโยชน์',
					value: 'ฟ8',
					code: 'ฟ8',
					tooltip:
						'ไฟล์ที่เนื้อหาไม่ใช่ภาพ เสียง หรือภาพเคลื่อนไหว ไม่ได้ใช้ในบทความ และไม่น่ามีประโยชน์เชิงสารานุกรมในอนาคต',
				},
			],
		},
		{
			label: 'หมวดหมู่',
			visible: (self) => !self.isRedirect && self.namespace === 14,
			list: [
				{
					label: 'ม1: หมวดหมู่ว่าง',
					value: 'ม1',
					code: 'ม1',
					tooltip:
						'หมวดหมู่ที่ไม่มีบทความหรือหน้าใดอยู่เลยอย่างน้อยสี่วัน ไม่รวมหมวดหมู่ที่อาจว่างเป็นบางครั้ง เช่น หมวดหมู่ตรวจสอบ',
				},
				{
					label: 'ม2: เปลี่ยนชื่อหรือรวมหมวดหมู่',
					value: 'ม2',
					code: 'ม2',
					tooltip:
						'หมวดหมู่ที่เปลี่ยนชื่อหรือรวมเพื่อแก้ภาษา ทำตามหลักการตั้งชื่อ รักษารูปแบบให้สม่ำเสมอ หรือให้สัมพันธ์กับชื่อบทความ',
					subgroup: {
						name: 'ม2_rationale',
						parameter: 'rationale',
						type: 'input',
						label: 'เหตุผลในการเปลี่ยนชื่อหรือรวม: ',
						size: 60,
					},
				},
			],
		},
		{
			label: 'หน้าผู้ใช้',
			visible: (self) => self.namespace === 2,
			list: [
				{
					label: 'ผ1: เจ้าของหน้าผู้ใช้แจ้งลบ',
					value: 'ผ1',
					code: 'ผ1',
					tooltip:
						'หน้าผู้ใช้หรือหน้าย่อยส่วนบุคคลที่เจ้าของไม่ต้องการใช้แล้ว ไม่รวมหน้าคุยกับผู้ใช้',
				},
				{
					label: 'ผ2: ผู้ใช้ที่ไม่มีอยู่จริง',
					value: 'ผ2',
					code: 'ผ2',
					tooltip:
						'หน้าผู้ใช้ของบัญชีที่ไม่มีในระบบ ไม่รวมหน้าเก่าที่เปลี่ยนทางหลังเปลี่ยนชื่อ และชื่อผู้ใช้ที่ประกาศห้ามใช้',
				},
				{
					label: 'ผ3: ระเบียงภาพไม่เสรี',
					value: 'ผ3',
					code: 'ผ3',
					tooltip:
						'ระเบียงภาพในเนมสเปซผู้ใช้ที่ประกอบด้วยภาพใช้โดยชอบหรือภาพไม่เสรีเป็นส่วนใหญ่หรือทั้งหมด',
					hideWhenRedirect: true,
				},
			],
		},
	];

	preprocessParams() {
		const params = this.params;
		params.csd = makeArray(params.csd);
		params.normalizeds = params.csd.map((critValue) => {
			return this.flatObject[critValue].code;
		});
		this.getTemplateParameters();
		this.getMode();

		const preferenceIncludesSelectedCriterion = (preferenceName: string) => {
			const criteria = getPref(preferenceName);
			return (
				Array.isArray(criteria) &&
				params.normalizeds.some((criterionCode) => criteria.includes(criterionCode))
			);
		};

		if (this.mode.isSysop) {
			params.promptForSummary = preferenceIncludesSelectedCriterion(
				'promptForSpeedyDeletionSummary',
			);
			params.warnUser =
				params.warnusertalk && preferenceIncludesSelectedCriterion('warnUserOnSpeedyDelete');
		} else {
			params.notifyUser =
				params.notify &&
				preferenceIncludesSelectedCriterion('notifyUserOnSpeedyDeletionNomination');
			params.redactContents = params.csd.some((csd) => {
				return this.flatObject[csd].redactContents;
			});
		}
		params.watch =
			preferenceIncludesSelectedCriterion('watchSpeedyPages') && getPref('watchSpeedyExpiry');
		params.welcomeuser =
			(params.notifyUser || params.warnUser) &&
			preferenceIncludesSelectedCriterion('welcomeUserOnSpeedyDeletionNotification');

		this.preprocessParamInputs();
	}

	deleteRedirects() {
		let def = $.Deferred();
		let params = this.params;
		if (params.deleteRedirects) {
			let wikipedia_api = new Api('กำลังดึงรายการหน้าที่เปลี่ยนทางมาหน้านี้...', {
				action: 'query',
				titles: mw.config.get('wgPageName'),
				prop: 'redirects',
				rdlimit: 'max', // 500 is max for normal users, 5000 for bots and sysops
				format: 'json',
			});
			wikipedia_api.setStatusElement(new Morebits.status('กำลังลบการเปลี่ยนทาง'));
			wikipedia_api.post().then((apiobj) => {
				let response = apiobj.getResponse();

				let snapshot = response.query.pages[0].redirects || [];
				let total = snapshot.length;
				let statusIndicator = apiobj.getStatusElement();

				if (!total) {
					statusIndicator.status('ไม่พบการเปลี่ยนทางใด ๆ');
					return;
				}

				statusIndicator.status('0%');

				let current = 0;
				let onsuccess = function (apiobjInner: Api) {
					let now = Math.round((100 * ++current) / total) + '%';
					statusIndicator.update(now);
					apiobjInner.getStatusElement().unlink();
					if (current >= total) {
						statusIndicator.info(now + ' (สำเร็จ)');
						def.resolve();
						Morebits.wiki.removeCheckpoint();
					}
				};

				Morebits.wiki.addCheckpoint();

				snapshot.forEach(function (value) {
					let title = value.title;
					let page = new Page(title, 'ลบการเปลี่ยนทางไป "' + title + '"');
					page.setEditSummary(
						'[[WP:CSD#ท6|ท6]]: การเปลี่ยนทางไปหน้าที่ถูกลบ "' + Morebits.pageNameNorm + '"',
					);
					page.setChangeTags(Twinkle.changeTags);
					page.deletePage().then(onsuccess);
				});
			});
		} else {
			def.resolve();
		}

		// promote Unlink tool
		let $link, $bigtext;
		let isFile = mw.config.get('wgNamespaceNumber') === 6;
		$link = $('<a>', {
			href: '#',
			text: 'คลิกที่นี่เพื่อไปยังเครื่องมือยกเลิกการเชื่อมโยง',
			css: { fontSize: '130%', fontWeight: 'bold' },
			click: () => {
				Morebits.wiki.actionCompleted.redirect = null;
				this.dialog.close();
				// XXX
				Twinkle.unlink.makeWindow(
					isFile
						? 'ลบการใช้งานหรือการลิงก์มายังไฟล์ ' + Morebits.pageNameNorm + ' ที่เพิ่งถูกลบไป'
						: 'ลบการลิงก์มายังหน้า ' + Morebits.pageNameNorm + ' ที่เพิ่งถูกลบไป',
				);
			},
		});
		$bigtext = $('<span>', {
			text: isFile ? 'หากต้องการลบการใช้งานและการลิงก์ไฟล์เสีย' : 'หากต้องการลบการลิงก์',
			css: { fontSize: '130%', fontWeight: 'bold' },
		});
		Morebits.status.info($bigtext[0], $link[0]);

		return def;
	}

	parseWikitext(wikitext): JQuery.Promise<string> {
		let statusIndicator = new Morebits.status('กำลังร่างสรุปการลบ');
		let api = new Api('กำลังอ่านแม่แบบแจ้งลบ', {
			action: 'parse',
			prop: 'text',
			pst: 'true',
			text: wikitext,
			contentmodel: 'wikitext',
			title: mw.config.get('wgPageName'),
			disablelimitreport: true,
			format: 'json',
		});
		api.setStatusElement(statusIndicator);
		return api.post().then((apiobj) => {
			let reason = decodeURIComponent(
				$(apiobj.getResponse().parse.text).find('#delete-reason').text(),
			).replace(/\+/g, ' ');
			if (!reason) {
				statusIndicator.warn('ไม่สามารถสรุปจากแม่แบบลบได้');
			} else {
				statusIndicator.info('สำเร็จ');
			}
			return reason;
		});
	}

	deletePage() {
		let params = this.params;

		let thispage = new Page(mw.config.get('wgPageName'), 'กำลังลบหน้า');

		if (params.deleteReason === null) {
			Morebits.status.error('ต้องการเหตุผลการลบ', 'ผู้ใช้ยกเลิก');
			return $.Deferred().reject();
		} else if (!params.deleteReason || !params.deleteReason.trim()) {
			Morebits.status.error('ต้องการเหตุผลการลบ', 'คุณยังไม่ได้ระบุเหตุผล :( ทำไมล่ะ?');
			return $.Deferred().reject();
		}

		thispage.setEditSummary(params.deleteReason);
		thispage.setChangeTags(Twinkle.changeTags);
		thispage.setWatchlist(params.watch);
		return thispage.deletePage().then(() => {
			thispage.getStatusElement().info('เสร็จสิ้น');
		});
	}

	modeChanged(form: HTMLFormElement) {
		// first figure out what mode we're in
		this.getMode();

		$('[name=delete_options]').toggle(this.mode.isSysop);
		$('[name=tag_options]').toggle(!this.mode.isSysop);
		$('button.tw-speedy-submit').text(this.mode.isSysop ? 'ลบหน้า' : 'บันทึกการแจ้ง');

		let work_area = new Morebits.quickForm.element({
			type: 'div',
			name: 'work_area',
		});

		if (this.mode.isMultiple && this.mode.isRadioClick) {
			work_area.append({
				type: 'div',
				label: 'When finished choosing criteria, click:',
			});
			work_area.append({
				type: 'button',
				name: 'submit-multiple',
				label: this.mode.isSysop ? 'ลบหน้า' : 'บันทึกการแจ้ง',
				event: (event) => {
					this.evaluate(event);
					event.stopPropagation();
				},
			});
		}

		this.appendCriteriaLists(work_area);

		$(form).find('[name=work_area]').replaceWith(work_area.render());
	}

	generateCsdList(list: Array<criterion>) {
		let mode = this.mode;
		let openSubgroupHandler = (e) => {
			$(e.target.form).find('input').prop('disabled', true);
			$(e.target.form).children().css('color', 'gray');
			$(e.target).parent().css('color', 'black').find('input').prop('disabled', false);
			$(e.target).parent().find('input:text')[0].focus();
			e.stopPropagation();
		};
		let submitSubgroupHandler = (e) => {
			let evaluateType = mode.isSysop ? 'evaluateSysop' : 'evaluateUser';
			this[evaluateType](e);
			e.stopPropagation();
		};

		return list
			.map((critElement) => {
				let criterion = $.extend({}, critElement);

				if (mode.isMultiple) {
					if (criterion.hideWhenMultiple) {
						return null;
					}
					if (criterion.hideSubgroupWhenMultiple) {
						criterion.subgroup = null;
					}
				} else {
					if (criterion.hideWhenSingle) {
						return null;
					}
					if (criterion.hideSubgroupWhenSingle) {
						criterion.subgroup = null;
					}
				}

				if (mode.isSysop) {
					if (criterion.hideWhenSysop) {
						return null;
					}
					if (criterion.hideSubgroupWhenSysop) {
						criterion.subgroup = null;
					}
				} else {
					if (criterion.hideWhenUser) {
						return null;
					}
					if (criterion.hideSubgroupWhenUser) {
						criterion.subgroup = null;
					}
				}

				if (Morebits.isPageRedirect() && criterion.hideWhenRedirect) {
					return null;
				}

				if (criterion.showInNamespaces && criterion.showInNamespaces.indexOf(this.namespace) < 0) {
					return null;
				}
				if (criterion.hideInNamespaces && criterion.hideInNamespaces.indexOf(this.namespace) > -1) {
					return null;
				}

				if (criterion.subgroup && !mode.isMultiple && mode.isRadioClick) {
					criterion.subgroup = makeArray(criterion.subgroup).concat({
						type: 'button',
						name: 'submit', // ends up being called "csd.submit" so this is OK
						label: mode.isSysop ? 'ลบหน้า' : 'บันทึกการแจ้ง',
						event: submitSubgroupHandler,
					});
					// FIXME: does this do anything?
					criterion.event = openSubgroupHandler;
				}

				return criterion;
			})
			.filter((e) => e); // don't include items that have been made null
	}

	getExistingCriteria() {
		const criterionValuesByCode: Record<string, string> = {};
		this.criteriaLists.forEach((criteriaList) => {
			criteriaList.list.forEach((criterion) => {
				criterionValuesByCode[criterion.code] = criterion.value;
			});
		});

		const existingCriteria: string[] = [];
		document.querySelectorAll<HTMLElement>('[id="delete-criterion"]').forEach((marker) => {
			const criterionValue = criterionValuesByCode[marker.textContent.trim()];
			if (criterionValue && !existingCriteria.includes(criterionValue)) {
				existingCriteria.push(criterionValue);
			}
		});
		return existingCriteria;
	}

	getExistingDeletionReasons() {
		const existingReasons: string[] = [];
		document.querySelectorAll<HTMLElement>('[id="delete-reason"]').forEach((marker) => {
			const encodedReason = marker.textContent.trim();
			if (!encodedReason) {
				return;
			}

			let reason: string;
			try {
				reason = decodeURIComponent(encodedReason.replace(/\+/g, ' '));
			} catch {
				reason = encodedReason;
			}
			if (!existingReasons.includes(reason)) {
				existingReasons.push(reason);
			}
		});
		return existingReasons;
	}

	selectCriterion(input: HTMLInputElement) {
		input.checked = true;
		input.dispatchEvent(new Event('change'));
	}

	selectExistingCriteria(existingCriteria: string[]) {
		if (existingCriteria.length > 1) {
			const multipleInputName = this.mode.isSysop ? 'delmultiple' : 'multiple';
			const multipleInput = this.result.elements.namedItem(multipleInputName) as HTMLInputElement;
			if (multipleInput) {
				multipleInput.checked = true;
				this.modeChanged(this.result);
			}
		}

		this.result.querySelectorAll<HTMLInputElement>('input[name="csd"]').forEach((input) => {
			if (existingCriteria.includes(input.value)) {
				this.selectCriterion(input);
			}
		});
	}

	selectCustomReason(reason: string) {
		const customOption = this.result.querySelector<HTMLInputElement>(
			'input[name="csd"][value="reason"]',
		);
		if (!customOption) {
			return;
		}

		this.selectCriterion(customOption);
		const reasonInput = this.result.querySelector<HTMLInputElement>('input[name="csd.reason_1"]');
		if (reasonInput) {
			reasonInput.value = reason;
		}
	}

	makeWindow() {
		this.dialog = new Dialog(getPref('speedyWindowWidth'), getPref('speedyWindowHeight'));
		this.dialog.setTitle(this.windowTitle);
		this.dialog.setFooterLinks(this.footerlinks);

		const existingCriteria = this.getExistingCriteria();
		const existingDeletionReasons = this.getExistingDeletionReasons();
		this.hasCSD = existingCriteria.length > 0 || existingDeletionReasons.length > 0;
		this.makeFlatObject();

		let form = new Morebits.quickForm(
			(e) => this.evaluate(e),
			getPref('speedySelectionStyle') === 'radioClick' ? 'change' : null,
		);
		this.form = form;

		if (Morebits.userIsSysop) {
			form.append({
				type: 'checkbox',
				list: [
					{
						label: 'ติดป้ายแจ้งลบหน้านี้ แต่ไม่ลบตอนนี้',
						value: 'tag_only',
						name: 'tag_only',
						tooltip: 'กรณีต้องการติดป้ายแจ้งลบหน้านี้ แต่ไม่ลบตอนนี้',
						checked: !(this.hasCSD || getPref('deleteSysopDefaultToDelete')),
						event: (event) => {
							let cForm = event.target.form!;
							let cChecked = event.target.checked;
							// enable talk page checkbox
							if (cForm.deleteTalkPage) {
								cForm.deleteTalkPage.checked = !cChecked && getPref('deleteTalkPageOnDelete');
							}
							// enable redirects checkbox
							cForm.deleteRedirects.checked = !cChecked;
							// enable delete multiple
							cForm.delmultiple.checked = false;
							// enable notify checkbox
							cForm.notify.checked = cChecked;
							// enable deletion notification checkbox
							cForm.warnusertalk.checked = !cChecked && !this.hasCSD;
							// enable multiple
							cForm.multiple.checked = false;
							// enable requesting creation protection
							cForm.requestsalt.checked = false;

							this.modeChanged(cForm);

							event.stopPropagation();
						},
					},
				],
			});

			let deleteOptions = form.append({
				type: 'div',
				name: 'delete_options',
			});
			deleteOptions.append({
				type: 'header',
				label: 'ตัวเลือกการลบหน้า',
			});
			if (
				mw.config.get('wgNamespaceNumber') % 2 === 0 &&
				(mw.config.get('wgNamespaceNumber') !== 2 || /\//.test(mw.config.get('wgTitle')))
			) {
				// hide option for user pages, to avoid accidentally deleting user talk page
				deleteOptions.append({
					type: 'checkbox',
					list: [
						{
							label: 'ลบหน้าคุยด้วย',
							value: 'deleteTalkPage',
							name: 'deleteTalkPage',
							tooltip:
								'ลบหน้าคุยด้วย กรณีเลือกเป็น ฟ7 (ไฟล์ย้ายไปคอมอนส์แล้ว) จะไม่สนใจตัวเลือกนี้และเก็บหน้าคุยของไฟล์ไว้',
							checked: getPref('deleteTalkPageOnDelete'),
							event: (event) => event.stopPropagation(),
						},
					],
				});
			}
			deleteOptions.append({
				type: 'checkbox',
				list: [
					{
						label: 'ลบหน้าเปลี่ยนทางมาที่นี่ทั้งหมดด้วย',
						value: 'deleteRedirects',
						name: 'deleteRedirects',
						tooltip:
							'ลบหน้าเปลี่ยนทางมาที่นี่ทั้งหมดด้วย หลีกเลี่ยงตัวเลือกนี้สำหรับการลบแบบกระบวนการ (เช่น การย้าย/ผสาน)',
						checked: getPref('deleteRedirectsOnDelete'),
						event: (event) => event.stopPropagation(),
					},
					{
						label: 'ลบด้วยหลายเหตุผลพร้อมกัน',
						value: 'delmultiple',
						name: 'delmultiple',
						tooltip: 'เลือกตัวเลือกนี้เพื่อเลือกหลายเหตุผลพร้อมกัน',
						event: (event) => {
							this.modeChanged(event.target.form);
							event.stopPropagation();
						},
					},
					{
						label: 'แจ้งผู้สร้างหน้าเกี่ยวกับการลบหน้า',
						value: 'warnusertalk',
						name: 'warnusertalk',
						tooltip:
							'จะวางแม่แบบแจ้งเตือนบนหน้าคุยของผู้สร้าง ก็ต่อเมื่อคุณเปิดการแจ้งเตือนในการตั้งค่าของ Twinkle ' +
							'สำหรับเกณฑ์ที่คุณเลือก และกล่องนี้ถูกเลือก และอาจส่งสารต้อนรับก่อนด้วยหากยังไม่เคยได้รับ',
						checked: !this.hasCSD,
						event: (event) => event.stopPropagation(),
					},
				],
			});
		}

		let tagOptions = form.append({
			type: 'div',
			name: 'tag_options',
		});

		if (Morebits.userIsSysop) {
			tagOptions.append({
				type: 'header',
				label: 'ตัวเลือกที่เกี่ยวกับการติดป้ายแจ้งลบ',
			});
		}

		tagOptions.append({
			type: 'checkbox',
			list: [
				{
					label: 'แจ้งผู้สร้างหน้าหากเป็นไปได้',
					value: 'notify',
					name: 'notify',
					tooltip:
						'จะวางแม่แบบแจ้งเตือนบนหน้าคุยของผู้สร้าง ก็ต่อเมื่อคุณเปิดการแจ้งเตือนในการตั้งค่าของ Twinkle ' +
						'สำหรับเกณฑ์ที่คุณเลือก และกล่องนี้ถูกเลือก และอาจส่งสารต้อนรับก่อนด้วยหากยังไม่เคยได้รับ',
					checked: !Morebits.userIsSysop || !(this.hasCSD || getPref('deleteSysopDefaultToDelete')),
					event: (event) => event.stopPropagation(),
				},
				{
					label: 'แจ้งป้องกันการสร้างหน้านี้ด้วย',
					value: 'requestsalt',
					name: 'requestsalt',
					tooltip:
						'เมื่อเลือก แม่แบบแจ้งลบจะถูกเสริมด้วยแม่แบบ {{salt}} ที่ขอให้ผู้ดูแลที่ลบหน้าทำการป้องกันการสร้างหน้า โปรดเลือกเฉพาะหากหน้านี้ถูกสร้างขึ้นใหม่หลายครั้ง',
					event: (event) => event.stopPropagation(),
				},
				{
					label: 'เลือกหลายเกณฑ์พร้อมกัน',
					value: 'multiple',
					name: 'multiple',
					tooltip:
						'เมื่อเลือก คุณสามารถเลือกหลายเกณฑ์ที่ใช้กับหน้านี้ได้ เช่น ท8 และ บ5 สำหรับองค์กรที่ขาดความสำคัญและเขียนเหมือนโฆษณา',
					event: (event) => {
						this.modeChanged(event.target.form);
						event.stopPropagation();
					},
				},
			],
		});

		form.append({
			type: 'div',
			id: 'prior-deletion-count',
			style: 'font-style: italic',
		});

		form.append({
			type: 'div',
			name: 'work_area',
			label: 'ไม่สามารถเริ่มต้นโมดูลการลบทันทีได้ โปรดลองอีกครั้ง หรือแจ้งปัญหาให้ทีมพัฒนา Twinkle',
		});

		if (getPref('speedySelectionStyle') !== 'radioClick') {
			form.append({ type: 'submit', className: 'tw-speedy-submit' }); // Renamed in modeChanged
		}

		this.result = form.render();
		this.dialog.setContent(this.result);
		this.dialog.display();

		this.modeChanged(this.result);
		this.selectExistingCriteria(existingCriteria);
		if (!existingCriteria.length && existingDeletionReasons.length) {
			this.selectCustomReason(existingDeletionReasons.join(', '));
		}

		// Check for prior deletions.  Just once, upon init
		this.priorDeletionCount();
	}

	priorDeletionCount() {
		let query = {
			action: 'query',
			format: 'json',
			list: 'logevents',
			letype: 'delete',
			leaction: 'delete/delete', // Just pure page deletion, no redirect overwrites or revdel
			letitle: mw.config.get('wgPageName'),
			leprop: '', // We're just counting we don't actually care about the entries
			lelimit: 5, // A little bit goes a long way
		};

		new Api('Checking for past deletions', query).post().then((apiobj) => {
			let response = apiobj.getResponse();
			let delCount = response.query.logevents.length;
			if (delCount) {
				let message = `หน้านี้เคยถูกลบ${response.continue ? 'มากกว่า' : ''} ${delCount} ครั้ง`;

				// 3+ seems problematic
				if (delCount >= 3) {
					$('#prior-deletion-count').css('color', 'red');
				}

				// Provide a link to page logs (CSD templates have one for sysops)
				let link = Morebits.htmlNode('a', '(ปูม)');
				link.setAttribute(
					'href',
					mw.util.getUrl('Special:Log', { page: mw.config.get('wgPageName') }),
				);
				link.setAttribute('target', '_blank');

				$('#prior-deletion-count').text(message + ' '); // Space before log link
				$('#prior-deletion-count').append(link);
			}
		});
	}

	checkPage() {
		let pageobj = new Page(mw.config.get('wgPageName'), 'กำลังติดป้ายแจ้งลบ');
		pageobj.setChangeTags(Twinkle.changeTags);
		return pageobj.load().then(() => {
			let statelem = pageobj.getStatusElement();

			if (!pageobj.exists()) {
				statelem.error('ไม่พบหน้านี้ในระบบ อาจจะถูกลบไปแล้ว');
				return $.Deferred().reject();
			}

			let text = pageobj.getPageText();

			statelem.status('กำลังตรวจสอบว่ามีแม่แบบลบแล้วหรือไม่...');

			// check for existing speedy deletion tags
			let tag =
				/(?:\{\{\s*(db|ลบ|ลบ-.*?|ลบ [ก-๛][1-9][0-9]?|delete|db-.*?|speedy deletion-.*?)(?:\s*\||\s*\}\}))/.exec(
					text,
				);
			// This won't make use of the db-multiple template but it probably should
			if (
				tag &&
				!confirm('หน้านี้มีแม่แบบแจ้งลบ {{' + tag[1] + '}} อยู่แล้ว ต้องการเพิ่มอีกอันหรือไม่')
			) {
				return $.Deferred().reject();
			}

			// check for existing XFD tags
			let xfd =
				/\{\{((?:article for deletion|proposed deletion|prod blp|template for discussion)\/dated|[cfm]fd\b)/i.exec(
					text,
				) || /#invoke:(RfD)/.exec(text);
			if (
				xfd &&
				!confirm(
					'The deletion-related template {{' +
						xfd[1] +
						'}} was found on the page. Do you still want to add a CSD template?',
				)
			) {
				return $.Deferred().reject();
			}

			return pageobj;
		});
	}

	evaluate(e: QuickFormEvent | FormSubmitEvent) {
		if (e.target.type === 'checkbox' || e.target.type === 'text' || e.target.type === 'select') {
			return;
		}
		this.params = Morebits.quickForm.getInputData(this.result);
		if (!this.params.csd || !this.params.csd.length) {
			return alert('โปรดเลือกเกณฑ์การลบก่อน!');
		}
		this.preprocessParams();
		let validationMessage = this.validateInputs();
		if (validationMessage) {
			return alert(validationMessage);
		}

		Morebits.simpleWindow.setButtonsEnabled(false);
		Morebits.status.init(this.result);

		let tm = new Morebits.taskManager(this);
		tm.add(this.fetchCreatorInfo, []);
		if (this.mode.isSysop) {
			// Sysop mode deletion
			tm.add(this.parseDeletionReason, []);
			tm.add(this.deletePage, [this.parseDeletionReason]);
			tm.add(this.deleteTalk, [this.deletePage]);
			tm.add(this.deleteRedirects, [this.deletePage]);
			tm.add(this.noteToCreator, [this.deletePage, this.fetchCreatorInfo]);
		} else {
			// Tagging
			tm.add(this.checkPage, []);
			tm.add(this.tagPage, [this.checkPage]); // checkPage passes pageobj to tagPage
			tm.add(this.patrolPage, [this.checkPage]);
			tm.add(this.noteToCreator, [this.checkPage, this.fetchCreatorInfo]);
			tm.add(this.addToLog, [this.noteToCreator]);
		}

		tm.execute().then(() => {
			Morebits.status.actionCompleted(this.mode.isSysop ? 'ลบสำเร็จ' : 'ติดแม่แบบลบสำเร็จ');
			setTimeout(() => {
				window.location.href = mw.util.getUrl(Morebits.pageNameNorm);
			}, 50000);
		});
	}

	tagPage(pageobj: Page) {
		let params = this.params;
		let text = pageobj.getPageText();
		let code = this.getTaggingCode();

		// Set the correct value for |ts= parameter in {{ลบ-ท10}}
		if (params.normalizeds.indexOf('ท10') !== -1) {
			code = code.replace('$TIMESTAMP', pageobj.getLastEditTime());
		}
		if (params.requestsalt) {
			code = '{{salt}}\n' + code;
		}

		// Post on talk if it is not possible to tag
		if (
			!pageobj.canEdit() ||
			['wikitext', 'Scribunto', 'javascript', 'css', 'sanitized-css'].indexOf(
				pageobj.getContentModel(),
			) === -1
		) {
			// Attempt to place on talk page
			let talkName = new mw.Title(pageobj.getPageName()).getTalkPage().toText();

			if (talkName === pageobj.getPageName()) {
				pageobj
					.getStatusElement()
					.error('หน้านี้ถูกป้องกันและไม่สามารถเพิ่มคำขอแก้ไขได้, กำลังยกเลิก');
				return $.Deferred().reject();
			}

			pageobj.getStatusElement().warn('ไม่สามารถแก้ไขหน้านี้ได้, กำลังวางแท็กบนหน้าพูดคุยแทน');

			let talk_page = new Page(talkName, 'กำลังใส่แม่แบบบนหน้าพูดคุยแทน');
			talk_page.setNewSectionTitle('แจ้งลบทันทีหน้า' + pageobj.getPageName());
			talk_page.setNewSectionText(
				code +
					'\n\nเนื่องจากไม่สามารถใส่แม่แบบแจ้งลบในหน้า ' +
					pageobj.getPageName() +
					' ได้ จึงแจ้งที่นี่แทน โปรดพิจารณาลบหน้าดังกล่าว ~~~~',
			);
			talk_page.setCreateOption('recreate');
			talk_page.setFollowRedirect(true);
			talk_page.setWatchlist(params.watch);
			talk_page.setChangeTags(Twinkle.changeTags);
			return talk_page.newSection();
		}

		// Remove tags that become superfluous with this action
		text = text.replace(/\{\{\s*([Uu]serspace draft)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/g, '');
		if (mw.config.get('wgNamespaceNumber') === 6) {
			// remove "move to Commons" tag - deletion-tagged files cannot be moved to Commons
			text = text.replace(
				/\{\{(mtc|(copy |move )?to ?commons|ย้ายไปคอมมอนส์|move to wikimedia commons|copy to wikimedia commons)[^}]*\}\}/gi,
				'',
			);
		}

		// Wrap SD template in noinclude tags if we are in template space.
		// Won't work with userboxes in userspace, or any other transcluded page outside template space
		if (mw.config.get('wgNamespaceNumber') === 10) {
			// Template:
			code = '<noinclude>' + code + '</noinclude>';
		}

		if (mw.config.get('wgPageContentModel') === 'Scribunto') {
			// Scribunto isn't parsed like wikitext, so CSD templates on modules need special handling to work
			let equals = '';
			while (code.indexOf(']' + equals + ']') !== -1) {
				equals += '=';
			}
			code =
				"require('Module:Module wikitext')._addText([" + equals + '[' + code + ']' + equals + ']);';
		} else if (
			['javascript', 'css', 'sanitized-css'].indexOf(mw.config.get('wgPageContentModel')) !== -1
		) {
			// Likewise for JS/CSS pages
			code = '/* ' + code + ' */';
		}

		// Generate edit summary for edit
		let editsummary;
		if (params.normalizeds[0] === 'db' || params.normalizeds[0] === 'ลบ') {
			editsummary = 'แจ้ง[[WP:CSD|ลบทันที]]เนื่องจาก "' + params.templateParams[0]['1'] + '"';
		} else {
			let criteriaText = params.normalizeds
				.map((norm) => {
					return '[[WP:CSD#' + norm.toUpperCase() + '|ข้อ ' + norm.toUpperCase() + ']]';
				})
				.join(', ');
			editsummary = 'แจ้ง[[WP:CSD|ลบทันที]] (' + criteriaText + ').';
		}

		// Blank attack pages
		if (params.redactContents) {
			text = code;
		} else {
			text = this.insertTagText(code, text);
		}

		pageobj.setPageText(text);
		pageobj.setEditSummary(editsummary);
		pageobj.setWatchlist(params.watch);
		return pageobj.save();
	}
}
