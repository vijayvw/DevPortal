# DevPortal — Full-Stack Developer Portfolio

A full-stack developer portfolio platform built with React, TypeScript, Node.js, Express, AWS Lambda, DynamoDB, S3, API Gateway, CloudFront, and GitHub Actions.

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │     Visitors     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    CloudFront    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   S3 Frontend    │
                         │   React / Vite   │
                         └──────────────────┘

Visitors / Admin
        │
        │ HTTPS API requests
        ▼
┌──────────────────┐
│   API Gateway    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    AWS Lambda    │
│   Node.js 20     │
│  DevPortal API   │
└───────┬─────┬────┘
        │     │
        │     └──────────────────┐
        ▼                        ▼
┌──────────────────┐      ┌──────────────────┐
│    DynamoDB      │      │    S3 Media      │
│  Portfolio Data  │      │ Images / Assets  │
└──────────────────┘      └──────────────────┘
```

## ✨ Features

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios API client
- TanStack Query
- Responsive portfolio interface
- Projects
- Case studies
- Skills
- Technologies
- Blog
- Contact functionality
- Admin functionality

### Backend

- Node.js 20+
- Express
- TypeScript
- AWS Lambda
- API Gateway
- DynamoDB
- S3
- JWT authentication
- bcrypt password hashing
- Zod request validation
- Helmet security middleware
- CORS
- Compression
- Rate limiting
- Pino logging
- Swagger/OpenAPI documentation
- Serverless Express

## 📁 Project Structure

```text
DevPortal/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── docs/
│   │   ├── health/
│   │   ├── infrastructure/
│   │   ├── lambda/
│   │   └── modules/
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

## 🧩 Backend Modules

```text
backend/src/modules/
├── audit-log
├── auth
├── blog
├── case-studies
├── contact
├── dashboard
├── media
├── projects
├── settings
├── skills
├── technologies
└── users
```

## 🔧 Local Development

### Prerequisites

- Node.js 20+
- npm
- Git
- AWS CLI

### Frontend

```bash
cd frontend
npm ci
```

Create the local environment file:

```bash
cp .env.example .env.development
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

### Backend

```bash
cd backend
npm ci
```

Configure the required environment variables:

```env
NODE_ENV=development
AWS_REGION=ap-south-1
DYNAMODB_TABLE=DevPortal
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

Start the backend:

```bash
npm run dev
```

Type-check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

The Lambda entry point is:

```text
backend/dist/lambda/handler.js
```

Handler:

```text
handler
```

## 🌐 API

The backend uses a versioned REST API:

```text
/api/v1
```

Main functionality includes:

- Authentication
- Users
- Projects
- Case studies
- Blog posts
- Skills
- Technologies
- Media
- Contact messages
- Dashboard
- Settings
- Audit logs

Health endpoint:

```text
/health
```

Swagger/OpenAPI documentation is included in the backend.

## ☁️ AWS Infrastructure

| Component | AWS Service |
|---|---|
| Frontend hosting | Amazon S3 |
| CDN | Amazon CloudFront |
| API | Amazon API Gateway |
| Backend | AWS Lambda |
| Database | Amazon DynamoDB |
| Media storage | Amazon S3 |
| TLS/SSL | AWS Certificate Manager |
| DNS | GoDaddy |
| CI/CD | GitHub Actions |
| AWS authentication | GitHub OIDC |

Primary AWS region:

```text
ap-south-1
```

## 🚀 CI/CD

The intended deployment pipeline is:

```text
Developer
    │
    ▼
GitHub Repository
    │
    │ git push
    ▼
GitHub Actions
    │
    ├── Build Frontend
    │       │
    │       ▼
    │   Amazon S3
    │       │
    │       ▼
    │   CloudFront
    │
    └── Build Backend
            │
            ▼
       Lambda Package
            │
            ▼
       AWS Lambda
```

GitHub Actions uses **GitHub OIDC** to authenticate with AWS instead of storing long-lived AWS access keys.

## 🔐 Environment Variables & Secrets

Secrets must never be committed to Git.

The repository ignores:

```text
.env
.env.*
```

while allowing:

```text
.env.example
```

Production secrets should be configured through AWS Lambda environment variables and GitHub Actions configuration where required.

Example backend variables:

```env
NODE_ENV=production
AWS_REGION=ap-south-1
DYNAMODB_TABLE=<production-table>
AWS_S3_BUCKET=<media-bucket>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```

Do not place real production secrets in this repository.

## 🗄️ Database

DevPortal uses Amazon DynamoDB with a single-table style data model.

The application uses:

- Partition keys
- Sort keys
- Global Secondary Indexes
- Entity-type attributes
- Soft deletion
- Audit logging

For infrastructure migration, the replacement environment uses a **separate DynamoDB table** so the existing production database remains isolated.

## 🖼️ Media Storage

Uploaded portfolio media is stored in Amazon S3.

Media storage is kept outside the Git repository.

The application accesses media through its AWS configuration.

## 🔄 Safe Migration Strategy

The infrastructure migration follows a replacement/blue-green style strategy.

```text
Existing Production
        │
        │ KEEP UNTOUCHED
        ▼
Create New Infrastructure
        │
        ├── New DynamoDB table
        ├── New S3 deployment
        ├── New Lambda
        ├── New API Gateway
        └── New CloudFront distribution
                │
                ▼
          Full Testing
                │
                ▼
           DNS / Traffic
             Cutover
                │
                ▼
        Production Verification
                │
                ▼
       Retire Old Infrastructure
```

### Migration rules

1. Do not delete the existing production deployment during development.
2. Do not modify the existing production database while testing the replacement.
3. Create the replacement infrastructure independently.
4. Clone required production data into the new DynamoDB table.
5. Deploy and test the new Lambda/API.
6. Deploy and test the new frontend.
7. Verify all portfolio functionality.
8. Switch the domain/traffic only after successful testing.
9. Verify the live deployment after cutover.
10. Retire the old infrastructure only after the new deployment is confirmed stable.

## 🔒 Security

Security practices include:

- JWT authentication
- bcrypt password hashing
- Zod input validation
- Helmet security headers
- CORS configuration
- API rate limiting
- Environment-based secrets
- AWS IAM permissions
- GitHub OIDC authentication
- No secrets committed to Git
- Isolated replacement infrastructure during migration

## 🧪 Pre-Deployment Checks

### Frontend

```bash
cd frontend
npm ci
npm run build
```

### Backend

```bash
cd backend
npm ci
npm run typecheck
npm run build
```

### Repository check

From the project root:

```bash
git status
```

Verify that the repository does not contain:

```text
node_modules/
dist/
.env.development
.env
*.zip
```

## 📦 Deployment Requirements

The production deployment requires:

- AWS account
- S3 bucket for frontend hosting
- S3 storage for media
- CloudFront distribution
- API Gateway
- Lambda function
- DynamoDB table
- ACM certificate
- DNS configuration
- IAM deployment role
- GitHub repository
- GitHub Actions workflow
- GitHub OIDC trust configuration

## 🎯 Project Goals

DevPortal is designed to demonstrate practical cloud and DevOps skills, including:

- Full-stack application development
- AWS serverless architecture
- Cloud storage
- NoSQL database design
- API development
- Authentication
- Infrastructure isolation
- CI/CD automation
- GitHub Actions
- IAM
- OIDC
- Production deployment
- Safe migration and cutover practices

## 📜 License

This project is a personal developer portfolio and project showcase.
