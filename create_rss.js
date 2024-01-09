const fs = require('fs');
const { execSync } = require('child_process');
const RSS = require('rss');
const { marked } = require('marked');

const xml2js = require('xml2js');
const he = require('he');

const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds

// Custom renderer to prevent automatic link conversion
const renderer = new marked.Renderer();
renderer.link = (href, title, text) => text; // Render link text only, no anchor tag

// Configure marked to prevent automatic linking
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

// Function to parse existing RSS feed
async function parseExistingFeed(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const xml = fs.readFileSync(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Function to filter out old items
function filterOldItems(feed) {
  const cutoffDate = new Date(Date.now() - SIX_MONTHS);
  if (feed && feed.rss && feed.rss.channel && feed.rss.channel[0] && feed.rss.channel[0].item) {
    feed.rss.channel[0].item = feed.rss.channel[0].item.filter(item => {
      const itemDate = new Date(item.pubDate[0]);
      return itemDate > cutoffDate;
    });
  }
  return feed;
}

// Function to get and clean git diff of the CHANGELOG.md file
function getChangelogDiff(path) {
  try {
    const diff = execSync(`git diff HEAD~1 -- ${path}`).toString();
    // Filter out only additions and deletions
    const filteredDiff = diff.split('\n')
                             .filter(line => line.startsWith('-') || line.startsWith('+'))
                             .map(line => line.substring(1).trim()) // Remove '-' or '+' and trim whitespace
                             .join('\n');
    // Convert Markdown to HTML and encode it
    return he.encode(marked(filteredDiff));
  } catch (error) {
    console.error(`Error getting changelog diff for ${path}:`, error.message);
    return '';
  }
}

// Function to read package name from package.json
function getPackageName(path) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    return packageJson.name || 'Unknown';
  } catch (error) {
    console.error(`Error reading package name from ${path}:`, error.message);
    return 'Unknown';
  }
}

// Function to generate/update the RSS feed
async function generateRSSFeed(apisFolderPath, docsFolderPath) {
  let existingFeed = await parseExistingFeed(`${docsFolderPath}/rss.xml`);
  existingFeed = filterOldItems(existingFeed);

  const feed = new RSS({
    title: 'API Updates',
    description: 'List of recent updates to APIs',
    feed_url: `${docsFolderPath}/rss.xml`,
    site_url: 'http://example.com',
    language: 'en',
    pubDate: new Date().toUTCString()
  });

  if (existingFeed && existingFeed.rss && existingFeed.rss.channel && existingFeed.rss.channel[0]) {
    existingFeed.rss.channel[0].item.forEach(oldItem => {
      feed.item({
        title: oldItem.title[0],
        description: oldItem.description[0],
        url: oldItem.link[0],
        guid: oldItem.guid[0]._,
        date: oldItem.pubDate[0]
      });
    });
  }

  fs.readdirSync(apisFolderPath, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) {
      const packagePath = `${apisFolderPath}/${dirent.name}`;
      const changelogPath = `${packagePath}/CHANGELOG.md`;

      if (fs.existsSync(changelogPath)) {
        const diff = getChangelogDiff(changelogPath);
        if (diff) {
          const packageName = getPackageName(packagePath);
          feed.item({
            title: `${packageName} - Recent Update`,
            description: diff,
            url: `http://example.com/${dirent.name}/CHANGELOG.md`, // URL to the changelog
            date: new Date().toUTCString()
          });
        }
      }
    }
  });

  // Write the updated RSS feed to the docs folder
  fs.writeFileSync(`${docsFolderPath}/rss.xml`, feed.xml({ indent: true }));
  console.log('RSS feed updated successfully.');
}

const apisFolderPath = './apis';
const docsFolderPath = './docs';

generateRSSFeed(apisFolderPath, docsFolderPath);
