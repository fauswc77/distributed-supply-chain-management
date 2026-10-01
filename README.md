# Distributed Supply Chain Management System

This is a complete, presentation-ready college mini-project demonstrating Advanced Database Management Systems (ADBMS) concepts. 
The domain is a Supply Chain Management system functioning across three geographical regions (North, West, South) in India.

## Project Features
- **Frontend:** React + Vite, styled with modern Glassmorphism aesthetics.
- **Backend:** Spring Boot (Java 17) serving REST APIs.
- **Database:** MySQL with 4 discrete databases acting as distributed nodes (`supply_chain_north`, `supply_chain_west`, `supply_chain_south`, `supply_chain_centralized`).
- **ADBMS Concepts Demonstrated:**
  - Distributed Database Architecture
  - Primary Horizontal Fragmentation (PHF)
  - Derived Horizontal Fragmentation (DHF)
  - Vertical Fragmentation (VF)
  - Distributed Query Processing & Aggregation
  - Data Locality & Centralized vs Distributed Performance Comparison

## Setup Instructions

### 1. Database Setup
1. Ensure MySQL server is running locally on port `3306`.
2. The default credentials configured in the backend are username: `root`, password: `password`.
3. Open your MySQL client (e.g., MySQL Workbench, CLI) and execute the `database/init.sql` script to create schemas, tables, and insert sample data.
   ```bash
   mysql -u root -p < database/init.sql
   ```

### 2. Backend (Spring Boot)
1. Ensure you have Java 17 installed.
2. Navigate to the `backend/` directory.
3. Start the Spring Boot application using Maven:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend (React + Vite)
1. Ensure you have Node.js installed.
2. Navigate to the `frontend/` directory.
3. Start the Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Navigation & Demonstration
- **Dashboard:** An aggregated real-time view of data merged from the regional databases.
- **Data Viewer:** Allows viewing of data records annotated with their physical storage location (Origin Site).
- **Cent. vs Dist.:** Architectural comparison with performance simulation of complex JOIN queries.
- **Fragmentation:** Deep-dive academic demonstration of database fragmentation types with live SQL mapping.
