package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func GetTasksHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
	vars := mux.Vars(r)

	listId, errList := strconv.Atoi(vars["list_id"])
	if errList != nil {
		handleError(errors.New("cannot extract list id"), w)
		return
	}

	list, ok := todolists.lists[listId]
	if !ok {
		handleError(errors.New("requested list does not exits"), w)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(list.tasks)
}

func createNewTask(params CreateTaskParameters, list *ToDoList) int {
	tasksCounter++
	taskId := int(time.Now().Unix())
	task := &Task{
		Id:          taskId,
		Name:        params.Name,
		Description: params.Description,
		IsCompleted: false,
		CreatedOn:   time.Now(),
	}

	list.tasks[taskId] = task

	return taskId
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request, u User, todolists *UserToDo) {
	vars := mux.Vars(r)
	listId, errList := strconv.Atoi(vars["list_id"])
	if errList != nil {
		handleError(errors.New("cannot extract list id"), w)
		return
	}

	list, ok := todolists.lists[listId]
	if !ok {
		handleError(errors.New("requested list does not exits"), w)
		return
	}

	params := CreateTaskParameters{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		handleError(errors.New("could not read params"), w)
		return
	}

	taskId := createNewTask(params, list)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(strconv.Itoa(taskId)))
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request, _ User, todolists *UserToDo) {
	vars := mux.Vars(r)
	listId, errList := strconv.Atoi(vars["list_id"])
	if errList != nil {
		handleError(errors.New("cannot extract list id"), w)
		return
	}

	taskId, errTask := strconv.Atoi(vars["task_id"])
	if errTask != nil {
		handleError(errors.New("cannot extract task id"), w)
		return
	}

	list, okList := todolists.lists[listId]
	if !okList {
		handleError(errors.New("requested list does not exits"), w)
		return
	}

	task, okTask := list.tasks[taskId]
	if !okTask {
		handleError(errors.New("requested task does not exits"), w)
		return
	}

	updatedTask := UpdateTaskParameters{}
	err := json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		handleError(errors.New("could not read params"), w)
		return
	}

	task.Name = updatedTask.Name
	task.Description = updatedTask.Description
	task.IsCompleted = updatedTask.IsCompleted

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("updated"))
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request, _ User, todolists *UserToDo) {
	vars := mux.Vars(r)
	listId, errList := strconv.Atoi(vars["list_id"])
	if errList != nil {
		handleError(errors.New("cannot extract list id"), w)
		return
	}

	taskId, errTask := strconv.Atoi(vars["task_id"])
	if errTask != nil {
		handleError(errors.New("cannot extract task id"), w)
		return
	}

	list, okList := todolists.lists[listId]
	if !okList {
		handleError(errors.New("requested list does not exits"), w)
		return
	}

	_, okTask := list.tasks[taskId]
	if !okTask {
		handleError(errors.New("requested task does not exits"), w)
		return
	}

	delete(list.tasks, taskId)
	tasksCounter--
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("deleted"))
}
