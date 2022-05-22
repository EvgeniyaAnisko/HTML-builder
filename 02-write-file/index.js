const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello!\nPlease enter text:\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  writableStream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Buy!'));