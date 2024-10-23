import dotenv from 'dotenv'

dotenv.config()

export const config = {
  logFile: process.env.LOG_FILE,
}
