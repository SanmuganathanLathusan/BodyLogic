const lucide = require('lucide-react');
const icons = ['Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Mail', 'Phone', 'MapPin'];
icons.forEach(name => {
  if (lucide[name]) {
    console.log(`${name}: OK`);
  } else {
    console.log(`${name}: MISSING`);
  }
});
