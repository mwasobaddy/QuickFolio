# QuickFolio - Full-Stack Folio Management System

A modern, full-stack web application for managing folios with a clean React frontend and serverless Node.js backend powered by PostgreSQL and Prisma.

## 🚀 Features

- **📋 Folio Management**: Create, read, update, and delete folios
- **🎨 Modern UI**: Clean, responsive React interface with Tailwind CSS
- **⚡ Serverless Backend**: Vercel-deployed API with TypeScript
- **🗄️ Database**: PostgreSQL with Prisma ORM and connection pooling
- **🔒 Type Safety**: End-to-end TypeScript with Zod validation
- **🎯 Real-time Updates**: Toast notifications for all operations
- **💫 Loading States**: Skeleton loaders for better UX
- **🔄 CORS Enabled**: Properly configured for cross-origin requests

## 🏗️ Architecture

```
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Node.js backend (Vercel serverless)
│   ├── api/         # Serverless functions
│   └── prisma/      # Database schema & migrations
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with hooks
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Toastify** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Vercel** serverless functions
- **Prisma** ORM with Accelerate
- **PostgreSQL** database
- **Zod** for validation

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account
- GitHub account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quickfolio.git
cd quickfolio
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Database Setup

**Configure Prisma:**
```bash
cd server
# Copy environment variables
cp .env.example .env
# Edit .env with your database URL
```

**Run Database Migrations:**
```bash
npx prisma generate
npx prisma db push
```

### 4. Development

**Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Start Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

## 🌐 Deployment

### Backend (Vercel)

1. **Connect Repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
3. **Deploy** - Vercel automatically detects serverless functions

### Frontend (Vercel)

1. **Connect Repository** to Vercel
2. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app
   ```
3. **Deploy** - Static site deployment

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folios` | Get all folios |
| POST | `/api/folios` | Create new folio |
| PUT | `/api/folios?id={id}` | Update folio |
| DELETE | `/api/folios?id={id}` | Delete folio |

### Folio Schema
```typescript
{
  id: string;
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎨 UI Components

- **Sidebar**: Navigation between views
- **FolioTable**: Data table with skeleton loading
- **CreateFolioModal**: Form modal with validation
- **Toast Notifications**: Success/error feedback

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API inputs
- **CORS Configuration**: Proper cross-origin headers
- **Type Safety**: End-to-end TypeScript
- **SQL Injection Protection**: Parameterized queries

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** utility classes
- **Flexible layouts** for all screen sizes
- **Touch-friendly** interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by efficient document management systems
- Thanks to the open-source community

---

**Made with ❤️ using React, Node.js, and PostgreSQL**