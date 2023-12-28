# Fortuna

The application aims to provide users with a robust and user-friendly financial management tool, enabling efficient tracking, analysis, and visualization of expenses. It seeks to empower users to make informed financial decisions by offering comprehensive insights into their spending habits and financial health.

## Supported Node.js and npm Versions

This project is developed and tested with the following versions:

- Node.js: v16.0.0 or higher
- npm: v8.0.0 or higher

## Prerequisites and dependencies
- MongoDB on localhost:27017
- Fortuna web application module (https://github.com/ioak-io/fortuna)

## Installation

1. Clone the repository: `git clone https://github.com/ioak-io/fortuna-service.git`
2. Navigate to the project directory: `cd fortuna-service`
3. Install dependencies: `npm install`

## Usage

1. On one terminal, run the webpack build to watch for any code changes and build when there is a code change: `npm run build:local`
2. On another terminal, start the API server in watch mode: `npm run start:local`
3. If you are not making any changes to the service code, you can simply run below commands to get started on a single terminal
    - `npm run build`
    - `npm run start`