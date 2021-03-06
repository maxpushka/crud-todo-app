package main

import "time"

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
  todos map[int]*UserToDo // Map userId -> ToDoStorage
}

type UserToDo struct {
  lists map[int]*ToDoList // Map listId -> List
}

type ToDoList struct {
  Id int `json:"id"` // List unique identifier
  Name string `json:"name"` // List name
  tasks map[int]*Task // Map taskId -> Task
}

type Task struct {
  Id int `json:"id"` // Unique task id
  Name string `json:"name"` 
  Description string `json:"description"`
  IsCompleted bool `json:"isCompleted"`
  CreatedOn time.Time `json:"createdOn"`
}

// Example
// POST /todo/*list_id*/task
// Parameters:
//{
// task_name: "Read article",
// description: "la la la la la la" 
//}

type CreateTaskParameters struct {
  Name string `json:"name"`
  Description string `json:"description"`
}

type UpdateTaskParameters struct {
  Name string `json:"name"` 
  Description string `json:"description"`
  IsCompleted bool `json:"isCompleted"`
}

var userCounter int
var listsCounter int
var tasksCounter int

