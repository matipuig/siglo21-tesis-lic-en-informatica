const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, './dataset'); // Change this to your folder path

const processFiles = async (directory) => {
  const contents = fs.readdirSync(directory, { withFileTypes: true });

  contents.forEach((content) => {
    const contentPath = path.join(directory, content.name);
    if (fs.statSync(contentPath).isDirectory()) {
      return processFiles(contentPath);
    }

    const fileContent = fs.readFileSync(contentPath, 'utf8');
    const subjectRegex = /Subject:(.*?)(\n|$)/img;
    const subjectText = fileContent.match(subjectRegex);
    const fileTitle = subjectText[0].replace(/Subject: +/, '').replace(/[\/:*?"<>|]/g, '');
    const newFileName = fileTitle.trim() + '.txt';
    const newPath = path.join(directory, newFileName);
    try {
      fs.renameSync(contentPath, newPath);
    } catch (error) {
      console.error('Failed: ' + contentPath);
    } 
  })
}

processFiles(folderPath);