echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r dist/* administrator@192.168.10.11:/var/www/LRMS-new-client/
# scp -r build/* junebence@172.16.0.21:/var/www/feedback-app/

echo "DONE!"