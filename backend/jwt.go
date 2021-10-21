package main

import (
	"net/http"

	"github.com/openware/rango/pkg/auth"
)

type JWTService struct {
  keys *auth.KeyStore
}

func NewJWTService(privKeyPath, pubKeyPath string) (*JWTService, error) {
  keys, err := auth.LoadOrGenerateKeys(privKeyPath, pubKeyPath)
  if err != nil {
    return nil, err
  }
  return &JWTService{keys: keys}, nil
}

func (j *JWTService) GenerateJWT(u User) (string, error) {
  return auth.ForgeToken("empty", u.Email, "empty", 0, j.keys.PrivateKey, nil)
}

func (j *JWTService) ParseJWT(jwt string) (auth.Auth, error) {
  return auth.ParseAndValidate(jwt, j.keys.PublicKey)
}

func wrapJwt(jwt *JWTService, f func(http.ResponseWriter, *http.Request, *JWTService)) http.HandlerFunc {
  return func(rw http.ResponseWriter, r *http.Request) {
    f(rw, r, jwt)
  }
}

