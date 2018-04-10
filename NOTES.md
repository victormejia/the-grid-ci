## Notes

## Continuous Integration for Angular Applications

## Start from the CLI

* ng test —code-coverage: generates coverage reports
* setup npm scripts:
  * `test: ng test —single-run —code-coverage`
  * `tdd: ng test —code-coverage`
* Run tests in Chrome Headless

PhantomJS allowed developers to simulate a “headless” browser: \* issues: frequent crashes, memory leaks

* in CI you need deterministic builds

### Chrome Headless

* as of version 59 with `--headless`
* Chrome has 50-60% browser share
* It's a way to run the Chrome browser in a headless environment
* It brings all modern web platform features provided by Chromium and the Blink rendering engine to the command line.
* One of the benefits of using Headless Chrome (as opposed to testing directly in Node) is that your JavaScript tests will be executed in the same environment as users of your site.
* Headless Chrome gives you a real browser context without the memory overhead of running a full version of Chrome.
* Chrome is fine but sometimes you run tests where there is not graphical environment

### Continuous Integration

* development practice or strategy where developers continually commit small increments of code several times a day into shared code repository, which is automatically built and tested before it is merged.
* Circle CI is integrated into GitHub and Bitbucker
* Process
  * create a new feature branch, commit work
  * push up branch to GH
  * automated build and test run
  * get notified of build status, "green" or "red"
  * if green, then GH should allow you to merge
  * when merged, automatic deploy to staging server
* benefits:
  * improved team productiviy and effiency
  * find problems earlier
  * ship more quickly
* Best practices
  * testing needs to be an integral workflow
  * sometimes this can be hard to push for in corporate environments, but gotta start somewhere
  * having gateway checks and automating things is a great way to start
* Angular
  * linting with tslint
  * running unit tests (and also e2e or VRT)
  * verifying a production build
  * in CircleCI this can easily be done using "workflows"
  * The Angular CLI sets up so much for us, but need to do additional things to get it tailored for your specific use-case

## Setup local testing workflows

### Spec reporting

By default it is a bit difficult to know which tests exactly ran, but this can also be configured to improve the developer experience.

1.  Install the `karma-spec-reporter` plugin:

```
npm install karma-spec-reporter --save-dev
```

2.  Add it to the `plugins` in `karma.conf.js`:

```
plugins: [
  require('karma-jasmine'),
  require('karma-chrome-launcher'),
  require('karma-jasmine-html-reporter'),
  require('karma-coverage-istanbul-reporter'),
  require('@angular/cli/plugins/karma'),
  require('karma-spec-reporter')
]
```

3.  In the `reports` array inside the `coverageIstanbulReporter` object, add `'text-summary'`

```js
coverageIstanbulReporter: {
  reports: ['html', 'lcovonly', 'text-summary'],
  fixWebpackSourcePaths: true
}
```

4.  In the `reporters` property, replace `'progress'` with `'spec'`

```js
reporters: ['spec', 'kjhtml', 'coverage-istanbul'],
```

Now when running `npm test` you will get a much nicer outpu

## Enforcing Code coverage

Configure thresholds under the `coverageIstanbulReporter`:

```js
coverageIstanbulReporter: {
  reports: ['html', 'lcovonly', 'text-summary'],
  fixWebpackSourcePaths: true,
  thresholds: {
    global: {
      statements: 85,
      branches: 85,
      lines: 85,
      functions: 85
    },
    each: {
      statements: 85,
      branches: 85,
      lines: 85,
      functions: 85
    }
  }
}
```

You can configure both globally and individual file thresholds. Now, if any of these stats fall below the specified thresholds, running ng test will fail, even if each spec is passing:

### Formatting with Prettier

* ensuring clean, formatted code should be part of CI.
* turn on in VS Code (extension and format on save)
* `.prettierrc` file:

```
{
  "printWidth": 100,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true
 }
```

* update tslint file to remove formatting rules
  * diff: https://gist.github.com/victormejia/8a97cddc6d43078eee3a50b463fb85f9#file-tslint-diff-md
* add a `.prettierignore` file:

```
package.json
package-lock.json
tslint.json
.firbaserc
firebase.json
*.yml
```

* use precommit to automatically format

There are a few options here: `pretty-quick`, `lint-staged`, and `precise-commits` (by the Nrwl folks!!!). They are all great, but `precise-commits` is the best, in that in only checks the exact code that was modified, without mutating existing code.

This is a game changer, because you can start integrating Prettier into an existing codebase and it won't make your PRs challenging to review.

Configure precommit hook with `husky`:

```
"precise-commits": "precise-commits",
"precommit": "run-s lint precise-commits",
```

Now when you edit a file, and commit, `precise-commits` will apply Prettier only to the code you changed!

Note: this will format the files, but not commit them for you (which is something that `pretty-quick` and `lint-staged` do for you). They are considering adding an `--auto-commit` flag:

https://github.com/nrwl/precise-commits/issues/7

## Circle CI integration

* ci script
* setup steps
  _ npm install
  _ test
  * build
* workflows
* setup deployment when merged
* manual approval to promote to prod
* look at sample .yml file
