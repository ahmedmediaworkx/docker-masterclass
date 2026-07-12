import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Code2,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode,
  Search,
  FileText,
  Database,
  Network,
  HelpCircle,
  Clock,
  ChevronRight,
  Terminal,
  FileJson
} from 'lucide-react';

interface ResourceLink {
  title: string;
  url: string;
  description: string;
  badge: string;
}

interface DockerfileTemplate {
  language: string;
  icon: string;
  description: string;
  code: string;
}

interface DocArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  takeaway: string;
  codeBlock?: string;
  codeLanguage?: string;
  readTime: string;
}

export const ResourcesView: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<string>('node');
  const [activeMainTab, setActiveMainTab] = useState<'docs' | 'templates' | 'links'>('docs');
  
  // Search and filter state for Docker Docs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('getting-started');

  const links: ResourceLink[] = [
    {
      title: "Official Docker Reference Guide",
      url: "https://docs.docker.com/get-started/",
      description: "Comprehensive step-by-step documentation, architectural charts, and installation binaries for Docker Desktop.",
      badge: "Official"
    },
    {
      title: "Best Practices for Dockerfiles",
      url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
      description: "Docker's gold-standard guide to structuring Dockerfile commands, caching layers, and minimizing image sizes.",
      badge: "Security & Optimization"
    },
    {
      title: "Multi-stage Builds Documentation",
      url: "https://docs.docker.com/build/building/multi-stage/",
      description: "Learn how to use multi-stage builds to keep build tools out of final production images and save gigabytes of space.",
      badge: "Advanced Architecture"
    },
    {
      title: "Play with Docker (Free Sandbox)",
      url: "https://labs.play-with-docker.com/",
      description: "A free, browser-based online playground that gives you access to real Linux terminal instances with Docker pre-installed.",
      badge: "Interactive Lab"
    }
  ];

  const templates: DockerfileTemplate[] = [
    {
      language: "node",
      icon: "🟢",
      description: "Optimized Node.js Multi-Stage Production Build. Uses a secure, non-root user and an Alpine lightweight base image.",
      code: `# --- STAGE 1: Build & Dependencies ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# --- STAGE 2: Secure Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Apply least-privilege security principle: run as non-root user
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]`
    },
    {
      language: "python",
      icon: "🐍",
      description: "Clean Python 3.11 Production Template. Disables bytecode generation, enables stdout/stderr streaming, and avoids running as root.",
      code: `# --- STAGE 1: Build Dependencies ---
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# --- STAGE 2: Safe Runtime ---
FROM python:3.11-slim AS runner
WORKDIR /app

# Configure Python execution flags for containers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH=/root/.local/bin:$PATH

COPY --from=builder /root/.local /root/.local
COPY . .

# Create a dedicated app user for enhanced isolation
RUN useradd -u 8888 appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["python", "main.py"]`
    },
    {
      language: "go",
      icon: "🔵",
      description: "Hyper-optimized Go Container. Compiles the binary in a Go build env, and drops it into a scratch (empty) container. Final size: < 20MB!",
      code: `# --- STAGE 1: Build Binary ---
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Compile statical link binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

# --- STAGE 2: Minimalist Scratch Image ---
FROM scratch
WORKDIR /
# Copy SSL certificates for HTTPS networking
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/main /main

EXPOSE 8080
ENTRYPOINT ["/main"]`
    },
    {
      language: "dockerignore",
      icon: "📄",
      description: "Standard production-grade .dockerignore file. Keeps heavy libraries, git histories, local development configurations, and secrets out of your build context.",
      code: `# Folders to ignore
node_modules/
venv/
.env
.git
.github
dist/
build/
*.log
npm-debug.log*

# Configs & Secrets
.env*
Dockerfile
docker-compose*.yml
README.md`
    }
  ];

  const articles: DocArticle[] = [
    {
      id: "getting-started",
      title: "Containerizing Your First Application",
      category: "Getting Started",
      readTime: "3 min read",
      summary: "The official standard for packing code, environments, and binary engines into lightweight, portable, run-anywhere container images.",
      content: [
        "To build your first container, you must document your environment setup in a standard recipe file called a Dockerfile. Each line inside this file represents an explicit step in creating your software environment.",
        "Docker reads this file sequentially from top to bottom. Every instruction creates a read-only filesystem layer under the hood. When you compile the Dockerfile, the background engine stacks these layers on top of each other, caching them so subsequent builds complete in milliseconds.",
        "Once built, this frozen blueprint is called a 'Docker Image'. You can share it to Docker Hub or copy it directly to production. When run, it boots as a native isolated process on the host computer's processor in less than 200 milliseconds."
      ],
      takeaway: "Images are immutable blueprints. They store everything but run nothing. Containers are active instances launched from those blueprints.",
      codeBlock: `# 1. Choose a minimal verified parent base image
FROM node:20-alpine

# 2. Establish a secure working directory inside
WORKDIR /app

# 3. Copy package listings and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# 4. Copy the remaining application source files
COPY . .

# 5. Document the networking port used by the process
EXPOSE 3000

# 6. Define the runtime start command
CMD ["node", "index.js"]`,
      codeLanguage: "dockerfile"
    },
    {
      id: "dockerfile-best-practices",
      title: "Dockerfile Gold-Standard Best Practices",
      category: "Best Practices",
      readTime: "4 min read",
      summary: "Security, caching efficiency, and image size optimization guidelines straight from the Docker core documentation team.",
      content: [
        "Building production-ready Dockerfiles is an art of speed and safety. Unoptimized Dockerfiles lead to slow build pipelines, massive server costs, and wide security vulnerability surfaces.",
        "Rule 1: Always pin explicit version tags. Never use the 'latest' tag because it changes unpredictably over time, which breaks build reproducibility. Pin down to the minor release, like 'node:20.11.0-alpine'.",
        "Rule 2: Minimize layer count. Combine related commands inside a single RUN statement using bash chainers (&&) and backslashes (\\). This avoids creating unnecessary read-only layers.",
        "Rule 3: Order commands by change frequency. Copy your dependency lists (package.json, requirements.txt) and run installers BEFORE copying your main code. Since dependencies change less often than code, Docker will cache the heavy install layer, shortening build times."
      ],
      takeaway: "A well-optimized Dockerfile can reduce container image sizes from 800MB to less than 50MB and slash compile times from 5 minutes to 2 seconds.",
      codeBlock: `# BAD: Inefficient caching and heavy root user
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]

# GOOD: Pin-point tags, cached installs, and least-privilege security
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]`,
      codeLanguage: "dockerfile"
    },
    {
      id: "multi-stage-builds",
      title: "Multi-Stage Build Architecture",
      category: "Architecture",
      readTime: "4 min read",
      summary: "How to use separate compile and runtime stages to keep heavy build toolchains out of your secure production container environments.",
      content: [
        "In modern full-stack development, compilers, testing engines, and build packages (like TypeScript compilers, Go build libraries, or Java JDKs) are necessary to compile code, but completely useless at runtime.",
        "Multi-stage builds let you declare multiple 'FROM' statements inside a single Dockerfile. You run a heavy, tool-rich builder stage to compile your binary or pack your static distribution files.",
        "In the next stage, you boot a clean, ultra-lightweight runtime container (like alpine or scratch) and copy ONLY the compiled binaries or HTML distribution files from the builder stage. The heavy toolchain is discarded, keeping production images compact, fast to download, and incredibly secure."
      ],
      takeaway: "By throwing away development-only compilers at build-time, you reduce your production attack surface by 90% and save gigabytes of cloud registry storage.",
      codeBlock: `# STAGE 1: Compile TypeScript in Node build context
FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build # Outputs JS code into /build/dist

# STAGE 2: Deploy compiled JS into a clean, minimal runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /build/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
      codeLanguage: "dockerfile"
    },
    {
      id: "namespaces-cgroups",
      title: "Under the Hood: Namespaces & Cgroups",
      category: "Architecture",
      readTime: "3 min read",
      summary: "How Docker builds lightweight visual illusions and resource budgets inside the Linux kernel to run containers without VMs.",
      content: [
        "Many developers assume containers run inside microscopic virtual hypervisors. In reality, a container is simply a standard native process executing directly on your host CPU, wrapped in two Linux kernel primitives: Namespaces and Control Groups.",
        "Namespaces provide isolation (the blindfolds). There are several types: PID namespace (prevents seeing processes outside the container), NET namespace (provides independent network interfaces, routes, and ports), MOUNT namespace (locks the container into its private filesystem), and USER namespace (maps container-root to a safe, unprivileged host user).",
        "Control Groups (Cgroups) provide resource caps (the budget). Cgroups restrict how much physical RAM, CPU cycles, and disk I/O rates a container can draw from the host. This prevents a single compromised or buggy container from crashing the entire host server."
      ],
      takeaway: "A container is not a machine—it is a native Linux process dressed up to believe it is a private computer, operating with a designated budget of resources.",
      codeBlock: `# Inspect a container's system cgroups and isolation limits
$ docker inspect active-container | grep -i -E "Memory|Cpu"

# Dynamically view real-time CPU, RAM, and IO usage of all running containers
$ docker stats`,
      codeLanguage: "bash"
    },
    {
      id: "persistent-volumes",
      title: "Solving Container Amnesia: Docker Volumes",
      category: "Storage & Network",
      readTime: "3 min read",
      summary: "How to decouple database files, media directories, and system logs from the temporary, disposable container filesystems.",
      content: [
        "Containers are architected to be completely ephemeral (disposable). The topmost layer of a container is a temporary 'Read-Write' layer. Any file created, modified, or written during runtime resides in this layer.",
        "When a container is deleted or upgraded, this thin Read-Write layer is permanently wiped out. If you are running a database, your customer tables and records vanish into the void.",
        "Docker volumes solve container amnesia by mapping a directory on your physical host machine inside the container's isolated folder tree. Any database updates bypass the temporary layer and are written directly to the persistent host disk, surviving container upgrades and reinstalls."
      ],
      takeaway: "Volumes act like an external USB hard drive plugged into your container apartment. The apartment can be demolished, but the files on the hard drive remain perfectly safe.",
      codeBlock: `# 1. Create a named volume for a persistent Postgres DB
$ docker volume create pg-data-volume

# 2. Run database container with the volume mounted on Postgres's internal storage path
$ docker run -d \\
  --name production-db \\
  -v pg-data-volume:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=securepassword123 \\
  postgres:alpine`,
      codeLanguage: "bash"
    },
    {
      id: "bridge-networks",
      title: "Container Communication & Bridge Networks",
      category: "Storage & Network",
      readTime: "3 min read",
      summary: "How containers establish secure, private virtual switchboards to talk to each other without exposing ports to the open internet.",
      content: [
        "By default, containers operate in complete network isolation. A web server container cannot ping or communicate with a database container unless explicitly linked.",
        "Docker solves this by establishing private virtual switchboards called 'Bridge Networks'. When containers are attached to the same custom bridge network, Docker automatically registers an internal DNS resolver.",
        "This DNS resolver lets containers locate and communicate with each other using their container names as hostnames! For example, Devon's web container can connect to Postgres using 'mongodb://db-service:27017' securely, without exposing any database ports to the physical host laptop or the open public internet."
      ],
      takeaway: "Always create custom user-defined bridge networks for your app stacks. Default networks lack automatic container name DNS resolution, forcing you to use fragile IP addresses.",
      codeBlock: `# 1. Create a secure, user-defined private bridge network
$ docker network create app-network

# 2. Run the database attached to the network (port is kept private)
$ docker run -d --name db-service --network app-network mongo:alpine

# 3. Run the web backend on the same network, forwarding public port 80
$ docker run -d --name web-backend --network app-network -p 80:3000 backend-image`,
      codeLanguage: "bash"
    },
    {
      id: "docker-compose-spec",
      title: "Docker Compose Specification Guides",
      category: "Docker Compose",
      readTime: "4 min read",
      summary: "Documenting multi-service application ecosystems, dependency orders, and infrastructure mapping in clean, repeatable YAML files.",
      content: [
        "As application stacks grow, manually running multiple 'docker run' commands with networks, ports, environment secrets, and volume paths becomes a highly error-prone headache.",
        "Docker Compose solves this by documenting your entire application ecosystem inside a single plain-text YAML configuration file called 'docker-compose.yml'.",
        "Inside this file, you declare 'services' (each representing a container), network configurations, and storage volumes. With a single terminal instruction, 'docker-compose up -d', the Compose engine automatically builds networks, provisions volumes, pulls images, and boots your entire multi-container stack in the correct dependency sequence."
      ],
      takeaway: "Docker Compose is Infrastructure as Code for development environments. It allows you to check your local server stack directly into your Git source repository.",
      codeBlock: `version: '3.8'

services:
  # The web application service
  web:
    build: .
    ports:
      - "80:3000"
    depends_on:
      - db
    networks:
      - app-net

  # The PostgreSQL database service
  db:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: production_secret
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - app-net

volumes:
  pg-data:

networks:
  app-net:`,
      codeLanguage: "yaml"
    }
  ];

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(tabName);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const activeTemplate = templates.find(t => t.language === selectedTemplateTab) || templates[0];

  // Helper to render Category Icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started': return <BookOpen className="w-4 h-4 text-[#2496ed]" />;
      case 'Best Practices': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Architecture': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Storage & Network': return <Network className="w-4 h-4 text-[#00f0ff]" />;
      case 'Docker Compose': return <Layers className="w-4 h-4 text-pink-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  // Filter articles based on category and search query
  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = articles.find(art => art.id === selectedArticleId) || articles[0];

  const categories = ['All', 'Getting Started', 'Best Practices', 'Architecture', 'Storage & Network', 'Docker Compose'];

  return (
    <div className="space-y-6 text-[#ffffff] animate-fadeIn">
      {/* Tab Selector Navigation */}
      <div className="flex border-b border-[#113a5d]">
        <button
          onClick={() => setActiveMainTab('docs')}
          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'docs'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#0c2336]/40 font-bold'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-[#010915]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📚 DOCS EXPLORER</span>
        </button>
        <button
          onClick={() => setActiveMainTab('templates')}
          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'templates'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#0c2336]/40 font-bold'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-[#010915]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>🐳 PRODUCTION TEMPLATES</span>
        </button>
        <button
          onClick={() => setActiveMainTab('links')}
          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'links'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#0c2336]/40 font-bold'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-[#010915]'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>⚓ DIRECT REFERENCES</span>
        </button>
      </div>

      {/* RENDER TAB 1: DOCS.DOCKER.COM EXPLORER */}
      {activeMainTab === 'docs' && (
        <div className="space-y-6">
          {/* Search bar and categories list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#010915]/85 border border-[#113a5d] p-4 rounded-none">
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Docker Docs (e.g., volume, cache)..."
                className="w-full pl-9 pr-4 py-2 bg-[#020d1c] border border-[#113a5d] text-xs font-mono text-[#ffffff] focus:outline-none focus:border-[#00f0ff] transition-all rounded-none"
              />
            </div>
            <div className="lg:col-span-8 flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-none border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2496ed]/25 border-[#2496ed] text-[#00f0ff] font-bold'
                      : 'bg-[#020d1c] border-[#113a5d]/70 text-slate-400 hover:text-white hover:border-[#113a5d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Documentation Split-View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left side: List of articles */}
            <div className="lg:col-span-4 border border-[#113a5d] bg-[#010915]/65 overflow-y-auto max-h-[500px] divide-y divide-[#113a5d]/60 rounded-none shadow-xl">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(art => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 rounded-none relative ${
                      selectedArticleId === art.id
                        ? 'bg-[#0c2336]/60 text-white'
                        : 'hover:bg-[#0c2336]/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    {/* Left glowing select border */}
                    {selectedArticleId === art.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff]" />
                    )}
                    
                    <div className="shrink-0 mt-0.5">
                      {getCategoryIcon(art.category)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8px] font-mono uppercase text-[#00f0ff] tracking-wider truncate font-semibold">
                          {art.category}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 shrink-0">
                          {art.readTime}
                        </span>
                      </div>
                      <h4 className="font-mono text-[11px] uppercase tracking-tight font-bold truncate">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-normal font-sans">
                        {art.summary}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 self-center" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center space-y-2 text-slate-400">
                  <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-mono uppercase tracking-wider">No Documentation Found</p>
                  <p className="text-[10px] font-sans">Try searching for other Docker keywords or clear the category filter.</p>
                </div>
              )}
            </div>

            {/* Right side: Reading Pane */}
            <div className="lg:col-span-8 liquid-glass border border-[#113a5d] p-5 md:p-6 rounded-none space-y-5 shadow-2xl relative min-h-[420px]">
              {/* Corner indicators for decorative style */}
              <div className="absolute top-3 right-3 text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                DOCS.DOCKER.COM // REF-{activeArticle.id.toUpperCase()}
              </div>

              {/* Category Badge & Read Time */}
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] border border-[#113a5d] font-mono text-[8px] uppercase tracking-widest font-bold">
                  {activeArticle.category}
                </span>
                <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2496ed]" />
                  {activeArticle.readTime}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-md md:text-lg font-mono text-[#ffffff] font-bold uppercase tracking-tight">
                  {activeArticle.title}
                </h3>
                <div className="bg-[#020d1c] border-l-2 border-[#00f0ff] p-3 text-xs text-cyan-100/90 leading-relaxed font-mono flex items-start gap-2.5">
                  <div className="shrink-0 mt-0.5">ℹ️</div>
                  <p>{activeArticle.summary}</p>
                </div>
              </div>

              {/* Rich Body Content */}
              <div className="space-y-3.5 text-xs text-[#c2d6e8] leading-relaxed font-sans">
                {activeArticle.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Code block if exists */}
              {activeArticle.codeBlock && (
                <div className="border border-[#113a5d] rounded-none overflow-hidden flex flex-col bg-[#010915]/90 relative shadow-inner">
                  {/* Code header bar */}
                  <div className="bg-[#0c2336] px-4 py-2 flex justify-between items-center border-b border-[#113a5d]">
                    <div className="flex items-center gap-2">
                      {activeArticle.codeLanguage === 'dockerfile' ? (
                        <FileCode className="w-3.5 h-3.5 text-[#2496ed]" />
                      ) : activeArticle.codeLanguage === 'yaml' ? (
                        <FileJson className="w-3.5 h-3.5 text-pink-400" />
                      ) : (
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        {activeArticle.codeLanguage === 'dockerfile' ? 'Dockerfile Reference Blueprint' : activeArticle.codeLanguage === 'yaml' ? 'docker-compose.yml Reference' : 'Terminal Diagnostics'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(activeArticle.codeBlock!, activeArticle.id)}
                      className="px-2.5 py-1 bg-[#010915] hover:bg-[#0c2336] text-[#00f0ff] border border-[#113a5d] font-mono text-[8px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === activeArticle.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          COPIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          COPY CODE
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actual Code Pre */}
                  <pre className="p-4 overflow-x-auto text-[10px] md:text-[11px] font-mono text-cyan-200/90 leading-relaxed bg-black/40 select-all max-h-[220px]">
                    <code>{activeArticle.codeBlock}</code>
                  </pre>
                </div>
              )}

              {/* Key takeaway card */}
              <div className="bg-gradient-to-r from-[#010915]/40 to-[#0c2336]/40 border border-[#113a5d] p-4 text-xs flex items-start gap-3 rounded-none">
                <div className="text-xl shrink-0 mt-0.5">⚓</div>
                <div className="space-y-1">
                  <h5 className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Docs.docker.com Key takeaway</h5>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">{activeArticle.takeaway}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 2: COPYABLE TEMPLATES PLAYGROUND */}
      {activeMainTab === 'templates' && (
        <div className="liquid-glass corner-box p-5 md:p-6 rounded-none space-y-5 shadow-2xl">
          <div className="corner-box-bottom" />
          <div className="space-y-1">
            <h4 className="text-sm font-mono text-[#ffffff] uppercase tracking-wider font-bold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#2496ed]" />
              PRODUCTION DEPLOYMENT BLUEPRINTS 🐳
            </h4>
            <p className="text-xs text-[#c2d6e8]">
              Select a technology to view and copy an optimized, production-hardened containerization recipe.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex flex-wrap gap-1 border-b border-[#113a5d]/60 pb-2">
            {templates.map(temp => (
              <button
                key={temp.language}
                onClick={() => setSelectedTemplateTab(temp.language)}
                className={`px-3.5 py-2 text-[10px] font-mono uppercase tracking-wider rounded-none border transition-all cursor-pointer ${
                  selectedTemplateTab === temp.language
                    ? 'bg-[#2496ed] border-[#2496ed] text-white font-bold shadow-[0_0_8px_rgba(36,150,237,0.4)]'
                    : 'bg-[#010915] border-transparent text-[#969696] hover:text-[#ffffff] hover:border-[#113a5d]'
                }`}
              >
                <span className="mr-1">{temp.icon}</span>
                {temp.language.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Description Pill */}
          <div className="bg-[#010915] border border-[#113a5d]/70 p-4 text-xs text-[#c2d6e8] leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>{activeTemplate.description}</p>
          </div>

          {/* Code Block Container */}
          <div className="border border-[#113a5d] rounded-none overflow-hidden flex flex-col bg-[#010915]/90 relative shadow-inner">
            {/* Code Header bar */}
            <div className="bg-[#0c2336] px-4 py-2.5 flex justify-between items-center border-b border-[#113a5d]">
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-[#2496ed]" />
                <span className="text-[9px] font-mono text-[#969696] uppercase tracking-widest font-bold">
                  {selectedTemplateTab === 'dockerignore' ? '.dockerignore' : 'Dockerfile'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(activeTemplate.code, activeTemplate.language)}
                className="px-3 py-1 bg-[#010915] hover:bg-[#0c2336] text-[#00f0ff] border border-[#113a5d] font-mono text-[9px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedText === activeTemplate.language ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    COPIED!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    COPY CODE
                  </>
                )}
              </button>
            </div>

            {/* Actual Code Textarea */}
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-cyan-200/90 leading-relaxed bg-black/40 select-all max-h-[280px]">
              <code>{activeTemplate.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* RENDER TAB 3: REFERENCE LINKS & BEST PRACTICE GUIDES */}
      {activeMainTab === 'links' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 liquid-glass corner-box hover:border-[#00f0ff] hover:bg-[#0c2336]/30 rounded-none transition-all duration-300 cursor-pointer relative"
            >
              <div className="corner-box-bottom" />
              <div className="flex justify-between items-start mb-2.5">
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] border border-[#113a5d] font-mono text-[8px] uppercase tracking-wider rounded-none font-bold">
                  {link.badge}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8f8f8f] group-hover:text-[#00f0ff] transition-colors" />
              </div>
              <h5 className="font-mono text-xs md:text-sm text-[#ffffff] font-bold group-hover:text-[#00f0ff] transition-colors uppercase tracking-tight flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2496ed] shrink-0" />
                {link.title}
              </h5>
              <p className="text-xs text-[#c2d6e8] mt-2 leading-relaxed">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
