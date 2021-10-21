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

func mockHandler(w http.ResponseWriter, r *http.Request) {
  log.Println("handled!")
}

func main() {
  r := mux.NewRouter()

  users := NewInMemoryUserStorage()
  userService := UserService{repository: users}
  jwtService, err := NewJWTService("jwt_key", "jwt_key.pub")
  if err != nil {
    log.Println("Error: invalid path for public or private keys")
    return
  }

  r.HandleFunc("/user/signup", logRequest(userService.SignUpHandler)).Methods(http.MethodPost)  // creates user in-memory
  r.HandleFunc("/user/signin", logRequest(wrapJwt(jwtService, userService.SignInHandler))).Methods(http.MethodPost)  // returns JWT access token

  r.HandleFunc("/todo/lists", logRequest(mockHandler)).Methods(http.MethodPost)  // created a new todo list
  r.HandleFunc("/todo/lists", logRequest(mockHandler)).Methods(http.MethodGet)  // returns all the lists for the given user
  r.HandleFunc("/todo/lists/{list_id}", logRequest(mockHandler)).Methods(http.MethodPut)  // updates todo list
  r.HandleFunc("/todo/lists/{list_id}", logRequest(mockHandler)).Methods(http.MethodDelete)  // deletes todo list

  r.HandleFunc("/todo/lists/{list_id}/tasks", logRequest(mockHandler)).Methods(http.MethodGet)  // returns all the tasks for the given user in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks", logRequest(mockHandler)).Methods(http.MethodPost)  // creates a task in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(mockHandler)).Methods(http.MethodPut)  // updates a task in the specified list
  r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(mockHandler)).Methods(http.MethodDelete)  // deletes a task in the specified list
  
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

