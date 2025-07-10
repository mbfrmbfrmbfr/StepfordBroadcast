# SBC News Website - VPS Deployment Guide

## Prerequisites

- Node.js 18+ installed on your VPS
- PostgreSQL database (optional - uses in-memory storage by default)
- Domain name (optional)
- SSL certificate (recommended for production)

## Environment Setup

1. Clone or upload the project to your VPS
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (optional - remove for in-memory storage)
DATABASE_URL=postgresql://username:password@localhost:5432/sbc_news

# Session Configuration
SESSION_SECRET=your-very-secure-random-session-secret-here

# Admin User Configuration (for first setup)
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=your-secure-admin-password
DEFAULT_ADMIN_NAME=Site Administrator
```

## Build and Start

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```

## Process Management (Recommended)

Use PM2 to keep the application running:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start with PM2:
   ```bash
   pm2 start "npm start" --name "sbc-news"
   ```

3. Save PM2 configuration:
   ```bash
   pm2 save
   pm2 startup
   ```

## Nginx Configuration (Recommended)

Create an nginx configuration file at `/etc/nginx/sites-available/sbc-news`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/sbc-news /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Setup with Certbot

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Firewall Configuration

```bash
sudo ufw allow 22     # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS
sudo ufw enable
```

## Default Admin User

On first startup, the system creates a default admin user with credentials from your environment variables:
- Email: `DEFAULT_ADMIN_EMAIL` (defaults to admin@sbc.com)
- Password: `DEFAULT_ADMIN_PASSWORD` (defaults to admin123)
- Name: `DEFAULT_ADMIN_NAME` (defaults to System Administrator)

**Important**: Change these credentials immediately after deployment!

## Features Available

### Public Features
- News homepage with category filtering
- Breaking news ticker (only shows when breaking news exists)
- Responsive design optimized for all devices

### Admin Features (Login Required)
- Article creation and management
- Category and department management
- User management (admin users only)
- Breaking news control

### User Features (Login Required)
- Personal profile management
- Department assignment (optional)
- Article authoring (based on role)

## Security Considerations

1. **Change default admin credentials** immediately after deployment
2. Use a **strong SESSION_SECRET** in production
3. Consider using a **real database** (PostgreSQL) instead of in-memory storage for persistence
4. Implement **HTTPS** using SSL certificates
5. Keep dependencies **updated** regularly
6. Use **strong passwords** for all user accounts
7. Consider implementing **rate limiting** for API endpoints

## Database Migration (Optional)

If you want to use PostgreSQL instead of in-memory storage:

1. Install and configure PostgreSQL
2. Set the `DATABASE_URL` in your `.env` file
3. The application will automatically create tables on startup using Drizzle ORM

## Monitoring

- Check application status: `pm2 status`
- View logs: `pm2 logs sbc-news`
- Restart application: `pm2 restart sbc-news`
- Check nginx status: `sudo systemctl status nginx`
- View nginx logs: `sudo tail -f /var/log/nginx/error.log`

## Troubleshooting

1. **Port conflicts**: Ensure no other service is using the configured port
2. **Permission issues**: Make sure the user has proper permissions to the project directory
3. **Environment variables**: Verify all required environment variables are set correctly
4. **Database connection**: If using PostgreSQL, ensure the database is running and accessible
5. **Firewall blocking**: Check that the configured port is allowed through the firewall

## Updates

To update the application:

1. Pull the latest code
2. Install any new dependencies: `npm install`
3. Rebuild: `npm run build`
4. Restart: `pm2 restart sbc-news`