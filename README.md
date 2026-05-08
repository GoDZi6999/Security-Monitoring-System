# 🔒 Security Monitoring SaaS Dashboard

A comprehensive, real-time security monitoring dashboard built with Node.js/Express and React. Perfect for portfolio projects and understanding modern security monitoring practices.

## ✨ Features

### Backend Security Features
- **Real-time Request Monitoring** - Track all API requests with status codes and latency
- **Rate Limiting** - Enforce per-IP rate limits (60 requests/minute by default)
- **Authentication Logging** - Log all login attempts (success/failure)
- **Security Event Tracking** - Automatic detection and logging of suspicious activities
- **Alert System** - Real-time alert generation for critical events
- **Demo Data Generation** - Automatic event generation for testing

### Frontend Dashboard
- **Dark Cybersecurity Aesthetic** - Modern, professional design with neon accents
- **Real-time Updates** - Auto-refresh every 3 seconds
- **Tabbed Navigation** - Overview, Events, Alerts, API Requests, Auth Logs
- **Interactive Alerts** - Acknowledge and dismiss alerts
- **Responsive Design** - Works on desktop and mobile
- **System Health Monitoring** - Uptime, response time, and status metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm start
```

The backend will run on `http://localhost:5000`

**Demo Credentials:**
- Username: `admin` | Password: `admin123`
- Username: `user` | Password: `user123`

### Frontend Setup

```bash
cd client
npm install
npm start
```

The frontend will run on `http://localhost:3000`

Or use it as a React component in your existing project:

```jsx
import SecurityDashboard from './SecurityDashboard';

function App() {
  return <SecurityDashboard />;
}
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### Security Events
- `GET /api/security/events?limit=100` - Get security events
- `GET /api/security/events/summary` - Get 24h event summary

### API Requests
- `GET /api/api-requests?limit=100` - Get API request logs
- `GET /api/api-requests/stats` - Get request statistics

### Authentication Logs
- `GET /api/auth/logs?limit=100` - Get authentication logs

### Alerts
- `GET /api/alerts?limit=100` - Get all alerts
- `PATCH /api/alerts/:id` - Acknowledge an alert
  ```json
  {
    "acknowledged": true
  }
  ```

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard metrics
- `GET /api/health` - Health check

## 🏗️ Project Structure

```
.
├── server/
│   ├── server.js           # Express server with all security features
│   ├── package.json        # Dependencies
│   └── .env                # Environment variables
├── client/
│   ├── SecurityDashboard.jsx  # React component
│   ├── App.jsx             # Main app (if standalone)
│   ├── package.json        # Dependencies
│   └── index.jsx           # Entry point
└── README.md               # This file
```

## 🔧 Configuration

### Rate Limiting
Edit `server.js` to change rate limits:
```javascript
const limit = { requestsPerMinute: 60 };
```

### Data Retention
The server keeps:
- Last 1000 API requests
- Last 1000 security events
- Last 500 alerts
- All authentication logs (memory-based)

### Demo Data Generation
Events are generated every 5 seconds. To adjust:
```javascript
setInterval(generateDemoEvent, 5000); // Change interval in ms
```

## 🎨 Customization

### Styling
The dashboard uses Tailwind CSS. Customize colors in the className strings:
- Primary: `cyan-500` / `cyan-400`
- Danger: `red-500` / `red-400`
- Warning: `amber-500` / `amber-400`
- Success: `green-500` / `green-400`

### Adding New Metrics
1. Add a new endpoint in `server.js`
2. Add a fetch call in the frontend component
3. Display in the appropriate tab

## 📈 Security Features Deep Dive

### Rate Limiting
- Per-IP tracking with per-minute window
- Returns `429 Too Many Requests` when exceeded
- Logs violations as security events
- Automatically creates alerts

### Authentication Logging
- Tracks all login attempts (success and failure)
- Records IP address and user agent
- Failed attempts trigger alerts
- Useful for security audits

### Security Events
- Categorized by type and severity (info, warning, critical)
- Automatically generated for suspicious activities
- Includes IP address and detailed information
- Can be extended with custom detection logic

### Real-time Alerts
- Triggered by security events
- Acknowledgeable by users
- Tracks acknowledgment time
- Sortable by severity

## 🧪 Testing

### Generate Test Traffic
```bash
# Using curl
curl http://localhost:5000/api/health

# Rapid requests to trigger rate limit
for i in {1..100}; do curl http://localhost:5000/api/health; done

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Dashboard
1. Open http://localhost:3000
2. Login with `admin/admin123`
3. Watch events appear in real-time
4. Try the rapid requests curl command to trigger rate limits
5. Check the Events tab for security events

## 🚨 Known Limitations

- **In-Memory Storage** - Data is lost on server restart (can be replaced with MongoDB, PostgreSQL, etc.)
- **No Persistence** - Alerts and events aren't saved to database
- **Mock Authentication** - Uses hardcoded credentials (replace with JWT or OAuth in production)
- **No User Management** - Single admin account only
- **Local Only** - Not deployed (ready for Heroku, Vercel, AWS, etc.)

## 📈 Production Enhancements

To take this to production:

1. **Database** - Replace in-memory storage with MongoDB or PostgreSQL
2. **Authentication** - Implement JWT tokens and refresh tokens
3. **User Management** - Add role-based access control (RBAC)
4. **Deployment** - Deploy backend to Heroku/AWS, frontend to Vercel
5. **Monitoring** - Add Datadog, New Relic, or similar
6. **Logging** - Use Winston or Bunyan for structured logging
7. **Caching** - Add Redis for high-traffic scenarios
8. **Webhooks** - Send alerts via Slack, PagerDuty, email
9. **Analytics** - Add Mixpanel or Amplitude for user insights
10. **Testing** - Add Jest, React Testing Library, Supertest

## 🎓 Learning Outcomes

By building this project, you'll learn:
- ✅ Building real-time dashboards with React
- ✅ Implementing security monitoring in Express
- ✅ Rate limiting strategies
- ✅ Authentication and access logging
- ✅ Real-time data updates with polling
- ✅ Professional UI/UX with Tailwind CSS
- ✅ REST API design
- ✅ Data visualization and analytics

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [OWASP Security Guidelines](https://owasp.org/)

## 🤝 Contributing

Feel free to fork and extend this project! Some ideas:
- Add WebSocket support for real-time updates
- Implement different database backends
- Add more security detection rules
- Create mobile app version
- Add dark/light theme toggle
- Implement advanced filtering and search

## 📄 License

MIT - Feel free to use for personal and commercial projects

## 🎯 Next Steps

1. **Run the project** - Follow the Quick Start guide
2. **Explore the code** - Understand the architecture
3. **Customize** - Add your own features
4. **Deploy** - Take it to production
5. **Share** - Add to your portfolio!

---

Built with ❤️ for modern security monitoring
