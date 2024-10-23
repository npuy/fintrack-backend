# Project Name

## Prerequisites

- Node.js (https://nodejs.org/)
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository**:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` based on the .env.example

4. **Migrate your database**:

   ```sh
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**:

   ```sh
   npx prisma generate
   ```

6. **Start dev**:
   ```sh
   npm run dev
   ```

## Project Structure

- `src/` - TypeScript source files
