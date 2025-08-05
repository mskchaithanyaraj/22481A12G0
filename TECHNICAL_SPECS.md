# Technical Specifications

## 📋 Project Information

- **Project Name:** URL Shortener Application
- **Version:** 1.0.0
- **Created:** August 5, 2025
- **Technology Stack:** React + TypeScript + Material-UI
- **Build Tool:** Vite

## 🏗️ Directory Structure

```
afformed assignment/
├── frontend/                    # React Frontend Application
│   ├── public/
│   │   ├── vite.svg            # Vite favicon
│   │   └── index.html          # Main HTML template
│   ├── src/
│   │   ├── components/         # Reusable React Components
│   │   │   ├── UrlCard.tsx     # URL display and management
│   │   │   ├── StatsCard.tsx   # Analytics display
│   │   │   └── RecentActivity.tsx # Activity feed
│   │   ├── utils/              # Utility functions
│   │   │   └── logger.ts       # Logging middleware
│   │   ├── App.tsx             # Main application component
│   │   ├── main.tsx            # React entry point
│   │   ├── App.css             # Application styles
│   │   ├── index.css           # Global styles
│   │   └── vite-env.d.ts       # Vite type definitions
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tsconfig.app.json       # App-specific TS config
│   ├── tsconfig.node.json      # Node-specific TS config
│   ├── vite.config.ts          # Vite configuration
│   ├── eslint.config.js        # ESLint configuration
│   └── README.md               # Frontend documentation
├── logger-middleware/           # Logging Service
│   ├── src/
│   │   └── logger.ts           # Core logging implementation
│   └── package.json            # Logger package configuration
├── SYSTEM_DESIGN.md            # System architecture documentation
├── ARCHITECTURE_DIAGRAMS.md    # Visual architecture diagrams
└── TECHNICAL_SPECS.md          # This file
```

## 🔧 Component Specifications

### App Component (App.tsx)

**File Size:** ~15KB  
**Lines of Code:** ~486  
**Dependencies:** Material-UI, React Hooks, Logger

**State Management:**

- Local state using React hooks
- No external state management library
- State persistence through browser session

**Key Features:**

- URL shortening simulation
- Dark/Light theme switching
- Responsive design
- Real-time activity tracking
- Comprehensive logging integration

### UrlCard Component

**Purpose:** Individual URL management interface  
**Features:**

- Expandable content display
- Copy-to-clipboard functionality
- Edit/Delete actions
- Hover animations
- Click analytics display

### StatsCard Component

**Purpose:** Metrics and analytics display  
**Features:**

- Icon-based visualization
- Progress bar indicators
- Color-coded categories
- Responsive grid layout

### RecentActivity Component

**Purpose:** Activity timeline and feed  
**Features:**

- Real-time updates
- Timestamp formatting
- Activity categorization
- Scrollable interface

## 🔌 API Specifications

### Logging API Integration

**Base URL:** `http://20.244.56.144/evaluation-service`

**Endpoint:** `POST /logs`

**Authentication:** JWT Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Schema:**

```json
{
  "type": "object",
  "properties": {
    "stack": {
      "type": "string",
      "enum": ["frontend", "backend"]
    },
    "level": {
      "type": "string",
      "enum": ["debug", "info", "warn", "error", "fatal"]
    },
    "package": {
      "type": "string",
      "enum": [
        "component",
        "api",
        "hook",
        "page",
        "state",
        "style",
        "auth",
        "config",
        "middleware",
        "utils"
      ]
    },
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    }
  },
  "required": ["stack", "level", "package", "message"]
}
```

**Response Schema:**

```json
{
  "type": "object",
  "properties": {
    "logID": {
      "type": "string",
      "format": "uuid"
    },
    "message": {
      "type": "string"
    }
  }
}
```

## 📦 Dependencies Analysis

### Production Dependencies

| Package             | Version  | Size  | Purpose           |
| ------------------- | -------- | ----- | ----------------- |
| react               | ^19.1.0  | 2.3MB | Core framework    |
| react-dom           | ^19.1.0  | 1.8MB | DOM rendering     |
| @mui/material       | ^7.3.0   | 8.2MB | UI components     |
| @mui/icons-material | ^7.3.0   | 4.1MB | Icon library      |
| @emotion/react      | ^11.14.0 | 1.2MB | CSS-in-JS         |
| @emotion/styled     | ^11.14.1 | 0.8MB | Styled components |

**Total Bundle Size:** ~18.4MB (Development)  
**Production Bundle Size:** ~2.8MB (Compressed)

### Development Dependencies

| Package          | Version | Purpose         |
| ---------------- | ------- | --------------- |
| typescript       | ~5.8.3  | Type checking   |
| vite             | ^7.0.4  | Build tool      |
| eslint           | ^9.30.1 | Code linting    |
| @types/react     | ^19.1.8 | React types     |
| @types/react-dom | ^19.1.6 | React DOM types |

## 🎨 UI/UX Specifications

### Design System

**Color Palette:**

```css
Primary: #6366f1 (Indigo)
Secondary: #ec4899 (Pink)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

**Typography:**

```css
Font Family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif
Heading 1: 3.2rem, 700 weight
Heading 3: 2rem, 700 weight
Body 1: 1rem, 400 weight
Body 2: 0.875rem, 400 weight
```

**Spacing System:**

```css
Base Unit: 8px
Small: 8px (1 unit)
Medium: 16px (2 units)
Large: 24px (3 units)
XLarge: 32px (4 units)
```

**Breakpoints:**

```css
xs: 0px
sm: 600px
md: 900px
lg: 1200px
xl: 1536px
```

### Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Adaptive Layout:** Flexible grid system
- **Touch Friendly:** 44px minimum touch targets
- **Accessible:** WCAG 2.1 AA compliance

## 🔒 Security Specifications

### Input Validation

- URL format validation using JavaScript URL constructor
- XSS prevention through React's built-in sanitization
- Input length limits (max 2048 characters for URLs)
- Rate limiting on user actions

### Authentication

- JWT token authentication for logging API
- Token expiration handling
- Secure token storage considerations

### Data Protection

- No sensitive data in logs
- Client-side only data storage
- HTTPS enforced in production
- CSP headers for XSS protection

## ⚡ Performance Specifications

### Load Time Targets

- First Contentful Paint: < 1.5 seconds
- Largest Contentful Paint: < 2.5 seconds
- Time to Interactive: < 3 seconds
- Cumulative Layout Shift: < 0.1

### Bundle Optimization

- Code splitting at route level
- Tree shaking for unused code
- Asset compression (gzip/brotli)
- CDN integration for static assets

### Runtime Performance

- React.memo for expensive components
- useMemo for complex calculations
- Debounced input validation
- Virtual scrolling for large lists

## 🧪 Testing Specifications

### Unit Testing

```javascript
// Example test structure
describe("UrlCard Component", () => {
  test("renders URL information correctly", () => {});
  test("handles copy action", () => {});
  test("triggers delete callback", () => {});
  test("expands/collapses content", () => {});
});
```

### Integration Testing

- API integration tests
- Component interaction tests
- State management tests
- Error boundary tests

### E2E Testing

```javascript
// Example E2E test
test("complete URL shortening flow", async () => {
  // 1. Navigate to app
  // 2. Enter URL
  // 3. Click shorten button
  // 4. Verify shortened URL appears
  // 5. Copy URL to clipboard
  // 6. Verify success message
});
```

## 📊 Monitoring & Analytics

### Metrics Collection

- Page load performance
- User interaction events
- Error rates and types
- API response times
- Bundle size tracking

### Logging Levels

```typescript
// Logging strategy
debug: Development debugging information
info: General application flow
warn: Potentially harmful situations
error: Error events but app continues
fatal: Critical errors causing app failure
```

### Health Checks

- Application availability monitoring
- API endpoint health checks
- Performance degradation alerts
- Error rate thresholds

## 🚀 Build & Deployment

### Build Configuration

```json
{
  "scripts": {
    "dev": "vite", // Development server
    "build": "tsc -b && vite build", // Production build
    "lint": "eslint .", // Code quality
    "preview": "vite preview" // Build preview
  }
}
```

### Environment Variables

```env
# Development
VITE_API_ENDPOINT=http://20.244.56.144/evaluation-service
VITE_LOG_LEVEL=debug
VITE_ENABLE_LOGGING=true

# Production
VITE_API_ENDPOINT=https://api.production.com
VITE_LOG_LEVEL=error
VITE_ENABLE_LOGGING=true
```

### Deployment Targets

- **Static Hosting:** Vercel, Netlify, GitHub Pages
- **Container:** Docker with Nginx
- **CDN:** CloudFront, CloudFlare

## 📋 Browser Compatibility

### Supported Browsers

| Browser       | Minimum Version | Support Level |
| ------------- | --------------- | ------------- |
| Chrome        | 88+             | Full Support  |
| Firefox       | 85+             | Full Support  |
| Safari        | 14+             | Full Support  |
| Edge          | 88+             | Full Support  |
| Mobile Safari | 14+             | Full Support  |
| Chrome Mobile | 88+             | Full Support  |

### Polyfills Required

- None (modern browser APIs only)
- Graceful degradation for older browsers
- Feature detection for advanced APIs

## 🔄 Version Control & CI/CD

### Git Workflow

```
main branch:     Production ready code
develop branch:  Integration branch
feature branches: Individual features
hotfix branches: Critical fixes
```

### CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    - Setup Node.js
    - Install dependencies
    - Run linting
    - Run unit tests
    - Run build
  deploy:
    - Deploy to staging
    - Run E2E tests
    - Deploy to production
```

## 📈 Scalability Considerations

### Code Scalability

- Modular component architecture
- Consistent coding patterns
- TypeScript for type safety
- Automated testing coverage

### Performance Scalability

- Lazy loading strategies
- Caching mechanisms
- Bundle optimization
- CDN integration

### Team Scalability

- Clear documentation
- Consistent code style
- Component library approach
- Automated quality checks

---

**Document Version:** 1.0  
**Last Updated:** August 5, 2025  
**Maintained By:** Development Team
