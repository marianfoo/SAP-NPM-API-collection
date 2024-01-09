npm config rm @sap:registry
node update-package-json.js
cp new-package.json package.json
# Reduce list of packages to update by using diff on package.json
git diff HEAD -- package.json | grep '^+\s*"' | cut -d '"' -f 2 > packages.txt

while read package; do
  ./npm_download.sh $package
  packageNoPrefix=`echo $package | sed 's/@sap//g'`
  mkdir "apis$packageNoPrefix"
  rsync -zarv  --include "*/" --include="*.md" --exclude="*" "node_modules/$package/" "apis$packageNoPrefix"
  cp node_modules/$package/LICENS* apis$packageNoPrefix
  cp -r node_modules/$package/doc apis$packageNoPrefix/doc
done <packages.txt
