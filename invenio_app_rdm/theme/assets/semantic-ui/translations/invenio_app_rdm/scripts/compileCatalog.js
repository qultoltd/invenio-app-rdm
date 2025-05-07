// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio-app-rdm is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
const path = require("path");

const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { gettextToI18next } = require("i18next-conv");

const PACKAGE_JSON_BASE_PATH = "./";
const { languages } = require(`../package`).config;

// it accepts the same options as the cli.
// https://github.com/i18next/i18next-gettext-converter#options
const options = {
  /* you options here */
};

function compileTranslationsForLanguage(lang) {

  const langDir = `${PACKAGE_JSON_BASE_PATH}messages/${lang}`;
  
  const poFiles = readdirSync(langDir).filter(file => file.endsWith(".po"));
  
  const promises = poFiles.map(poFile => {
    const filePath = path.join(langDir, poFile);
    return gettextToI18next(lang, readFileSync(filePath), options);
  });

  Promise.all(promises).then(translations => {
    const combined = translations.reduce((result, current) => ({...result, ...JSON.parse(current)}), {});
    const outputPath = `${langDir}/translations.json`;
    writeFileSync(outputPath, JSON.stringify(combined, null, 2));
  });
}

if ("lang" === process.argv[2]) {
  const lang = process.argv[3];
  compileTranslationsForLanguage(lang)
} else {
  for (const lang of languages) {
    compileTranslationsForLanguage(lang)
  }
}
