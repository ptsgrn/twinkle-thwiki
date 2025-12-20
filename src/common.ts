/**
 * Functions or expressions shared across multiple modules
 */

// Various hatnote templates, used when tagging (csd/xfd/tag/prod/protect) to
// ensure MOS:ORDER
export const hatnoteRegex =
	'short description|hatnote|main|หลัก|ชื่อผิด|correct title|dablink|distinguish|for|สำหรับ|further|ข้อมูลเพิ่มเติม|selfref|year dab|similar names|highway detail hatnote|broader|เกี่ยวกับ|about(?:-distinguish| other people)?|(ความหมาย|บุคคล|พายุ|สถานที่)อื่น|other\\s?(?:hurricane(?: use)?s|people|persons|places|ships|uses(?: of)?)|redirect(?:-(?:distinguish|synonym|multi))?|ดูเพิ่ม|see\\s?(?:wiktionary|also(?: if exists)?)';

let findSources: string;

// Used in XFD and PROD
export function makeFindSourcesDiv(divID) {
	if (!$(divID).length) {
		return;
	}
	if (!findSources) {
		var parser = new Morebits.wiki.preview($(divID)[0]);
		parser
			.beginRender('({{ค้นหาข้อมูล|' + Morebits.pageNameNorm + '}})', 'WP:AFD')
			.then(function () {
				// Save for second-time around
				findSources = parser.previewbox.innerHTML;
				$(divID).removeClass('morebits-previewbox');
			});
	} else {
		$(divID).html(findSources);
	}
}

export const optoutTemplates = ['Template:Retired', 'Template:Deceased Wikipedian'];
