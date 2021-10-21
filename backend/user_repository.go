package main

import (
	"errors"
	"sync"
)

type InMemoryUserStorage struct {
  lock sync.RWMutex
  storage map[string]User
}

type UserRepository interface {
  Add(string, User) error
  Get(string) (User, error)
  //Update(string, User) error
  //Delete(string) (User, error)
}

func NewInMemoryUserStorage() *InMemoryUserStorage {
  return &InMemoryUserStorage{
    lock: sync.RWMutex{},
    storage: make(map[string]User),
  }
}

// Add should return error if user with given key (login) is already present
func (us *InMemoryUserStorage) Add(email string, user User) error {
  us.lock.RLock()
  _, ok := us.storage[email]
  us.lock.RUnlock()
  if ok {
    return errors.New("user is already registered")
  }

  us.lock.Lock()
  us.storage[email] = user
  us.lock.Unlock()
  return nil
}

func (us *InMemoryUserStorage) Get(email string) (User, error) {
  us.lock.RLock()
  user, ok := us.storage[email]
  us.lock.RUnlock()
  if !ok {
    return user, errors.New("no such user")
  }
  return user, nil
}

// TODO: InMemoryUserStorage.Update
// Update should return error if there is no such user to update
//func (us *InMemoryUserStorage) UpdateEmail(user User, newEmail string) error {}
//func (us *InMemoryUserStorage) UpdatePassword(user User, newEmail string) error {}

// TODO: InMemoryUserStorage.Delete
// Delete should return error if there is no such user to delete
// Delete should return deleted user
//func (us *InMemoryUserStorage) Delete(string) (User, error) {}
