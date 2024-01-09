const fs = require('fs');

const searchNpmPackages = async (query, from, limit) => {
  const response = await fetch(
    `https://registry.npmjs.org/-/v1/search?text=${query}&size=${limit}&from=${from}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
};

(async () => {
  var packageDotJson = 'package.json';
  var packagesTxt = '';
  let from = 0;
  let limit = 50;
  let total = 0;
  let packages = {};
  let hasMore = true;

  while (hasMore) {
    const searchResult = await searchNpmPackages('@sap', from, limit);
    const packagesSearchResult = searchResult.objects;
    total += packagesSearchResult.length;
    packagesSearchResult.forEach((packageObj) => {
      var package = packageObj.package;
      packages[package.name] = package.version;
    });
    from += limit;
    hasMore = packagesSearchResult.length > 0;
  }
  console.log(`Found ${total} package(s)`);

  const ordered = {};
  Object.keys(packages)
    .sort()
    .forEach(function (key) {
      ordered[key] = packages[key];
      packagesTxt += key + '\n';
    });

  fs.readFile(packageDotJson, function (err, packageData) {
    if (err) throw err;
    var packageJson = JSON.parse(packageData);
    packageJson.dependencies = ordered;
    fs.writeFile(
      'new-' + packageDotJson,
      JSON.stringify(packageJson, null, 2),
      function (err) {
        if (err) throw err;
        console.log('The dependencies were updated');
      }
    );
    fs.writeFile('packages.txt', packagesTxt, function (err) {
      if (err) throw err;
      console.log('The file packages.txt was updated');
    });
  });
})();
