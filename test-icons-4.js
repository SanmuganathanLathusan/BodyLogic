const lucide = require('lucide-react');
const search = (q) => Object.keys(lucide).filter(k => k.toLowerCase().includes(q.toLowerCase()));
console.log('FB:', search('Facebook'));
console.log('Twitter:', search('Twitter'));
console.log('Instagram:', search('Instagram'));
console.log('Linkedin:', search('Linkedin'));
