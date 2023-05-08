const readline = require('readline');
const fs = require('fs');
const path = require('path');


const main = function() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '->'
  });
  const writeableStream = fs.createWriteStream(
    path.join(__dirname, 'text.txt'), 
    'utf-8'
  );

  rl.on('line', (input) => {
    if (input === 'exit') {
      rl.close();
    } else {
      writeableStream.write(`${input}\n`);
      rl.prompt();
    }
  });
  rl.on('SIGINT', () => {
    process.stdout.write('\n');
    rl.close();
  });
  rl.on('close', () => {
    process.stdout.write('Terminating process...');
    process.exit(1);
  });
  process.stdout.write('CLI session started!\n');
  rl.prompt();
};

main();