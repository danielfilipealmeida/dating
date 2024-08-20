# Dating Site Frontend

This is the frontend of the dating site project, built using **Next.js**. The frontend includes various pages and components for user interaction, allowing users to sign up, log in, edit profiles, view other profiles, vote on potential matches, and see their matches.

## Features

- **Login Page**: Allows existing users to log in to their accounts.
- **Signup Page**: Enables new users to create an account.
- **User Edit Page**: Users can update their profile information and preferences.
- **Profile Pages**: Users can view profiles of other users.
- **Vote Page**: Users can vote on profiles to express interest.
- **Match Pages**: Displays profiles that have matched based on mutual interest.

## Communication with the API

The frontend communicates with the backend GraphQL API to:

- **Request Data**: Fetches user profiles, match information, and other necessary data.
- **Make Changes**: Handles user actions like updating profiles, voting, and managing matches.

## Getting Started

### Prerequisites

- **Node.js** and **npm** (or **yarn**) installed.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### Building for Production

To build the project for production:

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `.next` directory.

### Environment Variables

Create a `.env.local` file in the root of the project to define your environment variables:

```plaintext
NEXT_PUBLIC_API_HOST=<Your GraphQL API URL>
NEXT_PUBLIC_API_PORT=<Your GraphQL port>
```

These variable are used to configure the API endpoint that the frontend will communicate with.
Check `env.example` file.

## License

This project is licensed under the MIT License.
