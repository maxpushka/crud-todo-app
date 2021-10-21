package main

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"
)

func validateRegisterParams(p *UserJWTParams) error {
  // validate email
  if _, err := mail.ParseAddress(p.Email); err != nil {
    return err
  }

  // validate password
  if len(p.Password) < 8 {
    return errors.New("password should be at least 8 symbols")
  }

  return nil
}

func (u *UserService) SignUpHandler(w http.ResponseWriter, r *http.Request) {
  params := &UserJWTParams{}
  if err := json.NewDecoder(r.Body).Decode(params); err != nil {
    handleError(errors.New("could not read params"), w)
    return
  }

  if err := validateRegisterParams(params); err != nil {
    handleError(err, w)
    return
  }

  userCounter++
  passwordDigest := md5.New().Sum([]byte(params.Password))
  newUser := User{
    Email: params.Email,
    PasswordDigest: string(passwordDigest),
    id: userCounter,
  }

  if err := u.repository.Add(params.Email, newUser); err != nil {
    userCounter--
    handleError(err, w)
    return
  }

  w.WriteHeader(http.StatusCreated)
  w.Write([]byte("registered"))
}

func (u *UserService) SignInHandler(w http.ResponseWriter, r *http.Request, jwtService *JWTService) {
  params := &UserJWTParams{}
  err := json.NewDecoder(r.Body).Decode(params) 
  if err != nil {
    handleError(errors.New("could not read params"), w)
    return
  }

  user, err := u.repository.Get(params.Email)
  if err != nil {
    handleError(err, w)
    return
  }

  passwordDigest := md5.New().Sum([]byte(params.Password))
  if user.PasswordDigest != string(passwordDigest) {
    handleError(errors.New("invalid password"), w)
    return
  }

  token, err := jwtService.GenerateJWT(user)
  if err != nil {
    handleError(err, w)
    return
  }

  w.WriteHeader(http.StatusOK)
  w.Write([]byte(token))
}
