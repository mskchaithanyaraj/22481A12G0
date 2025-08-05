# URL Shortener System Design Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Frontend Components](#frontend-components)
4. [Logging System](#logging-system)
5. [Technology Stack](#technology-stack)
6. [Data Models](#data-models)
7. [API Integration](#api-integration)
8. [Security](#security)
9. [Performance](#performance)
10. [Deployment](#deployment)

---

## 🎯 System Overview

### Purpose

A modern, responsive URL shortener application that transforms long URLs into short, shareable links with comprehensive analytics and logging capabilities.

### Key Features

- **URL Shortening**: Convert long URLs to short, memorable links
- **Real-time Analytics**: Track clicks, view statistics, and monitor performance
- **Dark/Light Mode**: User-friendly theme switching
- **Responsive Design**: Optimized for mobile and desktop
- **Activity Tracking**: Real-time activity feed
- **Comprehensive Logging**: Full audit trail with external logging service
- **Copy-to-Clipboard**: One-click URL copying
- **URL Management**: View, edit, and delete shortened URLs

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Client App    │────│  Logging API    │────│  Log Storage    │
│   (Frontend)    │    │   (External)    │    │   (External)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         │ HTTP/HTTPS
         │
┌─────────────────┐
│                 │
│   Web Browser   │
│   (User Agent)  │
│                 │
└─────────────────┘
```

### Component Architecture

```
Frontend Application
├── App.tsx (Main Container)
├── Components/
│   ├── UrlCard.tsx (URL Display & Management)
│   ├── StatsCard.tsx (Analytics Display)
│   └── RecentActivity.tsx (Activity Feed)
├── Utils/
│   └── logger.ts (Logging Middleware)
└── Styles/
    ├── App.css
    └── index.css
```

---

## 🧩 Frontend Components

### 1. App Component (`App.tsx`)

**Primary Container & State Management**

**Responsibilities:**

- Global state management for URLs, activities, and UI state
- Theme management (dark/light mode)
- User interaction handling (shorten, copy, delete)
- Integration with logging middleware

**Key State:**

```typescript
interface AppState {
  url: string; // Current input URL
  shortenedUrls: ShortenedUrl[]; // List of shortened URLs
  copiedId: string | null; // Currently copied URL ID
  snackbar: SnackbarState; // Notification state
  isLoading: boolean; // Loading indicator
  darkMode: boolean; // Theme preference
  activities: Activity[]; // Activity feed data
}
```

**Core Functions:**

- `handleShorten()`: URL validation and shortening logic
- `handleCopy()`: Clipboard operations with logging
- `handleDelete()`: URL removal with confirmation
- `addActivity()`: Activity tracking

### 2. UrlCard Component (`UrlCard.tsx`)

**Individual URL Display & Management**

**Features:**

- Expandable URL details
- Copy-to-clipboard functionality
- Edit and delete actions
- Click analytics display
- Hover animations

**Props Interface:**

```typescript
interface UrlCardProps {
  url: ShortenedUrl;
  onCopy: (shortUrl: string, id: string) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
}
```

### 3. StatsCard Component (`StatsCard.tsx`)

**Analytics & Statistics Display**

**Features:**

- Icon-based metric display
- Progress bars for visual representation
- Customizable colors and themes
- Responsive grid layout

**Props Interface:**

```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  progress?: number;
}
```

### 4. RecentActivity Component (`RecentActivity.tsx`)

**Activity Feed & Timeline**

**Features:**

- Real-time activity updates
- Timestamp formatting
- Activity type categorization
- Color-coded activity indicators

**Activity Types:**

- `created`: URL shortening events
- `clicked`: URL access events
- `shared`: Copy-to-clipboard events

---

## 📊 Logging System

### Architecture Overview

```
Frontend App → Logger Middleware → External API → Log Storage
```

### Logger Implementation (`utils/logger.ts`)

**Core Function:**

```typescript
async function Log(
  stack: string, // "frontend" | "backend"
  level: string, // "debug" | "info" | "warn" | "error" | "fatal"
  packageName: string, // Component/module identifier
  message: string // Human-readable description
): Promise<void>;
```

**Helper Methods:**

```typescript
export const logger = {
  debug: (packageName: string, message: string) =>
    Log("frontend", "debug", packageName, message),
  info: (packageName: string, message: string) =>
    Log("frontend", "info", packageName, message),
  warn: (packageName: string, message: string) =>
    Log("frontend", "warn", packageName, message),
  error: (packageName: string, message: string) =>
    Log("frontend", "error", packageName, message),
  fatal: (packageName: string, message: string) =>
    Log("frontend", "fatal", packageName, message),
};
```

### Logging Points

| Event                 | Level | Package   | Example Message                                    |
| --------------------- | ----- | --------- | -------------------------------------------------- |
| App Initialization    | info  | component | "URL Shortener app initialized"                    |
| Invalid URL           | error | component | "Invalid URL format attempted: [url]"              |
| Empty URL Submit      | warn  | component | "URL shortening attempted with empty URL"          |
| Successful Shortening | info  | component | "URL shortened successfully: short.ly/abc123"      |
| Copy Success          | info  | component | "URL copied to clipboard: short.ly/abc123"         |
| Copy Failure          | error | component | "Failed to copy URL to clipboard: short.ly/abc123" |
| URL Deletion          | info  | component | "URL deleted: short.ly/abc123"                     |

### External API Integration

**Endpoint:** `http://20.244.56.144/evaluation-service/logs`

**Authentication:** Bearer Token (JWT)

**Request Format:**

```json
{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "URL shortened successfully: short.ly/abc123"
}
```

**Response Format:**

```json
{
  "logID": "uuid-value",
  "message": "log created successfully"
}
```

---

## 💻 Technology Stack

### Frontend Technologies

| Technology      | Version  | Purpose       |
| --------------- | -------- | ------------- |
| **React**       | ^19.1.0  | UI Framework  |
| **TypeScript**  | ~5.8.3   | Type Safety   |
| **Material-UI** | ^7.3.0   | Design System |
| **Emotion**     | ^11.14.0 | CSS-in-JS     |
| **Vite**        | ^7.0.4   | Build Tool    |

### Development Tools

| Tool                  | Version | Purpose       |
| --------------------- | ------- | ------------- |
| **ESLint**            | ^9.30.1 | Code Linting  |
| **TypeScript ESLint** | ^8.35.1 | TS Linting    |
| **Vite React Plugin** | ^4.6.0  | React Support |

### External Services

| Service                | Purpose          | Integration |
| ---------------------- | ---------------- | ----------- |
| **Evaluation Service** | Log Storage      | REST API    |
| **Navigator API**      | Clipboard Access | Browser API |

---

## 📁 Data Models

### ShortenedUrl Interface

```typescript
interface ShortenedUrl {
  id: string; // Unique identifier
  originalUrl: string; // Original long URL
  shortUrl: string; // Generated short URL
  clicks: number; // Click analytics
  createdAt: Date; // Creation timestamp
}
```

### Activity Interface

```typescript
interface Activity {
  id: string; // Unique identifier
  type: "created" | "clicked" | "shared"; // Activity type
  url: string; // Associated URL
  timestamp: Date; // Event timestamp
}
```

### Log Payload Interface

```typescript
interface LogPayload {
  stack: string; // Application stack identifier
  level: string; // Log severity level
  package: string; // Component/module name
  message: string; // Log message content
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  palette: {
    mode: "light" | "dark";
    primary: ColorPalette;
    secondary: ColorPalette;
    background: BackgroundPalette;
  };
  typography: TypographyConfig;
  shape: ShapeConfig;
}
```

---

## 🔌 API Integration

### Logging API

**Base URL:** `http://20.244.56.144/evaluation-service`

**Endpoints:**

#### POST /logs

**Purpose:** Submit application logs

**Headers:**

```
Content-Type: application/json
Authorization: Bearer [JWT_TOKEN]
```

**Request Body:**

```json
{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "User action performed"
}
```

**Response:**

```json
{
  "logID": "550e8400-e29b-41d4-a716-446655440000",
  "message": "log created successfully"
}
```

**Error Handling:**

- Network failures: Silent fallback, console logging
- Authentication errors: Token refresh or user notification
- Rate limiting: Exponential backoff strategy

---

## 🔒 Security

### Authentication

- **JWT Bearer Token**: Secure API authentication
- **Token Management**: Embedded in logger middleware
- **Expiration Handling**: Graceful degradation on token expiry

### Data Security

- **Input Validation**: URL format validation before processing
- **XSS Prevention**: React's built-in protection via JSX
- **CSRF Protection**: SameSite cookie policies
- **Content Security Policy**: Restricts external resource loading

### Privacy

- **Data Minimization**: Only necessary data logged
- **Log Sanitization**: No sensitive data in log messages
- **User Consent**: Transparent logging practices

---

## ⚡ Performance

### Frontend Optimization

**Bundle Optimization:**

- Code splitting with React.lazy()
- Tree shaking for unused Material-UI components
- Vite's optimized build pipeline

**Runtime Performance:**

- React.memo() for component memoization
- useMemo() for expensive calculations
- debounced input validation

**Network Optimization:**

- Async logging (fire-and-forget)
- Request batching for multiple logs
- Offline log queue with retry mechanism

### Monitoring Metrics

| Metric                   | Target | Measurement             |
| ------------------------ | ------ | ----------------------- |
| First Contentful Paint   | < 1.5s | Core Web Vitals         |
| Largest Contentful Paint | < 2.5s | Core Web Vitals         |
| Cumulative Layout Shift  | < 0.1  | Core Web Vitals         |
| Bundle Size              | < 1MB  | Webpack Bundle Analyzer |

---

## 🚀 Deployment

### Build Process

**Development:**

```bash
npm run dev          # Start development server
npm run lint         # Code quality checks
```

**Production:**

```bash
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build
```

### Environment Configuration

**Development:**

```env
VITE_API_ENDPOINT=http://20.244.56.144/evaluation-service
VITE_LOG_LEVEL=debug
VITE_ENABLE_LOGGING=true
```

**Production:**

```env
VITE_API_ENDPOINT=https://api.production.com
VITE_LOG_LEVEL=error
VITE_ENABLE_LOGGING=true
```

### Hosting Options

**Static Hosting:**

- Vercel (Recommended)
- Netlify
- GitHub Pages

**Server Deployment:**

- Docker containerization
- Nginx reverse proxy
- CDN integration

### Monitoring & Analytics

**Error Tracking:**

- Integration with Sentry
- Custom error boundaries
- Automated error reporting

**Usage Analytics:**

- Google Analytics integration
- Custom event tracking
- Performance monitoring

---

## 📈 Scalability Considerations

### Frontend Scaling

**Component Architecture:**

- Modular component design
- Reusable utility functions
- Configurable theme system

**State Management:**

- Local state for UI components
- Context API for global state
- Future: Redux Toolkit for complex state

**Code Organization:**

- Feature-based folder structure
- Barrel exports for clean imports
- TypeScript for type safety

### Performance Scaling

**Caching Strategy:**

- Browser caching for static assets
- Service worker for offline functionality
- Local storage for user preferences

**Load Management:**

- Virtual scrolling for large URL lists
- Pagination for activity feeds
- Lazy loading for non-critical components

---

## 🧪 Testing Strategy

### Unit Testing

- Jest for testing framework
- React Testing Library for component tests
- Mock external API calls

### Integration Testing

- End-to-end flow testing
- API integration validation
- Cross-browser compatibility

### Performance Testing

- Lighthouse CI integration
- Bundle size monitoring
- Load testing scenarios

---

## 📋 Future Enhancements

### Short-term (Next Release)

- QR code generation for URLs
- Custom URL aliases
- Bulk URL operations
- Export functionality

### Medium-term (6 months)

- User authentication
- URL expiration settings
- Advanced analytics dashboard
- API rate limiting

### Long-term (1 year)

- Multi-tenant architecture
- Real-time collaboration
- Advanced security features
- Mobile application

---

## 📞 Support & Maintenance

### Documentation

- Component API documentation
- Development setup guide
- Deployment instructions
- Troubleshooting guide

### Monitoring

- Application health checks
- Performance monitoring
- Error tracking and alerting
- Usage analytics

### Updates

- Regular dependency updates
- Security patch management
- Feature enhancement cycle
- Bug fix prioritization

---

**Document Version:** 1.0  
**Last Updated:** August 5, 2025  
**Author:** Development Team  
**Review Cycle:** Monthly
