import { task } from "../services/logger.js"

class TaskQueue {
    constructor() {
        this.queue = []
        this.processing = {}
    }

    enqueue(userTask) {
        const { user_id } = userTask

        if (!this.processing[user_id]) {
            // Initialize processing state for this user
            this.processing[user_id] = {
                count: 0,
                lastProcessed: Date.now(),
                isProcessing: false, // flag to track if a user is being processed
            }
        }

        // Add the task to the queue
        this.queue.push(userTask)

        // Only start processing if no other process is running for this user
        if (!this.processing[user_id].isProcessing) {
            this.processTasks(user_id)
        }
    }

    async processTasks(user_id) {
        // Mark the user as currently being processed
        this.processing[user_id].isProcessing = true

        // Filter tasks for the specific user
        let userTasks = this.queue.filter(task => task.user_id === user_id)

        // While there are tasks for the user in the queue
        while (userTasks.length > 0) {
            const now = Date.now()
            const timeSinceLastProcessed = now - this.processing[user_id].lastProcessed

            if (this.processing[user_id].count < 20 && timeSinceLastProcessed < 60000) {
                // Enforce a 1-second delay between task processing
                if (timeSinceLastProcessed < 1000) {
                    await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastProcessed))
                }

                // Process the task within the minute
                this.processing[user_id].count++
                const first_task = userTasks.shift()  // Get the first task from the user's tasks
                this.queue = this.queue.filter(t => t !== first_task)  // Remove task from the queue
                await task(user_id)

                this.processing[user_id].lastProcessed = Date.now() // Update last processed time
            } else if (timeSinceLastProcessed >= 60000) {
                // Reset count after a minute
                this.processing[user_id].count = 1
                this.processing[user_id].lastProcessed = now
                const first_task = userTasks.shift()
                this.queue = this.queue.filter(t => t !== first_task)
                await task(user_id)
            }

            // Refresh the list of user tasks in case new ones have been added
            userTasks = this.queue.filter(task => task.user_id === user_id)

            // Wait 1 second between processing tasks
            if (userTasks.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        // No more tasks for this user, mark as not processing
        this.processing[user_id].isProcessing = false
    }
}

const taskQueue = new TaskQueue()
export default taskQueue
