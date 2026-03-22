// Utility functions for adding blocks in Feasibility Study
import { genId } from '../lib/blocks';


export function canAddBlock(blocks, type) {
  if (!Array.isArray(blocks)) return true;
  if (type === 'image') return !blocks.some(b => b.type === 'image');
  if (type === 'paragraph-image-text') return !blocks.some(b => b.type === 'paragraph' && b.title && String(b.title).toLowerCase() === 'image text');
  if (type === 'list-process') return !blocks.some(b => b.type === 'list' && b.title && b.title.toLowerCase() === 'process');
  if (type === 'list-scope') return !blocks.some(b => b.type === 'list' && b.style === 'decimal');
  if (type === 'list-deliverables') return !blocks.some(b => b.type === 'list' && b.title && b.title.toLowerCase() === 'deliverables');
  return true;
}

export function addBlock(blocks, type) {
  const copy = (blocks || []).slice();
  switch (type) {
    case 'image':
      copy.push({ _id: genId(), type: 'image', src: '', alt: 'Feasibility image', _autoAlt: true });
      break;
    case 'paragraph-image-text':
      copy.push({ _id: genId(), type: 'paragraph', title: 'image text', text: '', images: [] });
      break;
    case 'list-process':
      copy.push({ _id: genId(), type: 'list', title: 'Process', style: 'disc', items: [], _isSemicolonList: true });
      break;
    case 'list-scope':
      copy.push({ _id: genId(), type: 'list', style: 'decimal', items: [''] });
      break;
    case 'list-deliverables':
      copy.push({ _id: genId(), type: 'list', title: 'Deliverables', style: 'disc', items: [] });
      break;
    default:
      break;
  }
  return copy;
}
