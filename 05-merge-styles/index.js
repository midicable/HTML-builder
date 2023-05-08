const fs = require('fs');
const path = require('path');


const main = function() {
  fs.readdir(
    path.join(__dirname, 'styles'),
    {
      encoding: 'utf-8',
      withFileTypes: false
    },
    (err, files) => {
      if (err) {
        console.error(err.message);
      }
      const cssWriteStream = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'bundle.css')
      );
      files
        .filter(file => path.extname(
          path.join(__dirname, 'styles', file)
        ) == '.css')
        .forEach(file => {
          const cssReadStream = fs.createReadStream(
            path.join(__dirname, 'styles', file)
          );
          cssReadStream.pipe(cssWriteStream);
        });
    }
  )
};

main();