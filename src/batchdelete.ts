import { BatchDeleteCore } from './core';

export class BatchDelete extends BatchDeleteCore {
	footerLinks = {
		ขอความช่วยเหลือ: 'WP:TW/DOC#batchdelete',
		ให้ข้อเสนอแนะ: 'WT:TW',
	};

	portletName: string = 'ลบเป็นกลุ่ม';

	getMetadata(page) {
		var metadata: string[] = [];
		if (page.redirect) {
			metadata.push('redirect');
		}

		var editProt = page.protection
			.filter((pr) => {
				return pr.type === 'edit' && pr.level === 'sysop';
			})
			.pop();
		if (editProt) {
			metadata.push(
				'ป้องกันสมบูรณ์' +
					(editProt.expiry === 'infinity'
						? ' ตลอดไป'
						: ' จนถึง ' + new Morebits.date(editProt.expiry).calendar('utc') + ' (UTC)')
			);
		}
		if (page.ns === 6) {
			metadata.push('ผู้อัปโหลด: ' + page.imageinfo[0].user);
			metadata.push('แก้ไขล่าสุดโดย: ' + page.revisions[0].user);
		} else {
			metadata.push(mw.language.convertNumber(page.revisions[0].size) + ' ไบต์');
		}

		return metadata;
	}
}
