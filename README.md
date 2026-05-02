# Roshanlal & Sons - Sweets E-Commerce Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-black?style=flat&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, full-stack e-commerce platform built with Next.js for Roshanlal & Sons - a premium sweets and confectionery business.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Database Management](#database-management)
- [API Routes](#api-routes)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 📖 Overview

Roshanlal & Sons is a comprehensive e-commerce platform designed for a premium sweets and confectionery business. The platform features a complete customer-facing storefront, robust admin dashboard, integrated payment processing, order management system, and real-time notifications.

**Key Business Features:**
- Multi-category product catalog with pricing and GST management
- Shopping cart with real-time updates
- Secure checkout with Razorpay payment integration
- Customer authentication and order tracking
- Admin dashboard for inventory and order management
- Email notifications for customers and admins
- Responsive design for mobile and desktop

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.1 (React 19)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Lucide React Icons
- **Form Management**: React Hook Form + Zod Validation
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **ORM**: Prisma 5.22
- **Database**: PostgreSQL
- **Authentication**: JWT with Jose
- **Payment Gateway**: Razorpay
- **Email**: Nodemailer

### Development Tools
- **Bundler**: Next.js built-in (Webpack)
- **Linting**: ESLint + TypeScript ESLint
- **CSS Processing**: Tailwind CSS + PostCSS + Autoprefixer
- **Package Manager**: npm

---

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog**: Browse products by category
- 🛒 **Shopping Cart**: Add/remove items with quantity management
- 🔐 **User Authentication**: Phone-based login system
- 💳 **Secure Checkout**: Integrated Razorpay payment gateway
- 📱 **Order Tracking**: Real-time order status tracking
- 📧 **Email Notifications**: Order confirmations and updates
- ⭐ **Product Ratings**: Customer reviews and ratings
- 📍 **Delivery Addresses**: Multiple address support
- 💰 **Tax Calculation**: Automatic GST/CGST/SGST calculation

### Admin Features
- 🏪 **Dashboard**: Real-time analytics and statistics
- 📦 **Product Management**: Create, edit, delete products with combos
- 🏷️ **Category Management**: Organize products by categories
- 💵 **Pricing Management**: Dynamic pricing with tax configuration
- 📊 **Order Management**: View, filter, and update order status
- ⏰ **Order Timing**: Track preparation and delivery times
- 🔐 **Admin Authentication**: Secure admin login panel
- 📈 **All-Time Statistics**: Performance metrics and insights

### System Features
- 🔄 **Real-time Cart Sync**: Persistent cart across sessions
- 🎨 **Responsive Design**: Mobile-first approach
- ⚡ **Performance**: Image optimization and caching
- 🔒 **Security**: Secure authentication and payment processing
- 📝 **Type Safety**: Full TypeScript coverage
- ✅ **Form Validation**: Client and server-side validation

---

## 📁 Project Structure

```
roshanlal/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin routes (authenticated)
│   │   └── admin/
│   │       ├── page.tsx         # Dashboard
│   │       ├── categories/      # Category management
│   │       ├── products/        # Product management
│   │       ├── orders/          # Order management
│   │       ├── pricing/         # Pricing configuration
│   │       ├── timing/          # Order timing config
│   │       └── login/           # Admin authentication
│   │
│   ├── (storefront)/            # Customer-facing routes
│   │   ├── items/              # Product listing
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout process
│   │   ├── orders/             # Order history & tracking
│   │   ├── success/            # Payment success page
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── auth/               # Customer authentication
│   │
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin endpoints
│   │   ├── auth/               # Authentication endpoints
│   │   ├── checkout/           # Checkout/Payment endpoints
│   │   ├── orders/             # Order endpoints
│   │   ├── products/           # Product endpoints
│   │   ├── config/             # Configuration endpoints
│   │   └── health/             # Health check endpoints
│   │
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/                  # Reusable React components
│   ├── ui/                     # UI components (Button, Input, etc.)
│   ├── checkout/               # Checkout components
│   ├── Navbar.tsx              # Navigation bar
│   ├── Footer.tsx              # Footer
│   ├── CartDrawer.tsx           # Cart sidebar
│   ├── ProductCard.tsx          # Product display card
│   ├── CategoryCarousel.tsx     # Category slider
│   └── ...                     # Other components
│
├── context/                     # React Context
│   └── CartContext.tsx         # Global cart state management
│
├── lib/                         # Utility functions & libraries
│   ├── prisma.ts               # Prisma client instance
│   ├── auth.ts                 # Customer authentication utilities
│   ├── admin-auth.ts           # Admin authentication utilities
│   ├── razorpay.ts             # Razorpay integration
│   ├── mail.ts                 # Email service
│   ├── notifications.ts        # Notification system
│   ├── delivery.ts             # Delivery calculations
│   ├── products.ts             # Product utilities
│   ├── cache-tags.ts           # Next.js cache tags
│   ├── paymentEnv.ts           # Payment configuration
│   ├── orderTiming.ts          # Order timing logic
│   ├── utils.ts                # General utilities
│   └── validations/            # Zod schemas
│       ├── checkout.ts
│       ├── order-tracking.ts
│       └── payment.ts
│
├── prisma/                      # Database
│   ├── schema.prisma           # Prisma data model
│   ├── seed.ts                 # Database seeding script
│   └── migrations/             # Database migrations
│
├── public/                      # Static assets
│   └── images/
│       ├── products/           # Product images
│       └── heritage/           # Brand images
│
├── types/                       # TypeScript type definitions
│   └── index.ts
│
├── config/                      # Configuration files
├── docs/                        # Documentation
│   └── database-pooling.md     # Database connection pooling guide
│
├── scripts/                     # Utility scripts
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router - contains all routes and pages |
| `components/` | Reusable React components for UI |
| `lib/` | Business logic, utilities, and integrations |
| `prisma/` | Database schema, migrations, and seeding |
| `context/` | React Context for global state (Cart) |
| `public/` | Static files served directly |
| `types/` | Shared TypeScript type definitions |
| `docs/` | Technical documentation |

---

## 🎯 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v18.17 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Git**: v2.30 or higher ([Download](https://git-scm.com/))
- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))

### Verify Installation
```bash
node --version    # Should show v18.17.0 or higher
npm --version     # Should show v9.0.0 or higher
git --version     # Should show git version 2.30.0 or higher
psql --version    # Should show PostgreSQL 12 or higher
```

---

## 📦 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/parvgarg05/Roshanlal-Sweets.git
cd Roshanlal-Sweets
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all project dependencies and generate the Prisma client automatically.

### Step 3: Create Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local  # If available
# OR manually create .env.local with the variables below
```

---

## 🔐 Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# ─────────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/roshanlal_sweets"

# ─────────────────────────────────────────────────────────────
# AUTHENTICATION (Customer & Admin)
# ─────────────────────────────────────────────────────────────
# Generate a secure key: openssl rand -base64 32
AUTH_SECRET="your-secure-random-key-here"
ADMIN_PASSWORD="your-admin-password"

# ─────────────────────────────────────────────────────────────
# PAYMENT GATEWAY (Razorpay)
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret-key"

# ─────────────────────────────────────────────────────────────
# EMAIL SERVICE (Nodemailer)
# ─────────────────────────────────────────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM_EMAIL="noreply@roshanlal.com"
SMTP_FROM_NAME="Roshanlal & Sons"

# ─────────────────────────────────────────────────────────────
# BUSINESS CONFIGURATION
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_DELIVERY_CHARGE=100          # in rupees
NEXT_PUBLIC_DELIVERY_FREE_ABOVE=500      # free delivery above this amount (in rupees)
NEXT_PUBLIC_MIN_ORDER_VALUE=100          # minimum order value in rupees

# ─────────────────────────────────────────────────────────────
# APPLICATION
# ─────────────────────────────────────────────────────────────
NODE_ENV="development"  # or "production"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `AUTH_SECRET` | Secret key for JWT authentication | Generate using `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Admin panel password | Must be strong and secure |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (exposed to frontend) | `rzp_live_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (server-only) | Keep this secret |
| `SMTP_*` | Email configuration | Gmail SMTP settings |
| `NEXT_PUBLIC_*` | Public variables (exposed to frontend) | Use `NEXT_PUBLIC_` prefix |

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

**Features in dev mode:**
- Hot module reloading
- Source maps for debugging
- Detailed error messages
- Next.js dev server

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Other Commands

```bash
# Lint code for errors and style issues
npm run lint

# Apply code formatting fixes (if ESLint is configured)
npm run lint -- --fix
```

---

## 🗄️ Database Management

### Initialize the Database

```bash
# Create database and apply migrations
npx prisma migrate deploy

# Or create and apply migrations in one step (development)
npx prisma db push
```

### Generate Prisma Client

```bash
# Generate Prisma client after schema changes
npx prisma generate
```

This is done automatically on `npm install` via the postinstall hook.

### Seed the Database

```bash
# Seed database with initial data
npm run prisma:seed
# OR
npx prisma db seed
```

Seeding script located at: [prisma/seed.ts](prisma/seed.ts)

### View Database in Prisma Studio

```bash
# Open Prisma Studio GUI
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) to browse and modify your database.

### Reset Database (Development Only)

```bash
# ⚠️ WARNING: This will delete all data
npx prisma migrate reset
```

### Create a New Migration

```bash
# After modifying schema.prisma, create a migration
npx prisma migrate dev --name migration_name
```

---

## 🗄️ Database Schema Overview

### Core Models

**Customer**
- Stores customer information (name, phone, email)
- One-to-many relationship with Orders and ProductRatings
- Unique constraint on email + phone combination

**Order**
- Represents a customer order
- Stores financial information in paise (for Razorpay compatibility)
- Tracks order status (PENDING, PAID, PROCESSING, DELIVERED, etc.)
- References Customer and contains OrderItems

**OrderItem**
- Line items in an order
- References both Order and Product
- Stores tax breakdown (GST, CGST, SGST)

**Product**
- Product catalog
- References Category
- Stores pricing and availability
- Supports combo bundles

**Category**
- Product categories (Sweets, Dry Fruits, etc.)
- Stores GST rates per category

**ProductRating**
- Customer reviews and ratings for products

---

## 🔌 API Routes

### Authentication APIs
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/customer/verify-otp` - OTP verification
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Product APIs
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product details
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/[id]` - Update product (admin)
- `DELETE /api/admin/products/[id]` - Delete product (admin)

### Order APIs
- `POST /api/checkout/create-order` - Create order
- `POST /api/checkout/verify` - Verify payment
- `GET /api/orders/track` - Track order
- `POST /api/admin/orders` - Get orders (admin)

### Category APIs
- `GET /api/admin/categories` - Get all categories (admin)
- `POST /api/admin/categories` - Create category (admin)

### Configuration APIs
- `GET /api/config/delivery` - Get delivery configuration

### Health Check
- `GET /api/health/payment` - Payment gateway health check

---

## 💻 Development Workflow

### Project Structure Best Practices

1. **Components**: Keep components small, single-responsibility
2. **Utilities**: Place reusable logic in `lib/` folder
3. **Types**: Define all TypeScript types in `types/index.ts`
4. **Validations**: Use Zod schemas in `lib/validations/`
5. **API Routes**: Keep API logic in `app/api/` directory

### Creating a New Feature

1. **Create the component**: `components/MyFeature.tsx`
2. **Add types**: Update `types/index.ts`
3. **Add validation**: Create in `lib/validations/`
4. **Create API route**: `app/api/my-feature/route.ts`
5. **Add page/route**: `app/(section)/my-feature/page.tsx`

### Code Style Guidelines

- Use TypeScript for all files (`.tsx`, `.ts`)
- Use functional components with hooks
- Prefer arrow functions
- Use destructuring for props
- Add proper type annotations
- Follow ESLint rules

### Running Tests

```bash
# ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 🌐 Deployment

### Prerequisites for Deployment
- PostgreSQL database hosted (Supabase, AWS RDS, etc.)
- Razorpay account with live credentials
- Email service configured (Gmail, SendGrid, etc.)
- Hosting platform (Vercel, Netlify, AWS, etc.)

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts and set environment variables in Vercel dashboard.

### Environment Variables on Production

Add all `.env.local` variables in your hosting platform's environment configuration:
- Vercel: Project Settings → Environment Variables
- AWS: Systems Manager Parameter Store / Secrets Manager
- Heroku: Config Vars in app settings

### Database Migration on Production

```bash
# Before deploying, ensure migrations are applied
npx prisma migrate deploy
```

### Performance Optimization

- Enable image optimization (already configured in `next.config.ts`)
- Use Vercel's CDN for static assets
- Enable database connection pooling (see [docs/database-pooling.md](docs/database-pooling.md))

---

## 📄 Additional Documentation

- [Database Pooling Guide](docs/database-pooling.md) - Connection pooling for production
- [Architecture](docs/architecture.md) - System design and data flow
- [API Documentation](docs/api.md) - Detailed API reference

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards
- Follow the existing code style
- Ensure all tests pass
- Update documentation as needed
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/parvgarg05/Roshanlal-Sweets/issues)
- Email: [support@roshanlal.com](mailto:support@roshanlal.com)

---

## 🙏 Acknowledgments

- **Next.js** - React framework for production
- **Prisma** - Modern database ORM
- **Tailwind CSS** - Utility-first CSS framework
- **Razorpay** - Payment gateway
- **React Hook Form** - Performant form management
- **Lucide React** - Beautiful icon set

---

<div align="center">

**Made with ❤️ by Roshanlal & Sons**

© 2025 All rights reserved.

</div>
