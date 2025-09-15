// Clear localStorage utility
// Run this in the browser console if you need to clear stored tokens

console.log('Current localStorage content:');
console.log('token:', localStorage.getItem('token'));
console.log('refreshToken:', localStorage.getItem('refreshToken'));

// Uncomment the lines below to clear the tokens
// localStorage.removeItem('token');
// localStorage.removeItem('refreshToken');
// console.log('Tokens cleared');

export {};