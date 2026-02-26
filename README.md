# CORSIT Robotics Workshop Registration

An automated registration platform designed to streamline participant sign-ups and data management for robotics workshops. Built with a focus on user experience, it handles secure intake and keeps workshop logistics organized in one place.

## Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS v4
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## How to Run the Project Locally

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.

### 2. Clone the Repository
```bash
git clone https://github.com/mithun-r13/Registration_Form.git
cd Registration_Form
```

### 3. Install Dependencies
Install all the required Node packages (Express, Mongoose, dotenv, cors, Tailwind):
```bash
npm install
```

### 4. Create Environment Variables
Create a file named `.env` in the root folder of your project and add the following configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/corsit_registrations
ADMIN_USER=admin
ADMIN_PASS=admin123
```
*(If you are using MongoDB Atlas, replace the `MONGODB_URI` line with your cloud connection string).*

### 5. Start the Server
Start the Express backend server using npm:
```bash
npm start
```
*Note: If you need to make code changes and want the server to restart automatically, use `npm run dev`.*

### 6. View the App
Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

### 7. Admin Dashboard Access
To view the registered participants, navigate to:
[http://localhost:3000/admin.html](http://localhost:3000/admin.html)

Log in using the credentials you set in your `.env` file (Default: `admin` / `admin123`).

## Compiling Tailwind CSS (For Development)
If you modify any Tailwind classes in the HTML files, you need to recompile the CSS. A script is provided to do this automatically:
```bash
npm run watch:css
```
