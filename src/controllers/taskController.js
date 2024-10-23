import taskQueue from "../queues/TaskQueue.js"

export const handleTask = (req, res) => {
    const { user_id } = req.body

    if (user_id) {
        // Queue the task
        taskQueue.enqueue({ user_id })
        res.status(202).json(
            {
                message: 'Task is being processed'
            }
        )
    } else {
        res.status(400).json(
            {
                "error": "Bad Request",
                "message": "user_id is required in the request."
            }
        )
    }
}
