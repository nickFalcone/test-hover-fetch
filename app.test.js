const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const timeout = 30000;

beforeAll(async () => {
  await page.goto('http://hover-fetch.surge.sh/', {
    waitUntil: 'networkidle2',
  });
});

describe('Initial prefetch state', () => {
  test(
    'There should be no <link rel="prefetch"> on first load.',
    async () => {
      await page
        .$eval('head', (head) => head.innerHTML)
        .then((result) => {
          const headNode = JSDOM.fragment(result);
          expect(headNode.querySelectorAll('link').length).toBe(0);
        });
    },
    timeout,
  );
});
// FIXME: these tests are order dependent.
// The state of existing link prefetch should be maintained separately.
describe('Hover behavior', () => {
  test(
    'home produces no prefetch',
    async () => {
      await page.waitForSelector('.home');
      await page.hover('.home');

      await page
        .$eval('head', (head) => head.innerHTML)
        .then((result) => {
          const headNode = JSDOM.fragment(result);
          expect(headNode.querySelectorAll('link').length).toBe(0);
        });
    },
    timeout,
  );

  // TODO: test malformed link e.g. <a href="a98f\sdfg\.7d9af">bad href</a>

  test(
    'Hovering over one anchor should create one <link rel="prefetch"> with a matching href value.',
    async () => {
      await page.waitForSelector('.stack-overflow');
      await page.hover('.stack-overflow');

      await page
        .$eval('head', (head) => head.innerHTML)
        .then((result) => {
          const headNode = JSDOM.fragment(result);
          expect(headNode.querySelectorAll('link').length).toBe(1);
          const link = headNode.querySelectorAll('link')[0];
          expect(link.rel).toBe('prefetch');
          expect(link.href).toBe('https://stackoverflow.com/');
        });
    },
    timeout,
  );

  test(
    'Subsequent hovers should not create additional <link rel="prefetch">',
    async () => {
      await page.waitForSelector('.stack-overflow');
      await page.hover('.stack-overflow');

      await page.waitForSelector('.browserify');
      await page.hover('.browserify');

      await page.waitForSelector('.pi-hole');
      await page.hover('.pi-hole');

      await page.waitForSelector('.home');
      await page.hover('.home');

      // hover each link again
      await page.hover('.stack-overflow');
      await page.hover('.browserify');
      await page.hover('.pi-hole');
      await page.hover('.home');

      await page
        .$eval('head', (head) => head.innerHTML)
        .then((result) => {
          const headNode = JSDOM.fragment(result);
          expect(headNode.querySelectorAll('link').length).toBe(3);

          // SSL .com - most likely scenario
          const link1 = headNode.querySelectorAll('link')[0];
          expect(link1.rel).toBe('prefetch');
          expect(link1.href).toBe('https://stackoverflow.com/');

          // http .org - less common
          const link2 = headNode.querySelectorAll('link')[1];
          expect(link2.rel).toBe('prefetch');
          expect(link2.href).toBe('http://browserify.org/');

          // SSL .net ¯\_(ツ)_/¯
          const link3 = headNode.querySelectorAll('link')[2];
          expect(link3.rel).toBe('prefetch');
          expect(link3.href).toBe('https://pi-hole.net/');
        });
    },
    timeout,
  );
  // TODO: test links with hashs

  // TODO: test links with query strings, ensure params are preserved

  /** TODO: links with query strings that were previously prefetched
   * without the query string should not be prefetched again
   * http://example.com/ vs https://example.com/?abc=123&doremi=abc
   *
   * https://url.spec.whatwg.org/#relative-url-with-fragment-string
   */
});
