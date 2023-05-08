const fs = require('fs');
const path = require('path');

const main = function () {
  fs.readdir(
    path.join(
      __dirname, 'secret-folder'),
      {
        encoding: 'utf-8',
        withFileTypes: true
      },
      (err, files) => {
        if (err) {
          console.error(err.message);
        }
        files
          .filter(file => file.isFile())
          .forEach(file => {
            const filePath = path.join(__dirname, 'secret-folder', file.name);

            fs.stat(
              filePath,
              { bigint: false},
              (err, stats) => {
                if (err) {
                  console.error(err.message);
                }
                const fileName = path.parse(filePath).name;
                const fileExt = path.extname(filePath);
                const fileSize = stats.size;
                console.log(`${fileName} - ${fileExt.slice(1)} - ${(fileSize / 1024).toFixed(3)} KiB`);
              });
          });
      }
    );
};

main();