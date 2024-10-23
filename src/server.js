import cluster from 'cluster'
import express from 'express'
import taskRoutes from './routes/taskRoutes.js'

const numCPUs = 2 // two replica

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
} else {
    const app = express()
    app.use(express.json())
    app.use('/api/v1', taskRoutes)

    // Start server
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started, listening on port ${PORT}`)
    })
}
