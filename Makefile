backend:
	bash -c "cd backend && go run ."

frontend:
	bash -c "cd frontend && npm i && npm run start"

.PHONY: backend frontend

