# Dating App

## Project Overview

This project is a comprehensive exercise designed to learn and practice the integration of several modern technologies, including:

- **Frontend**: Built with [Next.js](https://nextjs.org/), a popular React framework for building fast and scalable web applications.
- **GraphQL API**: Implemented with [Yoga](https://www.graphql-yoga.com/) and [Pothos](https://pothos-graphql.dev/), providing a type-safe and powerful API layer.
- **Backend**: Created using [Python](https://www.python.org/) and [Streamlit](https://streamlit.io/), enabling rapid development of custom data applications.
- **Database**: Powered by [Postgres](https://www.postgresql.org/) with the [PostGIS](https://postgis.net/) extension, enabling geospatial data handling and querying.
- **Static File Server**: Managed using the `httpd` command of `busybox`, a lightweight and efficient web server: [Busybox HTTPD](https://openwrt.org/docs/guide-user/services/webserver/http.httpd).

This is a closed project meant for personal learning, and no contributions will be accepted.

## Project Structure

The project is organized into the following subprojects:

- **/frontend**: Contains the Next.js application.
- **/api**: Contains the GraphQL API built with Yoga and Pothos.
- **/backend**: Contains the Python and Streamlit application.
- **/assets**: Contains files to be used as assets.

Each subproject has its own `README.md` with specific instructions for that component.


## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (for frontend development)
- [Python 3.x](https://www.python.org/downloads/) (for backend development)

### Clone the Repository

```bash
https://github.com/danielfilipealmeida/dating.git
cd dating
```

### Starting the Services
Some services like the Database and the Static File Server are managed via Docker. Use the provided docker-compose.yml file to start the services.

```bash
docker-compose up --build
```

This command will:

- Start the Postgres database with PostGIS
- Start the Python/Streamlit backend
- Start the static file server


### Stopping the Services

```bash
docker-compose down
```


## API Setup Instructions

The GraphQL API is located in the /api directory and is a Node.js project. Below are the steps to set it up:

1. **Navigate to the API Directory:**

```bash
cd api
```


2. **Install Dependencies:**

Install the necessary Node.js packages using npm:

```bash
npm install
```


3. **Set the environment variables:**

```bash
cp env.example .env.local
# Make needed changes to .env.local
```


4. **Build the Prisma Module:**

After installing the dependencies, build the Prisma module:

```bash
npm run build
```


5. **Load Seed Data:**

Once the Prisma module is built, load the seed data into the database:

```bash
npx prisma db seed
```


6. **Start the API Server:**

Finally, start the GraphQL API server:

```bash
npm start
```


The GraphQL API will be accessible at http://localhost:4000.


## Frontend Setup Instructions

The frontend is located in the `/frontend` directory and is built with Next.js. Below are the steps to set it up:

1. **Navigate to the Frontend Directory:**

```bash
cd frontend
```


2. **Install Dependencies:**

Install the necessary Node.js packages using npm:

```bash
npm install
```


3. **Set the environment variables:**

```bash
cp env.example .env.local
# Make needed changes to .env.local
```

4. **Start the Frontend Server:**

After installing the dependencies, start the development server:

```bash
npm run dev
```

The frontend application will be accessible at http://localhost:3000.



Here's a simplified version of the backend setup instructions:


## Backend Setup Instructions

1. **Set Up the Virtual Environment:**

```bash
python -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
```

2. **Install Dependencies:**

```bash
pip install -r requirements.txt
```

3. **Configure the Database Connection:**

Create a `.streamlit/secrets.toml` file with the following content:

```toml
[connections.postgresql]
dialect = "postgresql"
host = "localhost"
port = "5432"
database = "postgres"
username = "user"
password = "pass"
```

Ensure these settings match the `PostgreSQL/PostGIS` configuration in the `docker-compose.yml` file.

4. **Run the Backend:**

```bash
streamlit run Backend.py
```

The backend will now be up and running.




## Usage

### Frontend

Access the frontend application at http://localhost:3000.


### GraphQL API

The GraphQL API is accessible at http://localhost:4000. You can explore the schema using available `Yoga GraphiQL`and other tools like GraphQL Playground.

### Backend

The backend Streamlit application can be accessed at http://localhost:8501.

### Database

The Postgres database is available at localhost:5432. Use a tool like `adminer` (available as a docker container, running at port 8080) or the command line to connect and explore the database.


## Example Queries

### GraphQL Query Example

Here's an example GraphQL query to fetch users within a specific radius (in kilometers) of a user, specified by its id:

```graphql
query {
  people(id: 1, radius: 250) {
    bio
    email
    id
    name
  }
}
```

### Postgres Query Example

If you want to query users within a specific radius directly from Postgres:

```sql
SELECT id, name, ST_AsText(location)
FROM users
WHERE ST_DWithin(location, ST_MakePoint(-74.0060, 40.7128)::geography, 10000);
```

If you want to query all users in a radius of a given user:

```sql
WITH user_geom AS (
    SELECT coords
    FROM "User"
    WHERE id = <id>
)

SELECT u2.*
FROM user_geom, "User" AS u2
WHERE ST_DWithin(user_geom.coords, u2.coords, <radius in kms>) and id != <id>;
```

## Contribution Guidelines
This project is a learning exercise, and contributions are not accepted. Please use this project to explore and practice these technologies independently.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
