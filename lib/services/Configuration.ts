import { config } from "dotenv"

type AppConfig = {
  JWT_SECRET: string,
  SALT_ROUNDS: string,
  DB_USERNAME: string,
  DB_PASSWORD: string,
  CLUSTER_CONN_STRIN: string,
}

function strictEnvConfig<T>(keys: string[]) {
  config()
  const allKeys = keys.map(x => [x, process.env[x.valueOf()]])
  
  const unSetKeys = allKeys
    .filter(([_, value]) => value == null)
    .map(([x,_]) => x)

  if(unSetKeys.length != 0) {
    throw new Error(`${unSetKeys.join()}, these keys are mandatory to be set in order for app to work`)
  }

  return Object.fromEntries(allKeys) as T // TODO: fix this unchecked cast
}


// TODO: use typescript type's keys as values for reducing redundancy
export const CONFIG: AppConfig = strictEnvConfig<AppConfig>([
  'JWT_SECRET',
  'SALT_ROUNDS',
  'DB_USERNAME',
  'DB_PASSWORD',
  'CLUSTER_CONN_STRING'
])
