import { config } from "dotenv"


config()

export const CONFIG = {
  saltRounds : process.env.SALT_ROUNDS!,
  jwtSecret : process.env.JWT_SECRET!,

  // DB Connection
  clusterConnectionStr: process.env.CLUSTER_CONN_STRING!,
  dbUsername: process.env.DB_USERNAME!,
  dbPassword: process.env.DB_PASSWORD!
}