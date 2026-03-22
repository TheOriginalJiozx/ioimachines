import { genId } from '../lib/blocks';

export function canAddBlock(blocks, type) {
	if (!Array.isArray(blocks)) return true;
	if (type === 'image') return !blocks.some(b => b.type === 'image' && b.title !== 'Image' && b.title !== 'Signature Algorithm Images');
	if (type === 'image-signature-algorithm') return !blocks.some(b => b.type === 'image' && b.title === 'Signature Algorithm Images');
	if (type === 'paragraph-image-text') return !blocks.some(b => b.type === 'paragraph' && b.title?.toLowerCase().includes('image text'));
	if (type === 'paragraph-signature-algorithm') return !blocks.some(b => b.type === 'paragraph' && b.title === 'Signature Algorithm');
	if (type === 'list-gui-functions') return !blocks.some(b => b.type === 'list' && b.title === 'GUI Functions');
	if (type === 'list-process') return !blocks.some(b => b.type === 'list' && b.title === 'Process');
	if (type === 'list-scope') return !blocks.some(b => b.type === 'list' && b.style === 'decimal');
	return true;
}

export function addBlock(blocks, type) {
	const copy = (blocks || []).slice();
	switch (type) {
        case 'paragraph-signature-algorithm':
            copy.push({ _id: genId(), type: 'paragraph', title: 'Signature Algorithm', text: '' });
            break;
        case 'list-gui-functions':
            copy.push({ _id: genId(), type: 'list', title: 'GUI Functions', style: 'disc', items: [''], _isSemicolonList: true });
            break;
		case 'image':
			copy.push({ _id: genId(), type: 'image', title: 'Image', src: '', alt: 'IP Core image', _autoAlt: true });
			break;
		case 'paragraph-image-text':
			copy.push({ _id: genId(), type: 'paragraph', title: 'Image Text', text: '', images: [] });
			break;
		case 'list-process':
			copy.push({ _id: genId(), type: 'list', title: 'Process', style: 'disc', items: [''] });
			break;
		case 'list-scope':
			copy.push({ _id: genId(), type: 'list', title: 'Scope & Approach', style: 'decimal', items: [''] });
			break;
		case 'image-signature-algorithm':
			copy.push({ _id: genId(), type: 'image', title: 'Signature Algorithm Images', images: [] });
			break;
		default:
			break;
	}
	return copy;
}
