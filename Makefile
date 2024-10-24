build:
	docker compose up --build --detach

start:
	docker compose up --detach

destroy:
	docker compose down --volumes

stop:
	docker compose stop

logs:
	docker compose logs --follow app