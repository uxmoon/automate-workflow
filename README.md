## Usage ##

* Run `bower install`.
* Run `npm install`.
* Run `gulp` for development.

### Scaffolding ###

* Clone this repository
* Change the remote url
* Run `bower install` and `npm install`
* Update npm dependencies with `npm install npm-check -g` and then `npm-check -u`
* Update bower dependencies with `npm install bower-update -g` and then `bower-update`

### Add files manually ###

* secrets.json with credentials information in order to deploy via ssh or ftp.

## What is this repository for? ##

### Development Phase ###

There are three objectives for the development phase. They are:

* 6 gulp tasks: `sass`, `watch`, `browserSync`, `sprites`, `nunjucks`, `clean:dev`.
* `default` task that chains everything created into a single task.

### Testing Phase ###

* 3 tasks `lint:scss`, `lint:js`, `test`.
* `lint:scss`, `lint:js` are in charged of ensuring our code is tidy and follow best practices.
* `test` task runs unit test with Karma and Jasmine.

### Integration Phase ###

* Continuous integration with **Travis**

### Optimization Phase ###

* `uncss` and `cssnano` for CSS.
* `useref` and `uglify` for JS.
* Cache busting

### Deployment Phase ###

* 2 tasks `rsync` for SSH and `ftp` for FTP.


### Thanks ###

Based on the book of the same name written by Zell Liew.
