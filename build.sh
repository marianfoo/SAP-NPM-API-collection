npm config rm @sap:registry
node update-package-json.js
cp new-package.json package.json
# Reduce list of packages to update by using diff on package.json
git diff HEAD -- package.json | grep '^+\s*"' | cut -d '"' -f 2 > packages.txt

while read package; do
  if ./npm_download.sh "$package"; then
    packageNoPrefix=$(echo $package | sed 's/@sap//g')
    mkdir "apis$packageNoPrefix"

    if ! rsync -zarv --include "*/" --include="*.md" --exclude="*" "node_modules/$package/" "apis$packageNoPrefix"; then
      echo "Error in rsync for package $package"
      continue
    fi

    if ! cp node_modules/$package/LICENS* "apis$packageNoPrefix"; then
      echo "Error copying LICENSE for $package"
      continue
    fi

    if ! cp -r node_modules/$package/doc "apis$packageNoPrefix/doc"; then
      echo "Error copying documentation for $package"
    fi
  else
    echo "Failed to download package $package"
  fi
done <packages.txt
