# 🚀 Vijay vw  — DevOps & Cloud Security Portfolio

A modern DevOps & Cloud Security portfolio built to showcase projects, infrastructure skills, cloud-native technologies, automation workflows, and production-ready deployments.

Designed with a cyber-inspired UI, responsive layouts, interactive components, and scalable frontend architecture.

---

# 🌐 Live Portfolio

```bash
Coming Soon
```

---

# 📌 About The Project

This portfolio represents my journey in:

* DevOps Engineering
* Cloud Infrastructure
* Infrastructure Automation
* Containerization & Orchestration
* CI/CD Workflows
* Cloud Security
* Modern Web Development

The project focuses on combining clean UI/UX with interactive technical content to showcase real-world engineering practices and continuous learning.

---

# ✨ Features

## 🎨 Portfolio Website

* Responsive modern UI
* Interactive animations
* Cyber-inspired terminal design
* Smooth transitions and effects
* Mobile-first layout

## 📖 Technical Blog

* Search and filtering functionality
* Featured technical articles
* Category-based organization
* Responsive blog experience

## 📊 Case Studies

* Detailed project breakdowns
* Infrastructure workflows
* Architecture explanations
* Deployment strategies
* Technology stack highlights

## ⚡ Interactive UI

* Animated backgrounds
* Reusable visual components
* Smooth hover interactions
* Responsive cards and layouts

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

## Data Layer (M5)

* Axios — typed API client, single instance in `src/api/client.ts`
* TanStack React Query — all server state (projects, blog posts, skills, case studies)
* Backend: DevPortal API (see `../backend`) — Projects, Blog, Skills, and Case Studies pages render live data from PostgreSQL via the backend's public read endpoints. The Contact form (M6) submits to the backend and is stored in PostgreSQL — no email is sent (by design, no email provider is integrated). The Contact page's sidebar info (email/phone/location) and the entire About page remain static — no backend content exists for either.

## Cloud & DevOps

* AWS
* Docker
* Kubernetes
* Terraform
* CI/CD Pipelines

## Development Tools

* Git & GitHub
* Linux
* VS Code

---

# 📂 Project Structure

```bash
src/
 ├── api/              # Axios client, typed DTOs, per-entity service functions
 │   └── services/
 ├── queries/           # React Query hooks + centralized queryKeys.ts
 ├── components/
 │   └── states/        # LoadingState, ErrorState, EmptyState (shared across pages)
 ├── pages/
 ├── hooks/
 ├── data/               # Static content with no backend table yet (hero text, contact info)
 ├── lib/
 └── assets/
```

---

# 🚀 Getting Started

As of M5, Projects/Blog/Skills/Case Studies pages fetch live data — the **backend must be running** (see `../backend/README.md`) for those pages to show data. Without it, each page shows its error state with a retry button rather than breaking.

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

## Install Dependencies

```bash
npm install
```

## Configure the API URL

`.env.development` is already committed with `VITE_API_BASE_URL=http://localhost:4000/api/v1`, matching the backend's default port. Change it if your backend runs elsewhere.

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

---

# 🌍 Deployment

This portfolio can be deployed using:

* Vercel
* Netlify
* GitHub Pages
* AWS Amplify

---

# 📈 Portfolio Highlights

* DevOps-focused portfolio architecture
* Interactive technical blog
* Cloud-native project showcase
* Production-ready deployment workflow
* Modern scalable frontend structure

---

# 🎯 Purpose

The goal of this portfolio is to demonstrate:

* Technical skills
* Infrastructure knowledge
* Automation workflows
* Cloud-native engineering practices
* Problem-solving through real-world projects

---

# 📄 License

Personal Portfolio Project

---

# 👨‍💻 Author

Vijay vw

DevOps & Cloud Security Enthusiast passionate about automation, scalable infrastructure, cloud-native technologies, and modern engineering practices.
