# Yunus Auto Garage — Backend API

.NET 9 ASP.NET Core Web API with PostgreSQL, JWT auth, appointment booking, NetGSM SMS, and analytics.

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended) or local PostgreSQL 14+

## Setup

### 1. Start PostgreSQL (Docker — recommended)

From the `backend/` folder:

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `yunus_auto_garage`
- User: `postgres`
- Password: `postgres`

Matches `appsettings.json` connection string by default.

### 2. Apply migrations and run API

```bash
cd YunusAutoGarage.Api
dotnet ef database update
dotnet run
```

API: http://localhost:5000  
Swagger (Development): http://localhost:5000/swagger

### Alternative: existing PostgreSQL

Create the database and update the connection string:

```sql
CREATE DATABASE yunus_auto_garage;
```

```bash
cd YunusAutoGarage.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=yunus_auto_garage;Username=postgres;Password=YOUR_PASSWORD"
```

## Default Admin

- Username: `admin`
- Password: `ChangeMe123!`

Change via `AdminSeed` in appsettings or user-secrets before first migration in production.

## NetGSM

Set `Netgsm:Enabled` to `true` when credentials are configured. When `false`, SMS is simulated and logged to `sms_logs`.

## Frontend Proxy

Angular dev server proxies `/api` to `http://localhost:5000` via `proxy.conf.json`.
