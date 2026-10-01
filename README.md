# DevPortal — Full-Stack Developer Portfolio CMS

A production-ready, full-stack developer portfolio platform that allows developers to build, manage, and deploy their personal portfolio without editing application code every time they want to change their content.

DevPortal combines a modern React frontend, Node.js/Express backend, AWS serverless infrastructure, DynamoDB, S3, CloudFront, API Gateway, Lambda, SES, and Terraform.

The main feature is the **Admin Panel**. After deployment, portfolio owners can manage their content from the browser instead of modifying source code for every content change.

---

## 🧰 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind,nodejs,express,python,bash,aws,dynamodb,s3,cloudflare,terraform,docker,git,github&perline=8" alt="Tech Stack" />
</p>

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- TanStack Query
- Three.js
- Framer Motion
- Lucide Icons

### Backend

- Node.js
- Express
- TypeScript
- Serverless Express
- Zod
- JWT
- bcryptjs
- Helmet
- CORS
- Compression
- Rate limiting
- Pino logging
- Swagger/OpenAPI

### AWS

- Amazon S3
- Amazon CloudFront
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon SES
- Amazon Route 53
- AWS Certificate Manager
- AWS IAM

### Infrastructure

- Terraform
- AWS CLI
- Git
- GitHub

> The icons above are provided by [Skill Icons](https://skillicons.dev/). They are visual technology badges; the AWS service list below is the authoritative list of services used by this project.

---

# ✨ What is DevPortal?

DevPortal is a complete portfolio website + CMS designed for developers, engineers, cybersecurity professionals, DevOps engineers, cloud engineers, and other technical professionals.

Instead of creating a static portfolio where every change requires editing source code, DevPortal separates the:

- Portfolio frontend
- Backend API
- Database
- Media storage
- Administration interface

This allows the owner to manage the portfolio dynamically.

For example, after deployment you can log into the Admin Panel and change:

- Name
- Profile information
- About section
- Skills
- Skill categories
- Technologies
- Projects
- Project images
- Case studies
- Blog posts
- Social links
- Resume URL
- Contact information
- Portfolio settings
- Uploaded media
- Password

The frontend automatically displays the information stored in the backend.

---

# 🖥️ Architecture

```text
                         ┌─────────────────────┐
                         │       Visitors      │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │     CloudFront      │
                         │      CDN + TLS      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Private S3       │
                         │  React Application  │
                         └─────────────────────┘


Visitors / Admin
       │
       │ HTTPS API requests
       ▼
┌─────────────────────┐
│    API Gateway      │
│     HTTP API        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Lambda        │
│   Node.js + Express │
│    DevPortal API    │
└──────┬───────┬──────┘
       │       │
       │       │
       ▼       ▼
┌──────────┐  ┌────────────────────┐
│ DynamoDB │  │     S3 Media       │
│ Database │  │ Images / Assets    │
└──────────┘  └─────────┬──────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  CloudFront  │
                  │ /media/*     │
                  └──────────────┘


Contact Messages
       │
       ▼
   DynamoDB
       │
       ▼
Admin Panel

Contact Replies
       │
       ▼
      SES
       │
       ▼
Recipient Email
```

---

# 🚀 Main Features

## Portfolio Website

- Home
- About
- Skills
- Projects
- Project details
- Case studies
- Blog
- Contact
- Social links
- Resume link
- Responsive design
- Mobile-friendly interface
- Modern developer-focused UI

---

# 🛠️ Admin Panel

The Admin Panel is the core of DevPortal.

After deployment, the portfolio owner can manage the website from the browser.

### Dashboard

Provides an administrative overview of the portfolio system.

### Profile Management

Update:

- Name
- Title
- Bio
- Profile information
- Social links
- Resume URL
- Contact information

### About Management

Manage the About section and professional information without modifying source code.

### Skills Management

Create and manage:

- Skills
- Skill categories
- Skill descriptions
- Skill levels
- Skill ordering

Example categories:

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

Create and manage:

- Project name
- Description
- Technologies
- GitHub repository
- Live URL
- Project image
- Project details
- Project gallery

### Case Studies

Create detailed case studies containing:

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

Create and manage technical blog posts.

Possible topics include:

- AWS
- Kubernetes
- Docker
- Linux
- Cybersecurity
- DevOps
- Cloud Security
- Terraform
- Programming
- Infrastructure
- CTF writeups

### Media Library

Portfolio images and uploaded media are stored in Amazon S3.

The production architecture keeps the media bucket private and uses CloudFront for delivery.

### Contact Messages

Visitors can submit contact messages through the portfolio.

Messages are stored in DynamoDB and can be viewed from the Admin Panel.

### Email Replies

DevPortal integrates with Amazon SES for transactional email communication.

```text
Visitor
   │
   │ Contact form
   ▼
DevPortal API
   │
   ▼
DynamoDB
   │
   ▼
Admin Panel
   │
   │ Reply
   ▼
Amazon SES
   │
   ▼
Visitor Email
```

### Settings

Portfolio configuration can be managed from the Admin Panel.

### Password Management

Administrator passwords are securely hashed using bcrypt rather than stored as plaintext.

---

# 🧩 Backend Modules

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

---

# ☁️ AWS Services

| Purpose | AWS Service |
|---|---|
| Frontend hosting | Amazon S3 |
| Frontend CDN | Amazon CloudFront |
| Media storage | Amazon S3 |
| Media delivery | Amazon CloudFront |
| Backend API | Amazon API Gateway |
| Backend compute | AWS Lambda |
| Database | Amazon DynamoDB |
| Email | Amazon SES |
| SSL/TLS | AWS Certificate Manager |
| DNS | Amazon Route 53 |
| Permissions | AWS IAM |

Primary AWS application region:

```text
ap-south-1
```

For CloudFront, ACM certificates must be provisioned in:

```text
us-east-1
```

---

# 🔄 How the Services Communicate

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
Private S3
   │
   ▼
React Application
```

## Visitor loads dynamic content

```text
React
   │
   │ HTTPS API request
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
      │ POST request
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
Project saved
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
Media URL
      │
      ▼
DynamoDB Media Record
```

---

# 🔐 Authentication Flow

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
  │ Authentication result
  ▼
JWT
  │
  ▼
Admin Browser
```

The backend validates authentication tokens before allowing protected operations.

Passwords are hashed using bcrypt.

---

# 📁 Project Structure

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
│   │
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
│   │
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

# 💻 Local Development

## Prerequisites

- Node.js 20+
- npm
- Git
- AWS CLI
- Terraform 1.6+
- AWS account for AWS-backed functionality

Verify:

```bash
node --version
npm --version
aws --version
terraform version
```

---

# 🎨 Frontend Development

```bash
cd frontend
npm ci
```

Create:

```text
.env.development
```

Example:

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

---

# ⚙️ Backend Development

```bash
cd backend
npm ci
```

Example environment:

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

The backend uses a versioned API:

```text
/api/v1
```

Main areas:

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

Health endpoints:

```text
/health
/live
/ready
```

Swagger/OpenAPI documentation is included in the backend.

---

# 🌎 Use DevPortal for Your Own Portfolio

You do not need to build a new portfolio frontend from scratch.

The normal workflow is:

```text
Clone repository
       ↓
Configure AWS
       ↓
Configure domain
       ↓
Deploy infrastructure
       ↓
Open portfolio
       ↓
Login to Admin Panel
       ↓
Replace portfolio content
       ↓
Upload your media
       ↓
Add projects
       ↓
Add skills
       ↓
Add case studies
       ↓
Add blog posts
       ↓
Publish your portfolio
```

---

# 🧑‍💻 Admin Panel Workflow

After deployment:

```text
https://your-domain.com
```

Log in to the administrator interface.

Typical sections:

```text
Admin Panel
    │
    ├── Dashboard
    ├── About
    ├── Skills
    ├── Projects
    ├── Case Studies
    ├── Blog
    ├── Media
    ├── Contacts
    └── Settings
```

---

# 📝 What Can Be Customized?

| Content | Admin Panel |
|---|---|
| Name | Yes |
| Profile | Yes |
| About | Yes |
| Skills | Yes |
| Skill categories | Yes |
| Projects | Yes |
| Project technologies | Yes |
| Project images | Yes |
| Case studies | Yes |
| Blog posts | Yes |
| Social links | Yes |
| Resume URL | Yes |
| Contact messages | Yes |
| Media | Yes |
| Portfolio settings | Yes |
| Password | Yes |

### Important distinction

**Portfolio content changes**

```text
Admin Panel → Save → DynamoDB → Frontend
```

No source-code change is required.

**Visual/design changes**

```text
Modify frontend source
        ↓
Build
        ↓
Deploy
```

---

# 🚀 Production Deployment with Terraform

The repository contains Terraform configuration for deploying the AWS infrastructure.

## 1. Configure AWS

```bash
aws configure
```

Verify:

```bash
aws sts get-caller-identity
```

The AWS identity must have sufficient permissions to create the required resources.

---

## 2. Configure Terraform

```bash
cd terraform
terraform init
```

Create:

```text
terraform.tfvars
```

**Do not commit this file.**

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

Also configure the required variables defined in:

```text
terraform/variables.tf
```

including your domain, allowed origins, JWT secrets, and backup paths where applicable.

---

## 3. Validate Terraform

```bash
terraform fmt -recursive
terraform validate
```

Review:

```bash
terraform plan
```

Deploy:

```bash
terraform apply
```

View outputs:

```bash
terraform output
```

---

# 🏗️ What Terraform Deploys

The Terraform configuration manages the production infrastructure including:

```text
Amazon S3
├── Frontend bucket
├── Media bucket
└── Lambda artifact bucket

Amazon CloudFront
└── Distribution
    ├── Frontend origin
    └── Media origin

Amazon API Gateway
└── HTTP API

AWS Lambda
└── DevPortal backend

Amazon DynamoDB
└── DevPortal table

Amazon SES
└── Email configuration

Amazon Route 53
└── Hosted zone / DNS

AWS Certificate Manager
└── TLS certificate

AWS IAM
└── Lambda/resource permissions
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
Private S3 Bucket
    │
    ▼
CloudFront
    │
    ▼
https://your-domain.com
```

---

# ⚙️ Backend Deployment Flow

```text
backend/
    │
    ▼
TypeScript build
    │
    ▼
Lambda package
    │
    ▼
S3 artifact bucket
    │
    ▼
AWS Lambda
    │
    ▼
API Gateway
```

---

# 🌐 Custom Domain

DevPortal supports domains such as:

```text
https://yourdomain.com
https://www.yourdomain.com
```

The architecture is:

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
S3
```

CloudFront uses an ACM certificate for HTTPS.

For CloudFront, the certificate must be available in:

```text
us-east-1
```

---

# 📧 Amazon SES

SES is used for transactional email.

Before using email functionality:

1. Verify the sender identity.
2. Check SES sending status.
3. If the account is in the SES sandbox, verify required recipient addresses or request production access.
4. Configure the sender in Terraform.
5. Test contact/reply functionality.

Example:

```hcl
email_from = "you@example.com"
```

For production, a verified domain identity can be used.

---

# 🗄️ Database

DevPortal uses Amazon DynamoDB with a single-table style design.

The application uses:

- Partition keys
- Sort keys
- Global Secondary Indexes
- Entity-type attributes
- Audit logging

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

The primary key structure uses:

```text
PK
SK
```

with:

```text
GSI1
GSI2
```

---

# 🖼️ Media Architecture

Media is stored separately from the frontend.

```text
Frontend S3
    │
    └── React build

Media S3
    │
    └── media/
         ├── image-1.png
         ├── image-2.jpg
         └── ...
```

The media bucket is private.

CloudFront provides controlled media delivery:

```text
https://yourdomain.com/media/...
```

---

# 🔒 Security

## Application Security

- JWT authentication
- bcrypt password hashing
- Zod request validation
- Helmet security headers
- CORS
- Rate limiting
- Structured logging
- Environment-based secrets

## AWS Security

- IAM roles
- Private S3 buckets
- CloudFront Origin Access Control
- HTTPS
- ACM certificates
- DynamoDB server-side encryption
- DynamoDB point-in-time recovery
- Separate frontend and media storage

## Repository Security

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

Secrets must never be committed to Git.

Example backend variables:

```env
NODE_ENV=production
AWS_REGION=ap-south-1
DYNAMODB_TABLE=<production-table>
AWS_S3_BUCKET=<media-bucket>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```

The frontend should only contain public configuration values.

Never place AWS secret keys, JWT secrets, or other private credentials in frontend environment variables.

---

# 🧪 Pre-Deployment Checks

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

Repository:

```bash
git status
```

Make sure sensitive files are not tracked.

---

# 🗃️ Backup & Recovery

Database and media backups should be stored independently from the Terraform-managed infrastructure.

Terraform is an infrastructure management system, not a backup system.

The repository includes restoration support:

```text
terraform/restore.tf
terraform/scripts/restore_dynamodb.sh
```

A backup can be used to restore application data into a newly created environment.

Media can similarly be synchronized into the production media bucket.

Recommended model:

```text
Production
    │
    ├── DynamoDB
    └── S3 Media
          │
          ▼
Independent Backups
          │
          ▼
Recreate infrastructure if required
```

---

# 🔁 Recreating Infrastructure

The project is designed around reproducible Infrastructure as Code.

```text
Terraform configuration
        │
        ▼
terraform apply
        │
        ▼
AWS infrastructure
        │
        ▼
Restore application data if required
```

Recreation requires:

- AWS credentials
- Terraform variables
- Domain/DNS configuration
- ACM requirements
- Application source code
- Database backups where required
- Media backups where required

---

# 🗑️ Destroying Infrastructure

To remove Terraform-managed infrastructure:

```bash
terraform destroy
```

Review the proposed changes carefully before confirming.

**Do not treat `terraform destroy` as a backup operation.**

Keep database and media backups outside the infrastructure stack.

---

# 🐛 Troubleshooting

## Frontend cannot reach API

Check:

```env
VITE_API_BASE_URL
```

Also verify backend CORS configuration.

---

## CloudFront serves old frontend content

CloudFront may have cached previous content.

Create an invalidation when required:

```text
/*
```

---

## Media returns 403

Check:

- CloudFront `/media/*` behavior
- Media bucket policy
- Origin Access Control
- Object key
- CloudFront distribution
- S3 bucket privacy settings

---

## Lambda returns errors

Check CloudWatch Logs.

Common causes:

```text
DynamoDB permissions
S3 permissions
Environment variables
JWT secrets
SES permissions
CORS configuration
```

---

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

---

## DNS is not working

Check:

```bash
dig yourdomain.com
dig NS yourdomain.com
```

Verify that the domain is delegated to the intended DNS provider.

---

# 💰 AWS Cost Considerations

DevPortal uses primarily serverless AWS services and does not require a permanently running EC2 server.

Potential costs include:

- CloudFront
- S3 storage
- S3 requests
- Lambda invocations
- API Gateway requests
- DynamoDB usage
- SES email sending
- Route 53 hosted zone
- Data transfer

Actual costs depend on traffic, storage, requests, email volume, and current AWS pricing.

Always check current AWS pricing before deploying.

---

# 🔄 Updating the Application

For application-code changes:

```text
Edit source
    ↓
Run tests
    ↓
Build frontend/backend
    ↓
Commit changes
    ↓
Terraform deployment
    ↓
AWS
```

For portfolio-content changes:

```text
Admin Panel
    ↓
Save
    ↓
DynamoDB / S3
    ↓
Portfolio
```

This means normal content updates do not require changing the source code.

---

# 🧑‍💻 Recommended Portfolio Setup

After deploying your own instance:

### 1. Configure your profile

Admin Panel → Settings

### 2. Configure About

Add your professional introduction.

### 3. Create skill categories

For example:

```text
Cloud
DevOps
Security
Programming
Databases
Networking
```

### 4. Add skills

Add your individual skills.

### 5. Add projects

Create your portfolio projects.

### 6. Upload project images

Use the Media functionality.

### 7. Add case studies

Document important projects in detail.

### 8. Add blog posts

Publish technical articles.

### 9. Configure social links

Add GitHub, LinkedIn, X/Twitter, and other links.

### 10. Configure your resume

Add your resume URL.

### 11. Test contact functionality

Submit a test message from the public portfolio.

### 12. Verify email

Confirm that transactional email works correctly.

---

# 🧠 Why DevPortal?

Traditional developer portfolios often require developers to edit source code whenever they want to change their content.

DevPortal separates:

```text
Application Code
       +
Portfolio Content
```

The application defines how the portfolio works.

DynamoDB stores what the portfolio says.

S3 stores media.

The Admin Panel provides a UI for managing the content.

This makes the portfolio easier to maintain as it grows.

---

# 🎯 Project Goals

DevPortal demonstrates practical experience with:

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

# 🤝 Using This Project

You can use DevPortal as the foundation for your own developer portfolio.

The basic process is:

```text
Clone
  ↓
Configure AWS
  ↓
Configure domain
  ↓
Deploy with Terraform
  ↓
Open Admin Panel
  ↓
Replace portfolio content
  ↓
Upload your media
  ↓
Add projects
  ↓
Add skills
  ↓
Add case studies
  ↓
Add blog posts
  ↓
Publish
```

You can also modify the React frontend if you want a completely different visual design while keeping the existing backend and AWS architecture.

---

# 📜 License

This project is a personal developer portfolio platform and project showcase.

Review the licenses of third-party dependencies before redistribution or commercial reuse.

---

# 👨‍💻 Author

**Vijay Rangnath Waghmare**

Developer focused on:

- Cloud
- DevOps
- Cloud Security
- Cybersecurity
- Linux
- Kubernetes
- Infrastructure as Code
- AWS

### Portfolio

https://vijayvw.in
