// Utility functions for adding blocks in TurnkeySolutions
import { genId } from '../lib/blocks';

export function canAddBlock(blocks, type) {
  if (!Array.isArray(blocks)) return true;
  if (type === 'image') return !blocks.some(b => b.type === 'image');
  if (type === 'paragraph-image-text') return !blocks.some(b => b.type === 'paragraph' && b.title?.toLowerCase().includes('image text'));
  if (type === 'list-process') return !blocks.some(b => b.type === 'list' && b.title === 'Process');
  if (type === 'list-scope') return !blocks.some(b => b.type === 'list' && b.style === 'decimal');
  if (type === 'image-inhouse') return !blocks.some(b => b.type === 'image' && b.title === 'Inhouse Competencies Image');
  if (type === 'list-inhouse') return !blocks.some(b => b.type === 'list' && b.title === 'Inhouse Competencies');
  if (type === 'list-service') return !blocks.some(b => b.type === 'list' && b.title === 'Service Description');
  return true;
}

export function addBlock(blocks, type) {
  const copy = (blocks || []).slice();
  switch (type) {
    case 'image':
      copy.push({ _id: genId(), type: 'image', src: '', title: 'Image', alt: 'Turnkey image', _autoAlt: true });
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
    case 'image-inhouse':
      copy.push({ _id: genId(), type: 'image', title: 'Inhouse Competencies Image', src: '', alt: '' });
      break;
    case 'list-inhouse':
      copy.push({ _id: genId(), type: 'list', title: 'Inhouse Competencies', style: 'disc', items: [''] });
      break;
    case 'list-service':
      copy.push({ _id: genId(), type: 'list', title: 'Service Description', style: 'disc', items: [''] });
      break;
    default:
      break;
  }
  return copy;
}
