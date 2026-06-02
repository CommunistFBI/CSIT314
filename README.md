 Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) (v16 or later) and npm
- [PostgreSQL](https://www.postgresql.org/download/) (v13 or later recommended)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)
- A PostgreSQL client such as [pgAdmin](https://www.pgadmin.org/) or the `psql` CLI

Setup Instructions

1. Get the Project Files

Clone the repository or download and extract the ZIP, then open the `CSIT314-main` folder in your editor:


git clone <repository-url>
cd CSIT314-main


2. Create the Database and Run the Schema


1. Open your PostgreSQL client .
2. Create a new database (the default name expected by the config is `talent_db`):


   - CREATE DATABASE talent_db;


3. Run `Schema.SQL` against the new database to create the required tables. From the project folder using `psql`:


   - psql -U postgres -d talent_db -f Schema.SQL

   Or open `Schema.SQL` in pgAdmin and execute it against the `talent_db` database.

3. Configure Environment Variables

Open the `.env` file in the project root and update the connection string with your PostgreSQL credentials:


PORT=5000

PostgreSQL connection string
Format: postgresql://user:password@host:5432/database_name
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/talent_db


Replace `postgres` with your PostgreSQL username and `yourpassword` with your actual password. If you used a different database name in the previous step, update that too.

4. Install Dependencies

From inside the `CSIT314-main` folder, install the project dependencies:


- npm install


5. Seed the Database(optional- mainly for testing purposes)

Populate the database with sample data so you can test the application without manually entering records:

- node src/seed.js

6. Start the Server

- npm start

You should see:

Connected to PostgreSQL database.
Server running on http://localhost:5000


Open (http://localhost:5000) in your browser to access the application.

CSIT314 Group - Mogged
