# AutoFlow Commander

> Interactive Automation Management Dashboard for Claude Code

AutoFlow Commander is a sophisticated web-based dashboard that allows users to upload, manage, execute, and monitor automation prompts with Claude Code, similar to managing Git repositories but for AI automation workflows.

![AutoFlow Commander](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## Features

### Core Features

- **Repository Management**: Create and manage automation repositories with Git-like version control
- **Prompt Editor**: Advanced editor with view, edit, and preview modes
- **Real-time Execution**: Execute automation prompts with live progress tracking
- **Claude Code Integration**: Direct integration with Claude Code via WebSocket
- **Task Monitoring**: Real-time monitoring of task execution with detailed logs
- **Execution History**: Track all prompt executions with comprehensive statistics
- **Resource Management**: Monitor CPU, memory, and disk usage during execution

### Advanced Features

- **Version Control**: Git-like branching, commits, and merging for prompts
- **Team Collaboration**: Role-based access control and team management
- **Complexity Levels**: Categorize prompts by complexity (Basic, Intermediate, Advanced, Enterprise)
- **Dependencies Management**: Define and track dependencies between prompts
- **Success Tracking**: Monitor execution success rates and performance metrics
- **Real-time Communication**: WebSocket-based real-time updates and notifications

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Prisma** - Modern ORM
- **PostgreSQL** - Relational database
- **Redis** - Caching and session management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/autoflow-commander.git
   cd autoflow-commander
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your environment:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/automation_db"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your-secret-key"
   NEXT_PUBLIC_WS_URL="ws://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development servers**

   Terminal 1 - Next.js Dashboard:
   ```bash
   npm run dev
   ```

   Terminal 2 - WebSocket Server:
   ```bash
   npm run server:dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec dashboard npx prisma migrate deploy
   ```

3. **Access the application**
   - Dashboard: `http://localhost:3000`
   - WebSocket Server: `ws://localhost:3001`
   - PostgreSQL: `localhost:5432`
   - Redis: `localhost:6379`

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## API Reference

### REST Endpoints

#### Repositories

- `GET /api/repositories` - List all repositories
- `POST /api/repositories` - Create new repository
- `GET /api/repositories/:id/prompts` - Get prompts in repository
- `POST /api/repositories/:id/prompts` - Create new prompt
- `GET /api/repositories/:id/executions` - Get execution history

#### Prompts

- `GET /api/prompts/:id` - Get prompt details
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

#### Executions

- `POST /api/executions` - Start new execution

#### Claude Integration

- `POST /api/claude/connect` - Connect to Claude Code

### WebSocket Events

#### Client → Server

- `claude:connect` - Establish Claude session
- `claude:message` - Send message to Claude
- `prompt:execute` - Execute automation prompt
- `task:cancel` - Cancel running task

#### Server → Client

- `claude:connected` - Session established
- `claude:message` - Message from Claude
- `task:started` - Execution started
- `task:progress` - Execution progress update
- `task:completed` - Execution completed
- `task:failed` - Execution failed

## Database Schema

### Core Models

- **User** - User accounts and authentication
- **Repository** - Automation repositories
- **Branch** - Git-like branches for version control
- **AutomationPrompt** - Automation prompt definitions
- **Execution** - Prompt execution records
- **ExecutionLog** - Detailed execution logs
- **ClaudeSession** - Claude Code sessions
- **ClaudeMessage** - Conversation history

See `prisma/schema.prisma` for complete schema definition.

## Development

### Project Structure

```
autoflow-commander/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DashboardHeader.tsx
│   ├── RepositorySidebar.tsx
│   ├── RepositoryView.tsx
│   ├── ClaudeCodePanel.tsx
│   ├── PromptEditor.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client
│   ├── redis.ts          # Redis client
│   └── utils.ts          # Helper functions
├── server/               # WebSocket server
│   └── index.ts          # Socket.IO server
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── docker-compose.yml    # Docker composition
├── Dockerfile            # Main Dockerfile
├── Dockerfile.websocket  # WebSocket Dockerfile
└── package.json          # Dependencies
```

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run server` - Start WebSocket server (production)
- `npm run server:dev` - Start WebSocket server (development)
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Future Enhancements

- [ ] Drag-and-drop prompt builder
- [ ] AI-powered prompt optimization
- [ ] Advanced team collaboration features
- [ ] OAuth authentication (Google, GitHub, Microsoft)
- [ ] Prompt marketplace
- [ ] Analytics dashboard
- [ ] Export/import functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the AutoFlow Commander Team**
