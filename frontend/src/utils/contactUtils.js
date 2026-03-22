export function getContactFieldLabel(type) {
  switch (type) {
    case 'address': return 'Address';
    case 'email': return 'E-mail';
    case 'phone': return 'Phone';
    case 'timing': return 'Timing';
    default: return '';
  }
}
