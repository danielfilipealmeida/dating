# Dating Backend

## Setup

Start by setting up the virtual environment and installing the packages

```bash
python -m venv env
pip install -r requirements.txt
```

Then, setup the database connection by creating the file `.streamlit/secrets.toml`:

```toml
[connections.postgresql]
dialect = "postgresql"
host = "localhost"
port = "5432"
database = "postgres"
username = "user"
password = "pass"
```

Notice that the configuration is the same specified for the `PostgreSQL/PostGIS` in the `docker-compose.yml` file and used in the `api`.

## Running

```bash
streamlit run Backend.py
```