# GraphQL API

This GraphQL API is implemented with [Yoga](https://www.graphql-yoga.com/) and [Pothos](https://pothos-graphql.dev/), offering a type-safe and powerful API layer. The API handles data retrieval and mutations, user authentication, and geospatial queries powered by PostGIS.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Running the API Server](#running-the-api-server)
  - [Authentication](#authentication)
- [Exploring the Schema](#exploring-the-schema)
- [Contributing](#contributing)
- [License](#license)

## Setup Instructions

The GraphQL API is located in the `/api` directory and is a Node.js project. Follow the steps below to set up the API:

### 1. Navigate to the API Directory

```bash
cd api
```

### 2. Install Dependencies

Install the necessary Node.js packages using `npm`:

```bash
npm install
```

### 3. Set the Environment Variables

Copy the example environment file and modify it as needed:

```bash
cp env.example .env.local
# Make the necessary changes to .env.local
```

### 4. Build the Prisma Module

After installing the dependencies, build the Prisma module:

```bash
npm run build
```

### 5. Load Seed Data

Once the Prisma module is built, load the seed data into the database:

```bash
npx prisma db seed
```

### 6. Start the API Server

Finally, start the GraphQL API server:

```bash
npm start
```

The GraphQL API will be accessible at [http://localhost:4000](http://localhost:4000).

## Environment Variables

The API uses several environment variables to manage its configuration. Below is a list of these variables, along with their default values and descriptions:

| Variable Name           | Default Value                                     | Description                                                                 |
|-------------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `NODE_ENV`              | `development`                                     | Specifies the environment mode (`development`, `production`, etc.).         |
| `DATABASE_URL`          | `postgresql://user:pass@localhost:5432/postgres`  | Connection URL for the Postgres database.                                   |
| `MAX_PEOPLE_PER_SEARCH` | `10`                                              | Maximum number of people returned in a search query.                        |
| `FILESERVER_URL`        | `http://localhost:3001`                           | URL of the static file server for handling user-uploaded files.             |
| `MAX_PICTURES_PER_USER` | `4`                                               | Maximum number of pictures a user can upload.                               |
| `SUPERUSER_TOKEN`       | `"Helloworld"`                                    | Token that grants superuser access, useful for development and testing.     |
| `APP_SECRET`            | `"somesecret"`                                    | Secret key used to sign JWT tokens.                                          |
| `TOKEN_DURATION`        | `'1h'`                                            | Duration of the JWT token validity (e.g., `1h` for 1 hour).                 |

Make sure to update these values in the `.env.local` file as per your environment setup.

## Usage

### Running the API Server

After completing the setup instructions, you can run the API server using the following command:

```bash
npm start
```

The API server will be available at [http://localhost:4000](http://localhost:4000).

### Authentication

Most queries and mutations in this API are protected by JWT-based authentication. To perform these operations, you will need a valid JWT token, which can be obtained by:

1. **Signup:** Create a new user account.
2. **Login:** Authenticate an existing user.
3. **Token Refresh:** Refresh an expired or about-to-expire token.

The JWT token should be included in the `Authorization` header of your requests, in the following format:

```http
Authorization: Bearer <your-token-here>
```

The token stores the following information:

- `userId`: The ID of the authenticated user.

The token's validity duration is defined by the `TOKEN_DURATION` environment variable, and the secret used to sign the JWT is stored in the `APP_SECRET` environment variable.

## Exploring the Schema

The GraphQL API schema can be explored using [Yoga GraphiQL](https://the-guild.dev/graphql/yoga-server/docs/features/graphiql) or other tools like [GraphQL Playground](https://github.com/graphql/graphql-playground). You can access the GraphiQL interface at [http://localhost:4000](http://localhost:4000) when the server is running.

## Contributing

This project is a closed exercise for learning purposes, and external contributions are not accepted.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
```

### Summary of Additions:
- **Environment Variables**: Detailed table with variable names, default values, and descriptions.
- **Authentication**: Explanation of how JWT tokens are used, how they are generated, and the significance of the environment variables related to authentication.
- **Exploring the Schema**: Mentioned tools for exploring the GraphQL schema.
- **Clear Instructions**: Provided explicit instructions for setup, running the server, and configuring the environment. 

This README provides all necessary details for setting up, configuring, and using the API effectively.
