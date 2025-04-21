# Full Stack Job Portal with React JS, Tailwind CSS, Supabase, Clerk, Shadcn UI

### Description
```
A full-stack job board platform that allows users to browse, save,
and apply for jobs, while enabling recruiters to post and manage job listings.​
```
### Features
- User authentication and role-based access (Candidates and Recruiters)

- Job listing creation, editing, and deletion for recruiters

- Job browsing, saving, and application functionalities for candidates

- Real-time updates and responsive design

## Technologies Used
### Frontend
- React.js
  
- React Router
  
- Tailwind CSS
  
- Clerk (for authentication)

### Backend
- Supabase (PostgreSQL database, authentication, and RESTful API)

## Getting Started
### Prerequisites
- Node.js (v14 or later)
  
- npm (Vite)
  
- Supabase account
  
- Clerk account

## Database Schema

### The application uses the following tables in Supabase:​

- jobs: Stores job listings.

- saved_jobs: Tracks jobs saved by users.

- applications: Records job applications submitted by candidates.

- companies: Contains company information.​

Ensure that foreign key constraints are properly set up to maintain data integrity.


### Make sure to create a `.env` file with following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Run the application
```
npm install
npm run dev
```
