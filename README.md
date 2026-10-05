# 🚀 DevPortal — Full-Stack Developer Portfolio CMS

<p align="center">

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonaws&logoColor=white)
![Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?logo=awslambda&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-FF4F8B?logo=amazonapigateway&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?logo=amazondynamodb&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?logo=amazons3&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-8C4FFF?logo=amazoncloudfront&logoColor=white)
![Route 53](https://img.shields.io/badge/Route_53-8C4FFF?logo=amazonroute53&logoColor=white)
![SES](https://img.shields.io/badge/Amazon_SES-DD344C?logo=amazonaws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?logo=terraform&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)

</p>

<p align="center">

<strong>Production-ready Full-Stack Developer Portfolio CMS</strong>

Build, customize, and deploy your own developer portfolio with a modern React frontend, serverless AWS backend, Admin Panel, DynamoDB, S3, CloudFront, SES, and Terraform.

</p>

---

## 📚 Table of Contents

- [📖 Executive Summary](#-executive-summary)
- [🎯 Project Goals](#-project-goals)
- [✨ Key Features](#-key-features)
- [🧑‍💻 Admin Panel](#-admin-panel)
- [🌎 Use DevPortal for Your Own Portfolio](#-use-devportal-for-your-own-portfolio)
- [🏛️ High-Level Architecture](#-high-level-architecture)
- [🔄 How AWS Services Communicate](#-how-aws-services-communicate)
- [🛠️ Technology Stack](#-technology-stack)
- [📂 Repository Structure](#-repository-structure)
- [🔐 Authentication](#-authentication)
- [📋 Prerequisites](#-prerequisites)
- [💻 Local Development](#-local-development)
- [⚙️ Terraform Configuration](#-terraform-configuration)
- [🚀 Production Deployment](#-production-deployment)
- [🌐 Custom Domain](#-custom-domain)
- [📧 Amazon SES](#-amazon-ses)
- [🗄️ Database Architecture](#-database-architecture)
- [🖼️ Media Architecture](#-media-architecture)
- [🔒 Security](#-security)
- [🗃️ Backup and Recovery](#-backup-and-recovery)
- [🐛 Troubleshooting](#-troubleshooting)
- [💰 AWS Cost Considerations](#-aws-cost-considerations)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

# 📖 Executive Summary

DevPortal is a full-stack developer portfolio platform designed to work as both a modern personal portfolio and a content management system.

Traditional developer portfolios often require developers to edit React components, rebuild the application, and redeploy whenever they want to change a project, skill, blog post, profile, or other portfolio content.

DevPortal separates the **application** from the **portfolio content**.

```text
                    DevPortal
                       │
          ┌────────────┴────────────┐
          │                         │
    Application Code          Portfolio Content
          │                         │
          ▼                         ▼
   React + Node.js            Admin Panel
   AWS + Terraform                 │
          │                         ▼
          │                      DynamoDB
          │                         │
          └─────────────┬───────────┘
                        ▼
                 Public Portfolio
```

After the initial deployment, the portfolio owner can manage most portfolio content from the Admin Panel without changing the source code.

---

# 🎯 Project Goals

- Provide a complete developer portfolio website.
- Provide a browser-based CMS/Admin Panel.
- Store portfolio content dynamically.
- Use a serverless AWS architecture.
- Manage infrastructure with Terraform.
- Keep frontend and media S3 buckets private.
- Deliver content through CloudFront.
- Store application data in DynamoDB.
- Support transactional email through Amazon SES.
- Provide authentication and protected administration.
- Support media management.
- Support backup and restoration.
- Make the infrastructure reproducible.

---

# ✨ Key Features

## 🌐 Public Portfolio

- Home
- About
- Skills
- Skill categories
- Projects
- Project details
- Project galleries
- Case studies
- Blog
- Contact
- Social links
- Resume URL
- Responsive/mobile-friendly UI

## 🧑‍💻 Admin Panel

Manage the portfolio from the browser:

- Profile
- About
- Skills
- Skill categories
- Projects
- Project technologies
- Project images
- Project galleries
- Case studies
- Blog posts
- Media
- Contact messages
- Social links
- Resume URL
- Portfolio settings
- Administrator password

---

# 🧑‍💻 Admin Panel

The Admin Panel is the core of DevPortal.

### Profile

Manage:

- Name
- Title
- Bio
- Profile information
- Social links
- Resume URL
- Contact information

### Skills

Create and manage skills and categories such as:

```text
Cloud Platforms
DevOps & Automation
Infrastructure as Code
Cloud & Cyber Security
Networking
Databases
Monitoring & Observability
Operating Systems
Containers & Orchestration
Certifications
```

### Projects

Create projects with:

- Name
- Description
- Technologies
- GitHub URL
- Live URL
- Images
- Gallery
- Detailed project information

### Case Studies

Document projects using:

```text
Problem
    ↓
Architecture
    ↓
Implementation
    ↓
Technologies
    ↓
Challenges
    ↓
Solution
    ↓
Results
```

### Blog

Create technical posts about AWS, Kubernetes, Linux, cybersecurity, DevOps, Terraform, programming, infrastructure, and other topics.

### Media

Upload and manage portfolio media. Production media is stored in a dedicated private S3 bucket.

### Contacts

Visitors submit messages through the public portfolio. Messages are stored in DynamoDB and managed from the Admin Panel.

### Email Replies

```text
Visitor
   │
   ▼
Contact Form
   │
   ▼
API Gateway
   │
   ▼
Lambda
   ├──► DynamoDB
   │
   └──► Amazon SES
             │
             ▼
        Visitor Email
```

---

# 🌎 Use DevPortal for Your Own Portfolio

DevPortal is designed to be reused by other developers.

```text
Clone Repository
       ↓
Configure AWS
       ↓
Configure Terraform
       ↓
terraform apply
       ↓
AWS Infrastructure
       ↓
Open Portfolio
       ↓
Login to Admin Panel
       ↓
Replace Your Content
       ↓
Publish Your Portfolio
```

You do not need to rebuild the frontend every time you want to add a project, skill, case study, blog post, or profile update.

### Content vs Design

**Content changes:**

```text
Admin Panel → API → DynamoDB/S3 → Portfolio
```

**Design changes:**

```text
Modify frontend source → Build → Deploy
```

---

# 📝 What Can Be Customized?

| Content | Admin Panel |
|---|:---:|
| Name | ✅ |
| Profile | ✅ |
| About | ✅ |
| Skills | ✅ |
| Skill categories | ✅ |
| Projects | ✅ |
| Technologies | ✅ |
| Project images | ✅ |
| Project gallery | ✅ |
| Case studies | ✅ |
| Blog posts | ✅ |
| Social links | ✅ |
| Resume URL | ✅ |
| Contact messages | ✅ |
| Media | ✅ |
| Settings | ✅ |
| Password | ✅ |

---

# 🏛️ High-Level Architecture

```text
                         Visitors / Admin
                                │
                                │ HTTPS
                                ▼
                         ┌───────────────┐
                         │   Route 53    │
                         │     DNS       │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │  CloudFront   │
                         │ CDN + HTTPS   │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌──────────────┐          ┌──────────────┐
             │ Private S3   │          │ Private S3   │
             │ Frontend     │          │ Media        │
             └──────────────┘          └──────────────┘


Visitors / Admin
       │
       │ HTTPS API requests
       ▼
┌──────────────────────┐
│   Amazon API Gateway │
│       HTTP API       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      AWS Lambda      │
│   Node.js + Express  │
│    DevPortal API     │
└───────┬───────┬──────┘
        │       │
        ▼       ▼
 ┌──────────┐ ┌───────────────┐
 │ DynamoDB │ │      S3       │
 │ Database │ │ Media Storage │
 └──────────┘ └───────────────┘
        │
        ▼
  Amazon SES
  Transactional Email


              Infrastructure as Code
                       │
                       ▼
                  Terraform
                       │
                       ▼
                 AWS Resources
```

---

# 🔄 How AWS Services Communicate

## Visitor loads the portfolio

```text
Browser
   │
   ▼
Route 53
   │
   ▼
CloudFront
   │
   ▼
Private S3 Frontend Bucket
   │
   ▼
React Application
```

## React requests portfolio data

```text
React
   │
   │ GET /api/v1/projects
   ▼
API Gateway
   │
   ▼
Lambda
   │
   ▼
DynamoDB
   │
   ▼
Lambda
   │
   ▼
API Gateway
   │
   ▼
React
```

## Visitor loads an image

```text
React
   │
   ▼
https://yourdomain.com/media/image.png
   │
   ▼
CloudFront
   │
   ▼
Private S3 Media Bucket
```

## Admin creates a project

```text
Admin Panel
      │
      ▼
API Gateway
      │
      ▼
Lambda
      │
      ▼
DynamoDB
```

## Admin uploads media

```text
Admin Panel
      │
      ▼
API
      │
      ▼
Lambda
      │
      ▼
S3 Media Bucket
      │
      ▼
Media Record → DynamoDB
```

---

# 🛠️ Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Language | TypeScript | Type-safe development |
| Build Tool | Vite | Frontend build |
| Styling | Tailwind CSS | UI styling |
| Data Fetching | TanStack Query | Server state |
| HTTP Client | Axios | API communication |
| Animation | Framer Motion | UI animation |
| Visuals | Three.js | Interactive visuals |
| Backend | Node.js | Server runtime |
| API | Express | REST API |
| Validation | Zod | Request validation |
| Authentication | JWT | Authentication |
| Password Security | bcryptjs | Password hashing |
| Security | Helmet | HTTP security |
| Logging | Pino | Structured logging |
| API Docs | Swagger/OpenAPI | API documentation |
| Compute | AWS Lambda | Serverless backend |
| API | Amazon API Gateway | HTTP API |
| Database | Amazon DynamoDB | Application data |
| Storage | Amazon S3 | Frontend/media/artifacts |
| CDN | Amazon CloudFront | Content delivery |
| Email | Amazon SES | Transactional email |
| DNS | Amazon Route 53 | DNS |
| TLS | AWS ACM | HTTPS |
| IAM | AWS IAM | Permissions |
| IaC | Terraform | Infrastructure automation |
| Version Control | Git | Source control |
| Repository | GitHub | Code hosting |

---

# ☁️ AWS Resource Summary

| Resource | Purpose |
|---|---|
| S3 Frontend Bucket | React production build |
| S3 Media Bucket | Portfolio uploads |
| S3 Artifact Bucket | Lambda artifacts |
| CloudFront | CDN, HTTPS, frontend/media delivery |
| API Gateway | Backend API |
| Lambda | Express backend |
| DynamoDB | Portfolio/CMS data |
| SES | Transactional email |
| Route 53 | DNS |
| ACM | TLS certificate |
| IAM | AWS permissions |

Primary application region:

```text
ap-south-1
```

CloudFront ACM certificate region:

```text
us-east-1
```

---

# 🔐 Authentication

```text
Admin
  │
  │ Email + Password
  ▼
API Gateway
  │
  ▼
Lambda
  │
  ▼
DynamoDB
  │
  ▼
JWT
  │
  ▼
Admin Browser
```

Passwords are hashed with bcrypt. Protected API routes validate authentication before performing administrative operations.

---

# 📂 Repository Structure

```text
DevPortal/
│
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── docs/
│   │   ├── health/
│   │   ├── infrastructure/
│   │   │   ├── email/
│   │   │   └── s3/
│   │   ├── lambda/
│   │   └── modules/
│   │       ├── audit-log/
│   │       ├── auth/
│   │       ├── blog/
│   │       ├── case-studies/
│   │       ├── contact/
│   │       ├── dashboard/
│   │       ├── media/
│   │       ├── projects/
│   │       ├── settings/
│   │       ├── skills/
│   │       ├── technologies/
│   │       └── users/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── terraform/
│   ├── acm.tf
│   ├── api_gateway.tf
│   ├── cloudfront.tf
│   ├── cloudfront_deploy.tf
│   ├── dynamodb.tf
│   ├── frontend.tf
│   ├── iam.tf
│   ├── lambda.tf
│   ├── locals.tf
│   ├── outputs.tf
│   ├── provider.tf
│   ├── restore.tf
│   ├── route53.tf
│   ├── s3.tf
│   ├── ses.tf
│   ├── variables.tf
│   ├── versions.tf
│   └── scripts/
│       ├── build_frontend.sh
│       ├── build_lambda.sh
│       └── restore_dynamodb.sh
│
├── .gitignore
└── README.md
```

---

# 📋 Prerequisites

Install:

- Node.js 20+
- npm
- Git
- AWS CLI
- Terraform >= 1.6
- AWS account
- Domain name for custom-domain deployment

Verify:

```bash
node --version
npm --version
aws --version
terraform version
git --version
```

Configure AWS:

```bash
aws configure
```

Verify:

```bash
aws sts get-caller-identity
```

---

# 💻 Local Development

## Frontend

```bash
cd frontend
npm ci
```

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

Start:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Backend

```bash
cd backend
npm ci
```

Example:

```env
NODE_ENV=development
AWS_REGION=ap-south-1
DYNAMODB_TABLE=DevPortal
AWS_S3_BUCKET=your-media-bucket
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
UPLOAD_DRIVER=s3
API_PREFIX=/api/v1
LOG_LEVEL=info
```

Start:

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

Lambda handler:

```text
dist/lambda/handler.handler
```

---

# 🌐 API

Base API:

```text
/api/v1
```

Main modules:

```text
Authentication
Users
Projects
Case Studies
Blog
Skills
Technologies
Media
Contact
Dashboard
Settings
Audit Logs
```

Health endpoints:

```text
/health
/live
/ready
```

Swagger/OpenAPI documentation is included in the backend.

---

# ⚙️ Terraform Configuration

```bash
cd terraform
terraform init
terraform fmt -recursive
terraform validate
```

Create:

```text
terraform.tfvars
```

**Never commit this file.**

Example:

```hcl
environment = "production"

frontend_bucket_name = "your-unique-frontend-bucket"
media_bucket_name = "your-unique-media-bucket"
artifact_bucket_name = "your-unique-artifact-bucket"

dynamodb_table_name = "DevPortal"

lambda_function_name = "DevPortalBackend"
lambda_role_name = "DevPortalLambdaExecutionRole"

api_name = "DevPortalAPI"

email_from = "you@example.com"
```

Configure the remaining variables defined in `terraform/variables.tf`, including your domain, allowed origins, JWT secrets, and backup paths where required.

---

# 🚀 Production Deployment

## 1. Configure AWS

```bash
aws configure
aws sts get-caller-identity
```

## 2. Initialize Terraform

```bash
cd terraform
terraform init
```

## 3. Validate

```bash
terraform fmt -recursive
terraform validate
```

## 4. Review

```bash
terraform plan
```

## 5. Deploy

```bash
terraform apply
```

## 6. View Outputs

```bash
terraform output
```

Typical outputs include:

```text
api_gateway_url
cloudfront_distribution_id
cloudfront_domain
dynamodb_table
frontend_bucket
frontend_url
lambda_function
media_bucket
```

---

# 🎨 Frontend Deployment Flow

```text
frontend/
    │
    ▼
npm run build
    │
    ▼
dist/
    │
    ▼
Private S3 Frontend Bucket
    │
    ▼
CloudFront
    │
    ▼
https://your-domain.com
```

CloudFront uses Origin Access Control to access the private bucket.

---

# ⚙️ Backend Deployment Flow

```text
backend/
    │
    ▼
TypeScript Build
    │
    ▼
Lambda Package
    │
    ▼
S3 Artifact Bucket
    │
    ▼
AWS Lambda
    │
    ▼
API Gateway
```

---

# 🌐 Custom Domain

Supported:

```text
https://yourdomain.com
https://www.yourdomain.com
```

Traffic:

```text
Domain
  │
  ▼
Route 53
  │
  ▼
CloudFront
  │
  ▼
S3 / Application
```

For CloudFront, the ACM certificate must be in:

```text
us-east-1
```

Application resources can remain in:

```text
ap-south-1
```

---

# 📧 Amazon SES

SES provides transactional email.

Before enabling email:

1. Verify the sender identity.
2. Check SES sending status.
3. Check sandbox status.
4. Verify recipients when sandbox restrictions apply.
5. Configure `email_from`.
6. Ensure Lambda has SES permissions.
7. Test contact/reply functionality.

Example:

```hcl
email_from = "you@example.com"
```

For production, a verified domain identity is recommended.

---

# 🗄️ Database Architecture

DevPortal uses Amazon DynamoDB with a single-table style model.

Primary keys:

```text
PK
SK
```

Global Secondary Indexes:

```text
GSI1
GSI2
```

Entities include:

```text
Users
Skills
Skill Categories
Projects
Project Gallery Images
Case Studies
Blog Posts
Contact Messages
Media Assets
Technologies
Settings
Audit Logs
```

DynamoDB configuration includes:

- On-demand billing
- Server-side encryption
- Point-in-time recovery
- Global Secondary Indexes

The browser never accesses DynamoDB directly:

```text
Browser → API Gateway → Lambda → DynamoDB
```

---

# 🖼️ Media Architecture

```text
Frontend Bucket
    └── React production build

Media Bucket
    └── media/
         ├── image-1.png
         ├── image-2.jpg
         └── ...
```

The media bucket is private.

CloudFront delivers media through:

```text
https://yourdomain.com/media/...
```

---

# 🔒 Security

## Application

- JWT authentication
- bcrypt password hashing
- Zod validation
- Helmet security headers
- CORS
- API rate limiting
- Structured logging
- Environment-based secrets

## AWS

- IAM roles
- Private S3 buckets
- CloudFront Origin Access Control
- HTTPS
- ACM certificates
- DynamoDB encryption
- DynamoDB point-in-time recovery
- Separate frontend/media storage

## Repository

Never commit:

```text
.env
.env.*
terraform.tfvars
terraform.tfstate
terraform.tfstate.backup
*.tfplan
*.plan
*.zip
AWS credentials
JWT secrets
private keys
production backups
```

---

# 🔐 Environment Variables & Secrets

Never commit production secrets.

Example backend:

```env
NODE_ENV=production
AWS_REGION=ap-south-1
DYNAMODB_TABLE=<production-table>
AWS_S3_BUCKET=<media-bucket>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```

Frontend environment variables must contain only values safe to expose publicly.

Never put AWS secret keys or JWT secrets into the frontend.

---

# 🗃️ Backup and Recovery

Backups should remain independent from Terraform-managed infrastructure.

Terraform is not a backup system.

Restoration support is included:

```text
terraform/restore.tf
terraform/scripts/restore_dynamodb.sh
```

Recovery model:

```text
Independent Backup
       │
       ▼
terraform apply
       │
       ▼
New AWS Infrastructure
       │
       ├── Restore DynamoDB
       │
       └── Restore S3 Media
       │
       ▼
Application Ready
```

Keeping backups separately makes infrastructure recreation possible without depending on deleted resources.

---

# 🔄 Recreating Infrastructure

```text
Terraform Source
      │
      ▼
terraform apply
      │
      ▼
AWS Infrastructure
      │
      ▼
Restore Data if Required
      │
      ▼
Production Portfolio
```

Required:

- AWS credentials
- Terraform variables
- Domain/DNS configuration
- ACM requirements
- Application source code
- Database backups if required
- Media backups if required

---

# 🗑️ Destroying Infrastructure

```bash
terraform destroy
```

Review the changes carefully before confirming.

**Do not treat `terraform destroy` as a backup operation.**

Keep database and media backups outside the infrastructure stack.

---

# 🧪 Testing and Validation

Frontend:

```bash
cd frontend
npm ci
npm run build
```

Backend:

```bash
cd backend
npm ci
npm run typecheck
npm run build
```

Terraform:

```bash
cd terraform
terraform fmt -check -recursive
terraform validate
terraform plan
```

Health check:

```bash
curl https://your-api-url/health
```

Local:

```bash
curl http://localhost:4000/health
```

---

# 🐛 Troubleshooting

## Frontend cannot reach API

Check:

```env
VITE_API_BASE_URL
```

Verify the API Gateway URL and backend CORS configuration.

## CloudFront serves old content

CloudFront can cache previous assets. Create an invalidation when necessary:

```text
/*
```

## Media returns 403

Check:

- CloudFront `/media/*` behavior
- Media bucket policy
- Origin Access Control
- S3 object key
- CloudFront distribution
- S3 public access block

## Lambda errors

Check CloudWatch Logs for:

```text
DynamoDB permissions
S3 permissions
Environment variables
JWT configuration
SES permissions
CORS configuration
```

## Contact email does not send

Check:

```text
SES sender verification
SES sandbox status
SES permissions
EMAIL_FROM
AWS region
Lambda IAM permissions
CloudWatch logs
```

## DNS problems

```bash
dig yourdomain.com
dig NS yourdomain.com
```

Verify domain delegation and Route 53 records.

---

# 💰 AWS Cost Considerations

DevPortal uses primarily serverless AWS services and does not require a permanently running EC2 server for the application.

Potential costs include:

- CloudFront
- S3 storage and requests
- Lambda invocations
- API Gateway requests
- DynamoDB usage
- SES email sending
- Route 53 hosted zone
- Data transfer

Actual costs depend on traffic, storage, API requests, database operations, media usage, email volume, and current AWS pricing.

Always check current AWS pricing before deploying.

---

# 🔄 Updating the Application

## Code changes

```text
Edit Source
    ↓
Test
    ↓
Build
    ↓
Commit
    ↓
Terraform Deployment
    ↓
AWS
```

## Content changes

```text
Admin Panel
    ↓
API
    ↓
DynamoDB / S3
    ↓
Portfolio
```

Normal portfolio content updates do not require source-code changes.

---

# 🧑‍💻 Recommended Portfolio Setup

After deployment:

1. **Settings** — configure your profile and portfolio information.
2. **About** — write your professional introduction.
3. **Skills** — create categories and add skills.
4. **Projects** — add your projects and technologies.
5. **Media** — upload project/profile images.
6. **Case Studies** — document important projects.
7. **Blog** — publish technical articles.
8. **Social Links** — add GitHub, LinkedIn, X/Twitter, etc.
9. **Resume** — configure your resume URL.
10. **Contact** — submit a test message.
11. **Email** — verify the transactional email workflow.

---

# 🧠 Why DevPortal?

Most static portfolios treat the website and content as the same thing.

DevPortal separates them:

```text
                    DevPortal
                       │
          ┌────────────┴────────────┐
          │                         │
       Platform                  Content
          │                         │
          ▼                         ▼
 React + Node.js             Admin Panel
 AWS + Terraform                  │
                                  ▼
                              DynamoDB
                                  │
                                  ▼
                           Public Portfolio
```

The application controls **how the portfolio works**.

The CMS controls **what the portfolio contains**.

This makes the portfolio easier to maintain, expand, and reuse.

---

# 🎯 Project Goals and Learning

This project demonstrates practical experience with:

- Full-stack development
- React
- TypeScript
- Node.js
- Express
- REST APIs
- Authentication
- DynamoDB
- AWS Lambda
- API Gateway
- S3
- CloudFront
- Route 53
- ACM
- SES
- IAM
- Terraform
- Serverless architecture
- Cloud security
- Infrastructure as Code
- Production deployment
- Backup and recovery
- Secure media delivery

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test frontend/backend changes.
5. Validate Terraform.
6. Commit your changes.
7. Push your branch.
8. Open a Pull Request.

Example:

```bash
git checkout -b feature/my-feature
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

---

# 📄 License

This repository is a personal developer portfolio platform and project showcase.

If you plan to redistribute or commercially reuse the project, review the repository and all third-party dependency licenses first.

---

# 👨‍💻 Author

<p align="center">

<strong>Vijay Rangnath Waghmare</strong>

</p>

Developer focused on:

```text
Cloud
DevOps
Cloud Security
Cybersecurity
Linux
Kubernetes
Infrastructure as Code
AWS
```

### 🌐 Portfolio

https://vijayvw.in

---

<p align="center">

<strong>⭐ If you find this project useful, consider giving the repository a star.</strong>

</p>
