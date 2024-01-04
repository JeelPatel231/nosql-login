import { config } from "dotenv"

// declare your env vars here
const AppConfigKeys = [
  'JWT_SECRET',
  'SALT_ROUNDS',
  
  'DB_USERNAME',
  'DB_PASSWORD',
  'CLUSTER_CONN_STRING',

  'SMTP_HOST',
  'SMTP_PORT',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
] as const


function strictEnvConfig<T extends string>(keys: readonly T[]) {
  config()
  const allKeys = keys.map(x => [x, process.env[x]])
  
  const unSetKeys = allKeys
    .filter(([_, value]) => value == null)
    .map(([x,_]) => x)

  if(unSetKeys.length != 0) {
    throw new Error(`${unSetKeys.join()}, these keys are mandatory to be set in order for app to work`)
  }

  return Object.fromEntries(allKeys) as Record<T, string>
}

export const CONFIG = strictEnvConfig(AppConfigKeys)
