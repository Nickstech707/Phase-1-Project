# RemoHive

RemoHive is a web application designed to connect talented professionals with the best remote job opportunities worldwide. This project provides a platform for job seekers to find remote jobs, learn about companies, and access resources for remote work success.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Job Listings**: Browse and search for remote job opportunities.
- **Company Profiles**: Learn about companies hiring for remote positions.
- **Resources**: Access guides and tips for remote work success.
- **User Accounts**: Create an account to save job listings and receive notifications.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: 
  - React
  - React Router
  - Tailwind CSS
  - Framer Motion
  - Lucide React (Icons)

- **Backend**: 
  - Express.js
  - Supabase (for database and authentication)

- **Development Tools**: 
  - Axios (for API requests)
  - dotenv (for environment variables)
  - Jest (for testing)

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/remohive.git
   cd remohive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=your_smtp_port
   EMAIL_USER=your_smtp_username
   EMAIL_PASSWORD=your_smtp_password
   EMAIL_FROM=your_sender_email
   NEXT_PUBLIC_SITE_URL=your_site_url
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## Usage

Once the application is running, you can access it at `http://localhost:3000`. 

- **Home Page**: View featured job listings and resources.
- **Find Jobs**: Search for remote jobs by category or keyword.
- **Companies**: Explore profiles of companies hiring for remote positions.
- **Blog**: Read articles and tips related to remote work.

## Folder Structure

- **client/**: Frontend code
  - **public/**: Static files
  - **src/**: React components and pages
  - **context/**: Context API for state management
  - **hooks/**: Custom hooks
  - **utils/**: Utility functions
  - **index.js**: Entry point for React
  - **index.css**: Global styles
- **server/**: Backend code
  - **routes/**: API routes
  - **controllers/**: Route controllers
  - **models/**: Database models
  - **server.js**: Entry point for Express
- **.env**: Environment variables

## API Integration

The application integrates with the Remotive API to fetch remote job listings. Ensure you have the correct API keys and endpoints set in your `.env` file.

## Contributing

Contributions are welcome! If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please reach out to:

- **Your Name** - [nickstech707@gmail.com](mailto:nickstech707@gmail.com)
- **GitHub**: [Nickstech707](https://github.com/Nickstech707)

---

Thank you for checking out RemoHive! We hope you find it useful in your search for remote job opportunities.
