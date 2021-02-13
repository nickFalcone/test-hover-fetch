# Simple page to test [Hover Fetch](https://github.com/nickFalcone/hover-fetch)

```bash
$ git clone git@github.com:nickFalcone/test-hover-fetch.git

$ cd test-hover-fetch/

$ npm install --save-dev

$ npm run dev     # start a local build

$ npm run deploy  # deploy site with Surge

$ npm run test    # run tests with Jest + Puppeteer

$ npm publish # publish new version to NPM, need to increment in package.json first
```

## Test

```bash
npm run test
```

Test shortcomings:
1. The tests run against the live site: http://hover-fetch.surge.sh/. Running tests against a local build is preferable.
2. 
