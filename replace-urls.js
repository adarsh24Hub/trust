const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src', 'pages');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace string literals like 'http://localhost:5000/api/...'
  content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
  content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
  
  // Replace within template literals like `http://localhost:5000${ev.image}`
  content = content.replace(/`http:\/\/localhost:5000(.*?`/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1');

  fs.writeFileSync(filePath, content, 'utf8');
};

const processDirectory = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  });
};

processDirectory(directoryPath);
console.log('Successfully updated API URLs in frontend components!');
