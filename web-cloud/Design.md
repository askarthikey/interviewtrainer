# Design - Web & Cloud

## Tech stack Dev setup

### **Frontend**
- **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and hot module replacement.  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) integrated for utility-first, responsive UI design.  
- **Structure:** Component-based architecture with organized folder structure for scalability.  
- **Tooling:**  
  - ESLint & Prettier for code formatting and linting.  
  - npm scripts for development (`npm run dev`) and production build (`npm run build`).  

### **Backend**
- **Runtime & Framework:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) for building RESTful APIs.  
- **Database:** [MongoDB](https://www.mongodb.com/) connected using the native MongoDB driver (no ODM for lightweight, direct queries).  
- **Configuration:** Environment variables managed via [dotenv](https://www.npmjs.com/package/dotenv).  
- **Middleware:**  
  - `cors` for handling cross-origin requests.  
  - `express.json()` for parsing JSON payloads.  

### **Dev Environment**
- **Version Control:** Git with feature-branch workflow (`origin` branches for setup, features, etc.).  
- **Package Managers:** npm for dependency management (frontend and backend managed separately).  
- **Local Development:**  
  - Frontend served via Vite development server on a local port (default: `5173`).  
  - Backend runs on Express server (port `4000`) with MongoDB connection configured via `.env`.  

---

## DB Dev setup

TODO(Sairoop-15): Fill this section based on your analysis.

## Data flow diagram

TODO(Rishi2795, srivatsav7054, K-Jashwanth): Fill this section based on your analysis.

## Database schema

TODO(Karthik-Kondaveeti): Fill this section based on your analysis.

## List of APIs

TODO(Rishidhar-22): Fill this section based on your analysis.

## Security

TODO(LV2402) : Fill this section based on your analysis.
