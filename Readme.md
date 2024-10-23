### User Task Queuing with Rate Limiting

#### Overview:
This project is a task queuing system with rate-limiting functionality. The API allows tasks to be submitted for specific users (`user_id`), and the system processes these tasks in a queue, ensuring no more than **1 task per second** and **20 tasks per minute** per user.

---

### API Endpoint:
- **URL**: `http://localhost:3000/api/v1/task`
- **Method**: `POST`
- **JSON Body**:
    ```json
    {
        "user_id": "123"
    }
    ```
- **Response**:
    - **202 Accepted**:
      ```json
      {
          "message": "Task is being processed"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
          "error": "Bad Request",
          "message": "user_id is required in the request."
      }
      ```

---

### Core Files:
1. **`server.js`**:
   - **Description**: Entry point for the Express.js server. Configures clusters ( 2 replica sets ), routes, and starts the server.
   
2. **`config/index.js`**:
   - **Description**: Handles application configurations (e.g., loading environment variables).

3. **`routes/taskRoutes.js`**:
   - **Description**: Defines the route for handling tasks (`/api/v1/task`). Forwards requests to the `taskController`.

4. **`controllers/taskController.js`**:
   - **Description**: Processes incoming task requests by forwarding them to the `TaskQueue` system.
   - **Functionality**:
      - Queues tasks based on `user_id` by calling `taskQueue.enqueue`.

5. **`queues/TaskQueue.js`**:
   - **Description**: Implements a custom task queuing system with rate limiting. Ensures:
     - **1 task per second** for each user.
     - **20 tasks per minute** for each user.
   - **Key Methods**:
     - `enqueue`: Adds a task to the queue.
     - `processTasks`: Processes the tasks while adhering to rate-limiting constraints.

6. **`services/logger.js`**:
   - **Description**: Simulates the actual processing of a task. This function logs task processing events.

7. **`.env`**:
   - **Description**: Stores environment variables (e.g., port number).

8. **`logs/task.log`**:
   - **Description**: Log file where task processing events are recorded.

---

### Folder Structure:

```
FinTarget/
│
├── logs/
│   └── task.log                 # Log file for task events
│
├── node_modules/                # Installed npm modules
│
├── src/
│   ├── config/
│   │   └── index.js             # Configuration settings (e.g., loading env vars)
│   │
│   ├── controllers/
│   │   └── taskController.js     # Handles task request and passes to TaskQueue
│   │
│   ├── queues/
│   │   └── TaskQueue.js          # Manages task queue with rate limiting
│   │
│   ├── routes/
│   │   └── taskRoutes.js         # Defines task routes (e.g., POST /task)
│   │
│   ├── services/
│   │   └── logger.js             # Handles task processing (logs task actions)
│   │
│   └── server.js                 # Main server file (Express app entry point)
│
└── .env                          # Environment variables
```

---

### Instructions:
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm run start
   ```

3. **Send a task request**:
   Use the following JSON format in your POST request to `http://localhost:3000/api/v1/task`:
   ```json
   {
       "user_id": "your_user_id"
   }
   ```

4. **Logs**:
   Task processing events are logged in `logs/task.log`.

---

This documentation provides an overview of the core files and functionality of the task queuing system. Each component has been designed for modularity and adherence to rate-limiting constraints.