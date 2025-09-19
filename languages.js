const { join } = require('path');
const { readdirSync, lstatSync } = require('fs');

const defaultLanguage = 'en';

// Based on the directories get the language codes
const languages = readdirSync(join(__dirname, 'locales')).filter((fileName) => {
  const joinedPath = join(join(__dirname, 'locales'), fileName);
  const isDirectory = lstatSync(joinedPath).isDirectory();
  return isDirectory;
});

// Put defaultLanguage as first
languages.splice(languages.indexOf(defaultLanguage), 1);
languages.unshift(defaultLanguage);

module.exports = {
  languages,
  defaultLanguage,
};
