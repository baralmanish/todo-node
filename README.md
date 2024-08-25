# TODO App

## TechStacks

- Language: TypeScript
- Framework: Express
- ORM: TypeORM
- Database: Postgresql
- Linting: Prettier & Eslint
- Test: Jest

## Setup

- Install Node with version v20.13.1 or higher
- Install Docker
- Open Docker
- Go to GIT repo [todo-node](https://github.com/baralmanish/todo-node)
- Clone the repo

```bash
git clone git@github.com:baralmanish/todo-node.git
```

- Install node packages

```bash
npm install
```

- Run application

```bash
docker compose up -d
```

- Stop application

```bash
docker compose down
```

## Useful Commands

- Run unit tests

```bash
npm run test
```

- Prettier Check

```bash
npm run prettier:check
```

- Prettier Fix

```bash
npm run prettier:write
```

- Lint Check

```bash
npm run lint:check
```

- Lint Fix

```bash
npm run lint:fix
```

- Setup Husky

```bash
npm run prepare
```

## API URLs

### Login

URL: `http://localhost:3001/api/auth/login`

Method: `POST`

Request Body:

```
{
    "username": "user_name",
    "password": "User@123"
}
```

### Register

URL: `http://localhost:3001/api/auth/register`

Method: `POST`

Request Body:

```
{
    "firstName": "User",
    "lastName": "Name",
    "username": "user_name",
    "password": "User@123"
}
```

### Get TODO

URL: `http://localhost:3001/api/todo`

Method: `GET`

### Add TODO

URL: `http://localhost:3001/api/todo`

Method: `POST`

Request Body:

```
{
    "title": "Add TODO"
}
```

### Update TODO

URL: `http://localhost:3001/api/todo/:id`

Method: `PUT`

Request Body:

```
{
    "title": "Update TODO"
}
```

### Delete TODO

URL: `http://localhost:3001/api/todo/:id`

Method: `DELETE`

## ENV Variables

```
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=track_mgmt_todo
POSTGRES_DB=track_mgmt_todo
CLIENT_URL=http://localhost:3000
JWT_SECRET="your-secret-key"
```
