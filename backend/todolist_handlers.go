package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func GetToDoListsHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  json.NewEncoder(w).Encode(todolists.lists)
}

type ToDoListParams struct {
  Name string `json:"name"`
}

func CreateToDoListHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
  params := &ToDoListParams{}
  err := json.NewDecoder(r.Body).Decode(params) 
  if err != nil {
    handleError(errors.New("could not read params"), w)
    return
  }

  id := int(time.Now().Unix())

  newToDoList := &ToDoList{
    Id: id,
    Name: params.Name,
    tasks: make(map[int]*Task),
  }

  todolists.lists[id] = newToDoList
  listsCounter++
  w.WriteHeader(http.StatusOK)
  w.Write([]byte(strconv.Itoa(id)))
}

func UpdateToDoListHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
  params := &ToDoListParams{}
  err := json.NewDecoder(r.Body).Decode(params) 
  if err != nil {
    handleError(errors.New("could not read params"), w)
    return
  }

  vars := mux.Vars(r)
  listId, err := strconv.Atoi(vars["list_id"])
  if err != nil {
    handleError(errors.New("cannot extract list id"), w)
    return
  }
  
  list, ok := todolists.lists[listId]
  if !ok {
    handleError(errors.New("requested list does not exits"), w)
    return
  }

  list.Name = params.Name
  w.WriteHeader(http.StatusOK)
  w.Write([]byte("updated"))
}

func DeleteToDoListHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
  vars := mux.Vars(r)
  listId, err := strconv.Atoi(vars["list_id"])
  if err != nil {
    handleError(errors.New("cannot extract list id"), w)
    return
  }
  
  _, ok := todolists.lists[listId]
  if !ok {
    handleError(errors.New("requested list does not exits"), w)
    return
  }

  delete(todolists.lists, listId)
  listsCounter--
  w.WriteHeader(http.StatusOK)
  w.Write([]byte("deleted"))
}
