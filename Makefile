run:
	make backend && make frontend

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
keys:
	ssh-keygen -t rsa -f $(mkfile_path)/backend/jwt_key -N "" -q

.PHONY: backend frontend

backend: keys
	bash -c "cd backend && go run ."

frontend:
	bash -c "cd frontend && npm i && npm run start"
