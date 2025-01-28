require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dir = "src/environments";
const files = ["environment.ts", "environment.prod.ts"];

try {
  fs.writeFileSync(
    path.resolve(__dirname, '../../../firebase.json'),
    JSON.stringify({
      hosting: {
        site: process.env.FIREBASE_HOST,
        public: "dist",
        ignore: [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        rewrites: [
          {
            source: "**",
            destination: "/index.html"
          }
        ]
      }
    }, null, 2)
  );
  console.log("Configuração atualizada no firebase.json com sucesso!");
} catch (error) {
  console.error("Erro ao atualizar package.json:", error);
  process.exit(1);
}

const formattedContent = `export const environment = ${JSON.stringify({
  production: process.env.APP_VERSION !== 'debug',
  name: process.env.APP_NAME || packageJson.name,
  version: process.env.APP_VERSION || packageJson.version,
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  }
}, null, 2)};`;

fs.mkdirSync(dir, { recursive: true });
files.forEach((file) => {
  const filePath = path.join(dir, file);
  try {
    fs.writeFileSync(filePath, formattedContent);
    console.log(`Arquivo ${file} criado com sucesso!`);
  } catch (error) {
    console.error(`Erro ao escrever o arquivo ${file}:`, error);
    process.exit(1);
  }
});