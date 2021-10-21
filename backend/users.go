package main

type User struct {
  id int
  Email string
  PasswordDigest string
}

type UserJWTParams struct {
  Email string `json:"email"`
  Password string `json:"password"`
}

type UserService struct {
  repository *InMemoryUserStorage
}

// ToDo serves map of userIds to their ToDoStorages
type ToDo struct {
  todos map[int]UserToDo
}

type UserToDo struct {
  lists map[int]ToDoList // Map listId -> List
}

type ToDoList struct {
  id int // List unique identifier
  tasks map[int]Task // Map taskId -> Task
}

type Task struct {
  id int // Unique task id
  name string 
  description string 
  status string 
}

// Example
// POST /todo/*list_id*/task
// Parameters:
//{
// task_name: "Read article",
// description: "la la la la la la" 
//}

type CreateTaskParameters struct {
  list_id int // Should be taken from query
  task_name string `json:"task_name"`
  task_description string `json:"task_description"`
}

var globalTodos ToDo
var userCounter int
var listsCounter int
var tasksCounter int

func createNewTask(user User, params CreateTaskParameters) {
  userTodos := globalTodos.todos[user.id]
  list := userTodos.lists[params.list_id]
  tasksCounter++
  taskId := tasksCounter
  task := Task{
    id: taskId,
    name: params.task_name,
    description: params.task_description,
  }

  list.tasks[taskId] = task
}

