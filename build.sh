echo "Building the project..."

if [ -d "dist" ]; then
  echo "dist directory exists. Removing it..."
  rm -rf dist
else
  echo "Client directory does not exist. Creating it..."
fi

mkdir dist

echo "Creating .env file..."
echo "NODE_ENV=production" > dist/.env

mkdir dist/client

cd server || exit 1
if [ -d "node_modules" ]; then
  echo "Node modules already installed."
else
  echo "Installing node modules..."
  npm install
fi

echo "Building the server..."
npm run build

cd .. || exit 1
echo "Copying server build to dist directory..."
cp -r server/dist/* dist/
cp -r server/node_modules dist/

cd client || exit 1
if [ -d "node_modules" ]; then
  echo "Node modules already installed."
else
  echo "Installing node modules..."
  npm install
fi

echo "Building client..."
npm run build

cd .. || exit 1
echo "Copying client build to dist/client directory..."
cp -r client/dist/* dist/client


echo "Build completed successfully!"
