// Utility for adding blocks in Contact section
import { genId } from '../lib/blocks';

export function canAddBlock(blocks, type) {
  if (!Array.isArray(blocks)) return true;
  if (type === 'image') return !blocks.some(b => b.type === 'image');
  if (type === 'paragraph') return blocks.filter(b => b.type === 'paragraph').length < 5;
  return true;
}

export function addBlock(blocks, type) {
  const copy = (blocks || []).slice();
  switch (type) {
    case 'paragraph':
      copy.push({ _id: genId(), type: 'paragraph', text: '', contactType: '' });
      break;
    case 'image':
      copy.push({ _id: genId(), type: 'image', src: '', alt: '' });
      break;
    default:
      break;
  }
  return copy;
}
