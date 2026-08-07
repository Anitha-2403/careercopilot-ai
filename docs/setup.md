# CareerCopilot AI - Setup Guide

## Prerequisites

Install the following:

- Node.js (Latest LTS Version)
- Git
- Visual Studio Code

## Clone Repository

```bash
git clone <repository-url>
cd careercopilot-ai
```

## Client Setup

The client is built using HTML, CSS, and JavaScript.

Open the `client` folder and launch `index.html` in your browser or use Live Server.

## Server Setup

```bash
cd server
npm install
npm start
```

## Environment Variables

Copy:

```
.env.example
```

to

```
.env
```

and update the required values.

## Verify

- Client opens successfully
- Server starts without errors
- API endpoints respond correctly
- Navigation works