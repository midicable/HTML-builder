const fs = require('fs');
const path = require('path');


const initProjDir = function() {
  fs.access(
    path.join(__dirname, 'project-dist'),
    fs.constants.F_OK,
    (err) => {
      if (err) {
        fs.mkdir(
          path.join(__dirname, 'project-dist'),
          (err) => {
            if (err) {
              console.error(err.message);
            }
          });
      }
      buildHTML();
    }
  );
};

const buildHTML = function() {
  const htmlReadStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    { encoding: 'utf-8' }
  );
  const htmlWriteStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html')
  );

  let template = '';
  htmlReadStream.on('data', (data) => {
    template += data;
  }); 
  htmlReadStream.on('end', () => {
    const regex = /\{\{(.*?)\}\}/g;
    const templateTags = Array.from(template.matchAll(regex));

    templateTags.forEach((tag, index) => {
      const componentReadStream = fs.createReadStream(
        path.join(__dirname, 'components', `${tag[1]}.html`)
      );
      let component = '';

      componentReadStream.on('data', (data) => {
        component += data;
      });
      componentReadStream.on('end', () => {
        template = template.replace(tag[0], component);
        if (index == templateTags.length - 1) {
          htmlWriteStream.write(template);
        }
      });
    });
  });
};

const buildCSSBundle = function() {
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
        path.join(__dirname, 'project-dist', 'style.css')
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
  );
};

const copyAssetsFolder = function() {
  fs.access(
    path.join(__dirname, 'project-dist', 'assets'),
    fs.constants.F_OK,
    (err) => {
      if (err) {
        fs.mkdir(
          path.join(__dirname, 'project-dist', 'assets'),
          (err) => {
            if (err) {
              console.error(err.message);
            }
          }
        );
      }
      fs.readdir(
        path.join(__dirname, 'assets'),
        {
          encoding: 'utf-8',
          withFileTypes: false
        },
        (err, dirs) => {
          if (err) {
            console.error(err.message);
          } 
          dirs.forEach(dir => {
            fs.access(
              path.join(__dirname, 'project-dist', 'assets', dir),
              fs.constants.F_OK,
              (err) => {
                if (err) {
                  fs.mkdir(
                    path.join(__dirname, 'project-dist', 'assets', dir),
                    (err) => {
                      if (err) {
                        console.error(err.message);
                      }
                    }
                  );
                }
                fs.readdir(
                  path.join(__dirname, 'assets', dir),
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
                        path.join(__dirname, 'assets', dir, file),
                        path.join(__dirname, 'project-dist', 'assets', dir, file),
                        (err) => {
                          if (err) {
                            console.error(err.message);
                          }
                        }
                      );
                    });
                  }
                );
              }
            );
          });
        }
      );
    }
  );
};

const main = function() {
  initProjDir();
  buildCSSBundle();
  copyAssetsFolder();
};

main();