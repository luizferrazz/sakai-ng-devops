const fs = require("fs")

const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${proccess.env.FIREBASE_API_KEY}',
    authDomain: '${proccess.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${proccess.env.FIREBASE_DATABASE_URL}',
    projectId: '${proccess.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${proccess.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${proccess.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: ${proccess.env.FIREBASE_APP_ID}'
  }
};`

fs.writeFileSync("./src/environments/environment.prod.ts", envConfigFile)
fs.writeFileSync("./src/environments/environment.ts", envConfigFile)
console.log("Environment config file generated")