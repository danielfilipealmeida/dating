 # Conventions

 ## Table of Contents

 - [Git](#git)
 - [Code Style](#code-style)
 - [Commit Messages](#commit-messages)
 - [Testing](#testing)
 - [Documentation](#documentation)

 ## Git

 - Branch names should be descriptive and follow the conventional commits specification, as described here: https://www.conventionalcommits.org/en/v1.0.0/ 
   - `feat: new feature doing something`
   - `fix: resolved bug`
 - Avoid committing directly to the `main` branch.
 - Use pull requests for code review.
 - Keep pull requests small and focused.

 ## Code Style

 - Follow the established code style for the project.
 - Use a linter and code formatter to ensure consistent code style.
 - Write clean, readable, and maintainable code.
 - Avoid unnecessary complexity.
 - Comment your code where necessary to explain complex logic.

 ## Commit Messages

 - Use clear and concise commit messages.
 - Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
 - Example: `feat(user): add user authentication`
 - The commit message should include a type, a scope, and a description.
 - Use the imperative mood in the description.

 ## Testing

 - Write unit tests for all new code.
 - Write integration tests for complex features.
 - Ensure that all tests pass before submitting a pull request.
 - Use a testing framework to automate testing.
 - Aim for high test coverage.

 ## Documentation

 - Document all public APIs.
 - Write clear and concise documentation.
 - Keep documentation up-to-date.
 - Use a documentation generator to automate documentation.
 - Include examples in the documentation.