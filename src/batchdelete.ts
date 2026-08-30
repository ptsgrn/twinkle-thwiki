import { BatchDeleteCore } from './core';

export class BatchDelete extends BatchDeleteCore {
	footerLinks = {
		ขอความช่วยเหลือ: 'WP:TW/DOC#batchdelete',
		ให้ข้อเสนอแนะ: 'WT:TW',
	};

	portletName: string = 'ลบเป็นกลุ่ม';
}
