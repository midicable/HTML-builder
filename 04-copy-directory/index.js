const fs = require('fs');
const path = require('path');


const main = function() {
  fs.access(
    path.join(__dirname, 'files-copy'),
    fs.constants.F_OK,
    (err) => {
      if (err) {
        fs.mkdir(
          path.join(__dirname, 'files-copy'),
          (err) => {
            if (err) {
              console.error(err.message);
            }
          }
        );
      }
      fs.readdir(
        path.join(__dirname, 'files'),
        {
          encoding: 'utf-8',
          withFileTypes: false
        },
        (err, files) => {
          if (err) {
            console.error(err.message);
          } 
          files.forEach(file => {
            fs.copyFile(
              path.join(__dirname, 'files', file),
              path.join(__dirname, 'files-copy', file),
              (err) => {
                if (err) {
                  console.error(err.message);
                }
              }
            )
          });
        }
      )
    }
  );
};

main();