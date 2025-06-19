// scraper.js
const puppeteer = require('puppeteer');

module.exports = async function scrapeDuckDuckGo(query) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome Safari'
  );

  await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`, {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForSelector('.result');

  const results = await page.$$eval('.result', nodes =>
    nodes.map(el => {
      const titleEl = el.querySelector('.result__title');
      const linkEl = el.querySelector('a.result__a');
      const descEl = el.querySelector('.result__snippet');

      return {
        title: titleEl?.innerText || 'No title',
        url: linkEl?.href || '#',
        snippet: descEl?.innerText || 'No description'
      };
    }).filter(r => r.url.startsWith('http'))
  );

  await browser.close();
  return results;
};
