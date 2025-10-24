# LogiFlow Frontend

Modern, minimal logistics & freight forwarding workspace frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Complete login system with JWT tokens
- **Admin Dashboard**: Modern dashboard with metrics, activity timeline, and role widgets
- **Master Data Management**: CRUD operations for:
  - Parties (Consignees, Shippers, Carriers, Vendors)
  - Countries
  - Cities
  - Ports/Airports
  - Carriers
  - Commodities
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query for API management
- **Form Validation**: Zod schema validation with React Hook Form
- **Animations**: Smooth animations with Framer Motion
- **Icons**: Beautiful icons from Iconify

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Iconify
- **API Client**: Axios

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Generate API client (backend must be running):
```powershell
$env:NEXT_PUBLIC_OPENAPI_URL="http://localhost:3000/api/docs-json"; npm run generate-api
```
```bash
# macOS/Linux
NEXT_PUBLIC_OPENAPI_URL=http://localhost:3000/api/docs-json npm run generate-api:nix
```

3. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Credentials

- **Admin**: admin@logistic.com / admin123
- **Manager**: manager@logistic.com / manager123
- **User**: user@logistic.com / user123

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── dashboard/        # Dashboard components
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and validations
├── store/               # Redux store and API slices
└── types/               # TypeScript type definitions
```

## 🔌 API Integration

The frontend integrates with the LogiFlow backend API using RTK Query. The API endpoints include:

- **Authentication**: `/api/v1/auth/*`
- **Master Data**: `/api/v1/master/*`
- **Users**: `/api/v1/users/*`

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Primary blue theme with secondary grays
- **Typography**: Inter font family
- **Components**: Reusable button, input, and card components
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
