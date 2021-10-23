package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "time"

  "github.com/gorilla/mux"
)

func main() {
  r := mux.NewRouter()

  users := NewInMemoryUserStorage()
  todos := &ToDo{todos: make(map[int]*UserToDo)}
  userService := UserService{repository: users}
  jwtService, err := NewJWTService("jwt_key", "jwt_key.pub")
  if err != nil {
    log.Println("Error: invalid path for public or private keys")
    return
  }

  r.HandleFunc("/user/signup", logRequest(userService.WrappedSignUpHandler(todos))).Methods(http.MethodPost)  // creates user in-memory
  r.HandleFunc("/user/signin", logRequest(wrapJwt(jwtService, userService.SignInHandler))).Methods(http.MethodPost)  // returns JWT access token

  r.HandleFunc("/todo/lists", logRequest(jwtService.jwtAuth(users, todos, CreateToDoListHandler))).Methods(http.MethodPost)  // created a new todo list
  r.HandleFunc("/todo/lists", logRequest(jwtService.jwtAuth(users, todos, GetToDoListsHandler))).Methods(http.MethodGet)  // returns all the lists for the given user
  r.HandleFunc("/todo/lists/{list_id}", logRequest(jwtService.jwtAuth(users, todos, UpdateToDoListHandler))).Methods(http.MethodPut)  // updates todo list
  r.HandleFunc("/todo/lists/{list_id}", logRequest(jwtService.jwtAuth(users, todos, DeleteToDoListHandler))).Methods(http.MethodDelete)  // deletes todo list

  r.HandleFunc("/todo/lists/{list_id}/tasks", logRequest(jwtService.jwtAuth(users, todos, GetTasksHandler))).Methods(http.MethodGet)  // returns all the tasks for the given user in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks", logRequest(jwtService.jwtAuth(users, todos, CreateTaskHandler))).Methods(http.MethodPost)  // creates a task in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(jwtService.jwtAuth(users, todos, UpdateTaskHandler))).Methods(http.MethodPut)  // updates a task in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(jwtService.jwtAuth(users, todos, DeleteTaskHandler))).Methods(http.MethodDelete)  // deletes a task in the specified list
  
  srv := http.Server{
    Addr: ":8080",
    Handler: r,
  }

  interrupt := make(chan os.Signal, 1)
  signal.Notify(interrupt, os.Interrupt)
  go func() {
    <-interrupt
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
  }()

  log.Println("Server started, hit Ctrl+C to stop")
  err = srv.ListenAndServe()
  if err != nil {
    log.Println("Server exited with error:", err)
  }
  
  log.Println("See you!")
}

