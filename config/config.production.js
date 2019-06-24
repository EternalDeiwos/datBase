
const path = require('path')
const fs = require('fs')

function process_env (input, def) {
  if (!input) {
    return def
  }

  if (input === 'undefined') {
    return def
  }

  const num = Number(input)

  if (!Number.isNaN(num)) {
    return num
  }

  switch (input) {
    case 'false':
      return false
    case 'true':
      return true
    default:
      return input
  }
}

const data = process_env(process.env.DATA_DIR, '/data')
const whitelist_file = process_env(process.env.WHITELIST_FILE, 'whitelist.txt')

if (process_env(process.env.WHITELIST)) {
  const whitelist = process.env.whitelist.split(',')
  fs.writeFileSync(path.join(__dirname, whitelist_file), whitelist.join('\n'), { mode: 0o600 })
}

fs.writeFileSync(path.join(data, 'pubkey.pem'), process.env.TOWNSHIP_PUB_KEY, { mode: 0o640 })
fs.writeFileSync(path.join(data, 'prvkey.pem'), process.env.TOWNSHIP_PRV_KEY, { mode: 0o400 })

module.exports = {
  data,
  mixpanel: process_env(process.env.MIXPANEL_ENABLE, false) ? process.env.MIXPANEL_KEY : undefined,
  township: {
    secret: process.env.TOWNSHIP_SECRET,
    db: process_env(process.env.TOWNSHIP_DB, 'township.db'),
    publicKey: 'pubkey.pem',
    privateKey: 'prvkey.pem',
    algorithm: process_env(process.env.TOWNSHIP_DSA_JWA, 'ES512'),
  },
  email: {
    from: process_env(process.env.SMTP_FROM, 'noreply@datbase.org'),
    smtpConfig: !process_env(process.env.SMTP_ENABLE, false) ? undefined : {
      host: process_env(process.env.SMTP_HOST, 'smtp.postmarkapp.com'),
      port: process_env(process.env.SMTP_PORT, 2525),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      }
    }
  },
  db: {
    dialect: process_env(process.env.DB_DIALECT, 'sqlite3'),
    connection: {
      filename: process_env(process.env.DB_FILE, 'dat-production.db'),
    },
    useNullAsDefault: true
  },
  whitelist: process_env(process.env.WHITELIST_ENABLE, false) ? whitelist_file : false,
}
