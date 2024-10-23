import fs from 'fs'
import { config } from '../config/index.js'

async function task(user_id) {
    const logMessage = `${user_id}-task completed at-${Date.now()}\n`
    fs.appendFileSync(config.logFile, logMessage)
}

export { task }