# echo "Switching to branch main"
# git checkout main

# echo "Building app..."
# npm run build

# echo "Deploying files to server..."
# scp -r dist/* administrator@192.168.10.11:/var/www/LRMS-new-client/
# # scp -r build/* junebence@172.16.0.21:/var/www/feedback-app/

# echo "DONE!"

#!/bin/bash

#!/bin/bash

# Set version file path
VERSION_FILE="version.txt"

# Set default bump type
BUMP_TYPE=$1
if [ -z "$BUMP_TYPE" ]; then
  BUMP_TYPE="patch"
fi

# Ensure version file exists
if [ ! -f "$VERSION_FILE" ]; then
  echo "0.0.0" > "$VERSION_FILE"
fi

# Read version components
VERSION=$(cat "$VERSION_FILE")
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Bump version based on type
case $BUMP_TYPE in
  major)
    ((MAJOR+=1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    ((MINOR+=1))
    PATCH=0
    ;;
  patch)
    ((PATCH+=1))
    ;;
  *)
    echo "❌ Invalid bump type: $BUMP_TYPE"
    echo "Use: ./deploy.sh [major|minor|patch]"
    exit 1
    ;;
esac

# Save new version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "$NEW_VERSION" > "$VERSION_FILE"
echo "✅ Updated version to $NEW_VERSION"

# Deployment steps
echo "🚀 Switching to branch main"
git checkout main

echo "📦 Building app..."
npm run build

echo "📤 Deploying files to server..."
scp -r dist/* lrmds@172.16.0.26:/var/www/ilearn-app/
# scp -r build/* junebence@172.16.0.21:/var/www/feedback-app/

echo "✅ DONE!"
