# Dating Backend

This backend is built using Python and Streamlit, designed to manage user data for a dating application. The backend provides an interface to view all users and allows data updates. Future updates will include functionality for generating seed data.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Database Configuration](#database-configuration)
- [Running the Backend](#running-the-backend)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Setup Instructions

Follow these steps to set up the backend:

### 1. Set Up the Virtual Environment

First, create a virtual environment to isolate dependencies:

```bash
python -m venv env
```

Activate the virtual environment:

- **On macOS/Linux:**

  ```bash
  source env/bin/activate
  ```

- **On Windows:**

  ```bash
  env\Scripts\activate
  ```

### 2. Install Dependencies

With the virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

## Database Configuration

The backend requires a connection to a Postgres database. Configure the database connection by creating a `.streamlit/secrets.toml` file with the following content:

```toml
[connections.postgresql]
dialect = "postgresql"
host = "localhost"
port = "5432"
database = "postgres"
username = "user"
password = "pass"
```

Ensure these settings match the `PostgreSQL/PostGIS` configuration specified in the `docker-compose.yml` file and used in the API.

## Running the Backend

To start the backend, use the following command:

```bash
streamlit run Backend.py
```

This will launch the Streamlit application, which will be accessible in your web browser.

## Usage

Once the backend is running, you can:

- **View All Users:** The application displays all users stored in the database.
- **Update Data:** You can update user data directly through the interface.

## Future Enhancements

In future updates, the backend will include functionality to generate seed data, which will help populate the database with sample users for testing and development purposes.

## Contributing

This project is a closed exercise intended for learning purposes, and external contributions are not accepted.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
```

### Key Points:
- **Setup Instructions**: Clear steps to create a virtual environment and install dependencies.
- **Database Configuration**: Instructions for setting up the Postgres connection using `.streamlit/secrets.toml`.
- **Running the Backend**: Command to start the Streamlit application.
- **Usage**: Overview of current features.
- **Future Enhancements**: Mention of planned features for seed data generation.
- **Contributing & License**: Statements about the closed nature of the project and licensing.

This README provides comprehensive guidance for setting up and running the backend.
