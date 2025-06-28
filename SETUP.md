# Nexus.ai - AI Career Mentor Setup Guide

## Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Nexus.ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (Neon)
DATABASE_URL=your_neon_database_url

# AI Services
GEMINI_API_KEY=your_gemini_api_key
TOGETHER_API_KEY=your_together_ai_key

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# ImageKit (File Uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# AssemblyAI (Speech Recognition)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

### 4. Database Setup
```bash
# Generate database migrations
npm run db:generate

# Push migrations to database
npm run db:push
```

### 5. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Complete Dependencies List

### Main Dependencies
```
@clerk/nextjs@^6.20.0
@google/generative-ai@^0.24.1
@inngest/agent-kit@^0.8.0
@langchain/community@^0.3.46
@langchain/core@^0.3.58
@neondatabase/serverless@^0.10.4
@radix-ui/react-accordion@^1.2.11
@radix-ui/react-avatar@^1.0.4
@radix-ui/react-dialog@^1.1.14
@radix-ui/react-dropdown-menu@^2.1.15
@radix-ui/react-popover@^1.1.5
@radix-ui/react-progress@^1.1.7
@radix-ui/react-separator@^1.1.1
@radix-ui/react-slot@^1.2.3
@radix-ui/react-tooltip@^1.1.7
assemblyai@^4.13.3
audio-encoder@^1.0.4
axios@^1.10.0
browser-env@^3.3.0
class-variance-authority@^0.7.1
clsx@^2.1.1
dotenv@^16.4.7
drizzle-orm@^0.39.1
imagekit@^6.0.0
inngest@^3.39.1
lucide-react@^0.474.0
moment@^2.30.1
next@15.2.3
pdf-parse@^1.1.1
react@^18.0.0
react-dom@^18.0.0
react-hook-speech-to-text@^0.8.0
react-markdown@^10.1.0
react-spinners@^0.17.0
react-webcam@^7.2.0
reactflow@^11.11.4
recordrtc@^5.6.2
sonner@^2.0.5
tailwind-merge@^3.0.1
tailwindcss-animate@^1.0.7
together-ai@^0.16.0
uuid@^11.1.0
```

### Development Dependencies
```
@types/node@^20
@types/react@^19
@types/react-dom@^19
drizzle-kit@^0.30.4
postcss@^8
tailwindcss@^3.4.1
tsx@^4.19.2
typescript@^5
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push migrations to database

## Features

- **AI Career Chat** - Interactive career guidance with AI
- **Resume Analyzer** - AI-powered resume analysis
- **Mock Interviews** - AI-driven interview practice
- **Career Roadmap Generator** - Personalized career paths
- **Cover Letter Generator** - AI-assisted cover letters
- **Contest Tracker** - Coding contest management

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install` again
2. **Database connection issues**: Check your `DATABASE_URL` in `.env.local`
3. **Authentication errors**: Verify Clerk keys in `.env.local`
4. **Build errors**: Clear `.next` folder and run `npm run build` again

### Clear Cache
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## Support

If you encounter any issues, check:
1. Node.js version (should be 18+)
2. All environment variables are set correctly
3. Database is accessible
4. All dependencies are installed

For additional help, refer to the project documentation or create an issue in the repository. 