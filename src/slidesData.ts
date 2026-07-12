import { Slide } from './types';

export const slides: Slide[] = [
  {
    id: 1,
    title: "Docker Engine Architecture Masterclass",
    subtitle: "A Senior Architect's Production-First Guide to OS Virtualization & Container Isolation",
    category: "Introduction",
    type: "title",
    contentParagraphs: [
      "In modern distributed systems engineering, creating a reliable, consistent execution substrate across varying cloud environments and bare-metal configurations is paramount. Standard OS-level virtualization has completely decoupled software processes from physical hardware, resolving the issues of configuration drift and environmental impedance mismatch.",
      "This masterclass deconstructs the architectural primitives of Docker Engine (the primary client-server container engine). We will analyze the core systems layer, inspecting how the background Docker daemon (dockerd) communicates via REST API with the Docker CLI, manages namespaces and control groups, and structures layered filesystems.",
      "By examining comparative hardware matrices, detailed visual routing layers, and executing interactive system diagnostic labs, this curriculum provides the deep-dive technical insights required to deploy, scale, and secure resilient containers in high-density production environments."
    ],
    speakerNotes: "Welcome to the Docker Engine Architecture Masterclass. Today, we are moving beyond surface-level utility commands to analyze the underlying systems engineering of Docker. This guide is written from the perspective of a systems architect, focusing on system calls, kernel-level virtualization, resource density, and security isolation. We will walk through the core theoretical concepts and then apply them directly in our live terminal simulator."
  },
  {
    id: 2,
    title: "The Problem: Environmental Inconsistency",
    subtitle: "Understanding How Configuration Drift and Static Assemblies Imposed Massive Overhead",
    category: "Introduction",
    type: "text-content",
    bullets: [
      "The Matrix of Doom: Traditionally, deploying application stacks meant configuring diverse hardware, operating systems, library versions, database drivers, and local runtimes. Every additional app multiplied host-specific configuration combinations, resulting in an unmanageable matrix.",
      "The Standardized Shipping Analogy: Prior to 1956, cargo shipping was a slow, chaotic process of packing loose crates onto ships manually. Standardized intermodal steel containers revolutionized global trade by defining a standard envelope. Similarly, containerization encapsulates the application and its dependencies into a single, uniform package.",
      "The Docker Solution: Docker isolates applications from their underlying infrastructure. It packages the application code, required libraries, systems tools, configurations, and binary dependencies into an immutable image that runs identically across every environment.",
      "Eliminating Environmental Drift: By ensuring that the identical software assembly runs on local development machines, QA environments, and enterprise production nodes, Docker enforces absolute environment parity and eliminates 'works on my machine' errors."
    ],
    diagramId: "shipping-container",
    speakerNotes: "Configuration drift is the enemy of reliability. Just as the physical shipping container solved the logistics nightmare of manual packing by standardizing the physical envelope, Docker standardizes the software envelope. This ensures that the code runs on the same virtualized substrate everywhere, completely neutralizing the classic 'works on my machine' dilemma."
  },
  {
    id: 3,
    title: "Virtual Machines vs. Docker Containers",
    subtitle: "Analyzing Hardware Emulation and the Redundant Guest OS Architecture",
    category: "VMs vs Containers",
    type: "text-content",
    bullets: [
      "Hypervisor Emulation Layer: Virtual Machines (VMs) rely on a Hypervisor (Type 1 or 2) to emulate a full physical motherboard, including virtual CPU cores, memory banks, storage controllers, and network devices.",
      "Monolithic Guest OS: Every VM must boot and maintain a complete, separate Guest Operating System. This includes loading a secondary kernel into memory, launching private system services (init, journald, udev), and running separate package managers.",
      "Substantial Resource Tax: Emulating hardware signals and translating guest machine calls to host instructions imposes an overhead tax. Even an idle VM consumes hundreds of megabytes of RAM and substantial CPU clock cycles.",
      "Coarse-Grained Scaling: Scaling a VM requires pre-allocating gigabytes of virtual storage and memory, and takes minutes to initialize. This slow, heavy-weight execution boundary limits host compute density and limits horizontal scaling."
    ],
    diagramId: "vm-architecture",
    speakerNotes: "Virtual machines achieve isolation by virtualizing the physical hardware. This requires running an entire operating system on top of virtualized processors and memory. Consequently, VMs are slow to boot, resource-heavy, and place a severe performance tax on host density. In a modern microservices architecture, running dozens of VMs results in astronomical, wasted cloud infrastructure costs."
  },
  {
    id: 4,
    title: "Docker: Shared-Kernel OS Virtualization",
    subtitle: "Leveraging Native Linux Kernel Primitives for Lightweight, High-Density Isolation",
    category: "VMs vs Containers",
    type: "text-content",
    bullets: [
      "Eliminating Hardware Emulation: Docker containers bypass hypervisors and hardware emulation entirely. Instead of virtualizing the hardware, containers virtualize the operating system, sharing the exact same Host OS kernel.",
      "Native Process Speed: A Docker container is a set of standard Linux processes running directly on the host machine's hardware. Because there is no hardware translation layer, containers achieve near bare-metal CPU, I/O, and network performance.",
      "Sub-Second Initialization: Since there is no secondary guest kernel to boot and initialize, containerized processes launch in milliseconds—starting up as fast as a standard native command.",
      "Maximized Compute Density: Because containers share the host kernel and don't require pre-allocated guest OS memories, they use only the RAM needed by the application itself (often less than 30MB), allowing developers to fit hundreds of containers on a single physical host."
    ],
    diagramId: "container-architecture",
    speakerNotes: "Containers achieve isolation by virtualizing the operating system rather than the physical hardware. By sharing the host kernel, they eliminate the hypervisor translation layer entirely. A container is literally just a sandboxed Linux process running at bare-metal speed, making it incredibly lightweight, fast to scale, and highly dense."
  },
  {
    id: 5,
    title: "Comparative Architectural Matrix",
    subtitle: "Evaluating Resource Footprints, Boot Latencies, and Security Boundaries",
    category: "VMs vs Containers",
    type: "comparison",
    comparisonData: [
      { feature: "Operating System", vm: "Heavy Guest OS inside every single VM", container: "Shares Host OS kernel (No second OS needed)", winner: "Container" },
      { feature: "Boot-up Speed", vm: "Minutes (reboots complete operating system)", container: "Milliseconds (instantly starts app process)", winner: "Container" },
      { feature: "Memory / Disk Size", vm: "Huge (Gigabytes of disk & Guest RAM maps)", container: "Very Tiny (Megabytes of disk & process RAM only)", winner: "Container" },
      { feature: "Security Isolation", vm: "Hardware level (Highly secure, hypervisor boundary)", container: "Process level (Slightly weaker, shared syscalls)", winner: "VM" },
      { feature: "Server Density", vm: "Low (Limited VM instances per compute node)", container: "Ultra High (Run 200+ containers on same host)", winner: "Container" },
      { feature: "Horizontal Scaling", vm: "Slow, manual system provisioning required", container: "Ephemeral, instant automated cloud scaling", winner: "Container" }
    ],
    speakerNotes: "When we compare the two, containers win across almost every operational metric, particularly speed, boot latency, and resource density. However, from a security standpoint, VMs remain the gold standard for untrusted multi-tenant workloads. Because a container shares the host kernel, a kernel-level exploit could theoretically compromise the entire host, whereas a VM's hypervisor presents a hardware-level boundary."
  },
  {
    id: 6,
    title: "Unlocking Peak Host Compute Density",
    subtitle: "How Container Shared-Resource Mechanics Outperform Monolithic Architectures",
    category: "VMs vs Containers",
    type: "diagram",
    diagramId: "performance-charts",
    bullets: [
      "Instantaneous Elastic Scaling: Under massive traffic spikes, spawning new virtual machines is too slow. Docker containers scale horizontally in seconds, allowing systems to instantly match variable consumer demand.",
      "Shared Host Memory Maps: In standard host environments, virtual machines lock away massive swaths of physical RAM. Docker containers share the host's memory pages dynamically, returning unused resources back to the host kernel.",
      "Optimized Image Layer Sharing: While virtual machines require gigabytes of separate, redundant disk files, Docker images utilize Copy-on-Write layering. Multiple containers share the same read-only base layers on disk, compressing storage footprints by up to 95%.",
      "Dramatic Infrastructure Cost Savings: By packing application processes tightly onto shared host nodes, Docker increases compute density, reduces idle hardware overhead, and reduces cloud hosting costs by up to 90%."
    ],
    speakerNotes: "Compute density is the primary financial driver for containerization. In traditional VM deployment models, servers run at 10-15% CPU utilization because we must over-provision for peak loads. Containers allow us to pack workloads together tightly, driving host utilization much higher and slashing infrastructure bills by up to 90%."
  },
  {
    id: 7,
    title: "The System Call Interface (Syscalls)",
    subtitle: "Interfacing Userland Applications Directly to Host Metal via the ABI",
    category: "VMs vs Containers",
    type: "text-content",
    bullets: [
      "The Kernel as Hardware Arbiter: The operating system kernel manages all hardware interactions, such as scheduling process threads on CPU cores, allocating memory blocks, reading/writing disk blocks, and sending network packets.",
      "The System Call Interface (Syscalls): When an application in the user space (userland) needs physical resource access, it triggers a system call (syscall) to transition execution into the privileged kernel space.",
      "Direct Syscall Execution: Processes inside a Docker container execute syscalls directly on the host kernel. This direct execution path avoids hypervisor translation, maintaining maximum bare-metal speed.",
      "Cross-Platform Emulation (macOS & Windows): Since Docker containers depend on a Linux kernel, running them on macOS or Windows requires a highly-optimized, lightweight virtual machine (like WSL2 on Windows or Virtualization.framework on macOS) to expose the necessary Linux ABI."
    ],
    diagramId: "kernel-syscalls",
    speakerNotes: "Understanding the system call interface is key. In a virtual machine, the guest kernel intercepts a system call, translates it, and passes it to the hypervisor, which then passes it to the host kernel. In Docker, the application process inside the container makes a direct system call to the host kernel. This direct path is why containerization is called 'operating-system-level virtualization'."
  },
  {
    id: 8,
    title: "Underlying Technology: Namespaces & Cgroups",
    subtitle: "Constructing Process-Level Isolation Barriers and Hardware Budgeting",
    category: "Terminology",
    type: "text-content",
    bullets: [
      "Docker's Underlying Core: Docker is written in Go and leverages advanced features of the Linux kernel (Namespaces, Control Groups, UnionFS) to build a secure, lightweight virtualization layer.",
      "Linux Namespaces (The Isolation Layer): Docker uses namespaces to provide the isolated workspace called the container. These include: `pid` (process ID isolation), `net` (network interface isolation), `ipc` (IPC resource access isolation), `mnt` (filesystem mount point isolation), `uts` (host and domain name isolation), and `user` (user/group ID mapping).",
      "Control Groups / Cgroups (Resource Constraints): Docker Engine on Linux relies on `cgroups` to limit, account for, and isolate the resource usage (such as CPU, physical memory, disk I/O, and network bandwidth) of a collection of processes.",
      "The Container Format Wrapper: Docker combines namespaces, control groups, and UnionFS into a single wrapper called a container format. The default container format is `libcontainer` (managed via the Open Container Initiative's runtime engine `runc`)."
    ],
    diagramId: "namespaces-cgroups",
    speakerNotes: "Namespaces and Control Groups are the actual building blocks of containers. Namespaces govern visibility—ensuring a container cannot see other files, networks, or processes on the host. Cgroups govern resource consumption—ensuring a container cannot monopolize host memory or CPU. Docker is essentially a highly polished orchestration engine that automates these low-level kernel features."
  },
  {
    id: 9,
    title: "Docker Engine: Client-Server Architecture",
    subtitle: "How the CLI, REST API, and Daemon Orchestrate Container Lifecycles",
    category: "Docker Jargon-Free",
    type: "text-content",
    analogy: {
      title: "The Modern Automated Depot",
      jargonWord: "Docker Engine",
      simpleAnalogy: "Think of Docker Engine as an automated client-server packaging depot where the client requests services, the REST API translates specifications, and the backend foreman coordinates physical storage.",
      technicalReality: "A client-server application consisting of a persistent background daemon (dockerd), a REST API defining communication paths, and a command-line client (docker CLI) that interacts via the API."
    },
    bullets: [
      "The Docker Daemon (dockerd): A persistent background service running on the host OS. It manages all Docker objects, listens for REST API requests, and automates OS-level container isolation primitives.",
      "The REST API Layer: A system of standardized REST endpoints that specifies interfaces programs can use to instruct dockerd, decoupling the client controls from the heavy-lifting runtime.",
      "The Docker CLI Client: The user-facing command-line tool (`docker` command). It parses commands from user keyboards and fires off JSON payloads over REST API sockets to the running daemon."
    ],
    speakerNotes: "From an architectural perspective, Docker is a platform that wraps around the low-level Linux kernel primitives. It provides a standard toolchain to package, ship, run, and scale containerized systems cleanly, decoupling the application layer from the physical host."
  },
  {
    id: 10,
    title: "Docker Objects: Images & UnionFS",
    subtitle: "Deconstructing Immutable Layered Filesystems and Read-Only Blueprints",
    category: "Docker Jargon-Free",
    type: "text-content",
    analogy: {
      title: "The Version-Controlled Snapshot",
      jargonWord: "Docker Image",
      simpleAnalogy: "Like an immutable read-only disk snapshot (.iso) or a locked database template. It is fully static and serves as the structural foundation for executing active sandboxed container processes.",
      technicalReality: "An immutable, read-only template consisting of stacked, cached filesystem layers containing application files, library binaries, and configuration variables."
    },
    bullets: [
      "What is a Docker Image: A read-only template containing instructions for creating a Docker container. It includes application code, required runtimes, system tools, environment variables, and dependent libraries.",
      "Union File Systems (UnionFS): Docker Engine uses UnionFS (such as the default `overlay2` storage driver) to stack individual directories into a single unified filesystem. This is what makes images highly lightweight and fast.",
      "Layered Composition: Each instruction in a Dockerfile (like RUN, COPY, ADD) creates a read-only filesystem layer in the image. When you modify a file and rebuild, only the changed layer and subsequent layers are rebuilt, maximizing caching.",
      "Sharing and Reclaiming Space: Because images are immutable and read-only, multiple running containers share the same underlying base layers. Only the modifications are stored in each container's temporary read-write layer."
    ],
    speakerNotes: "Docker images are constructed using Union Filesystems (like overlay2). Each command in your build script creates a read-only layer. When you run 10 containers from the same image, they all point to the exact same read-only layers on disk, saving huge amounts of space. Immutability is the foundation of container scaling."
  },
  {
    id: 11,
    title: "Docker Objects: Containers & CoW",
    subtitle: "Deconstructing Runnable Instances and the Copy-on-Write Runtime Layer",
    category: "Docker Jargon-Free",
    type: "text-content",
    analogy: {
      title: "The Active Running Process",
      jargonWord: "Docker Container",
      simpleAnalogy: "The runnable instance instantiated from an image template. It runs as a sandboxed host process, mapping network ports and utilizing host compute resources within its designated resource budget.",
      technicalReality: "A runnable instance of an image. It is an isolated OS process managed by the Docker Engine, possessing its own read-write filesystem layer, virtual network interfaces, and resource limits."
    },
    bullets: [
      "What is a Docker Container: A runnable instance of a Docker image. You can create, start, stop, move, or delete a container using the Docker CLI or REST API. It is isolated from other containers and the host machine.",
      "The Thin Read-Write Layer: When you run a container, Docker Engine mounts a thin, temporary 'Read-Write' layer on top of the read-only image layers. Any runtime file modifications (writes, deletions, or edits) are saved in this container layer.",
      "Copy-on-Write (CoW) Mechanism: When a container process needs to modify a file in the read-only image layers, the engine copies the file to the top Read-Write layer and edits it there. The underlying image file is never altered.",
      "Disposable Computing States: Containers are completely ephemeral. When a container is deleted, its thin Read-Write layer is destroyed, and any unsaved state is purged. Persistent data must be stored in Docker Volumes."
    ],
    speakerNotes: "A container is a live process. The key concept here is ephemerality. The container's filesystem is temporary—writes go to a thin copy-on-write layer. If the container is deleted, that layer is destroyed. This ensures that application state is decoupled from the compute container."
  },
  {
    id: 12,
    title: "The Dockerfile: Declarative Build Recipes",
    subtitle: "Defining Systems Assembly Blueprints as Version-Controlled Source Files",
    category: "Docker Jargon-Free",
    type: "text-content",
    analogy: {
      title: "The Build Manifest",
      jargonWord: "Dockerfile",
      simpleAnalogy: "A declarative configuration manifest listing the precise system commands and environmental variables required to compile a custom container image.",
      technicalReality: "A plain-text configuration script containing a sequential list of commands and instructions that the Docker engine executes to compile a custom Docker image."
    },
    bullets: [
      "Declarative Build Scripts: A Dockerfile is a text document containing all the commands a user could call on the command line to assemble a custom image. It replaces manual server installation and configuration steps.",
      "Instruction Caching Mechanics: Docker Engine builds images by executing Dockerfile steps in order. If a step's instructions and dependencies haven't changed, the engine uses the cached layer from a previous build, speeding up CI/CD pipelines.",
      "Optimal Build Sequencing: To leverage build caching, you must sequence instructions from most static to most dynamic. For example, copy dependency lists (like `package.json`) and run installer commands *before* copying your active source code.",
      "Multi-Stage Build Paradigms: Modern Dockerfiles use multi-stage builds (`FROM ... AS ...`) to compile application binaries in a heavyweight SDK container, then copy only the compiled artifacts into a lightweight runtime container, reducing image sizes by up to 90%."
    ],
    speakerNotes: "The Dockerfile is your infrastructure-as-code recipe. Because it is declarative and fully automated, it eliminates manual server configuration. In this masterclass, we will learn how to optimize Dockerfile syntax to ensure fast build times and minimal production image sizes."
  },
  {
    id: 13,
    title: "Docker Registries: Distributing Blueprints",
    subtitle: "Centralized Systems to Store, Audit, and Deploy Standardized Container Images",
    category: "Docker Jargon-Free",
    type: "text-content",
    analogy: {
      title: "The Cloud Artifact Repository",
      jargonWord: "Docker Registry / Hub",
      simpleAnalogy: "An enterprise hosted registry where compiled images are stored, version-controlled, scanned for vulnerabilities, and pulled down by automated continuous deployment (CI/CD) pipelines.",
      technicalReality: "A centralized hosted service (such as Docker Hub, Amazon ECR, or GitHub Packages) for storing, categorizing, and pulling/pushing compiled Docker Images."
    },
    bullets: [
      "What is a Docker Registry: A centralized service that stores and distributes Docker images. Registries can be public (like Docker Hub, the default registry) or private (like Amazon ECR, Google Artifact Registry, or self-hosted registries).",
      "The Push-and-Pull Lifecycle: When you execute `docker pull` or `docker run`, the client instructs the daemon to download the required image layers from the registry. When you run `docker push`, the daemon uploads your local image layers.",
      "Vulnerability and Security Audits: Modern enterprise registries automatically scan uploaded image layers for known CVE vulnerabilities and package out-of-date dependencies, serving as a security gatekeeper.",
      "Edge Delivery and Cache Mirrors: High-performance architectures leverage geo-replicated private registries and local caching nodes to deliver images with sub-second pull latencies across global Kubernetes clusters."
    ],
    speakerNotes: "Registries are the distribution hubs. When deploying to clusters like Kubernetes, the nodes pull images directly from a registry. We must ensure our images are small and secure, with automated scanning workflows built directly into our deployment pipelines."
  },
  {
    id: 14,
    title: "Docker Services & Swarm Mode",
    subtitle: "Scaling Containers Across Multi-Host Cluster Daemons",
    category: "Terminology",
    type: "text-content",
    bullets: [
      "What are Docker Services: Docker services allow you to scale containers across multiple Docker daemons. A service defines the desired state, such as the number of container replicas, network ports to expose, and storage mounts.",
      "Swarm Mode Orchestration: Multiple Docker Engines can be joined together into a secure Cluster Swarm, divided into manager nodes (handling state and scheduling) and worker nodes (executing container workloads).",
      "Declarative State Enforcement: You define the desired service state (e.g., 'run 5 replicas of web proxy'). The swarm manager continuously monitors the cluster and automatically spins up new containers if a node fails.",
      "Overlay Network Mesh Routing: Swarm mode features an integrated routing mesh. This network layer ensures that ingress traffic to any swarm host is automatically routed to an active, healthy container on any other node."
    ],
    diagramId: "client-daemon",
    speakerNotes: "Decoupling microservices into scaled, orchestratable replicas is standard practice in senior architecture. With services and swarm mode, Docker enables resilient horizontal scaling across complex bare-metal clouds."
  },
  {
    id: 15,
    title: "Docker Storage: Volumes & Bind Mounts",
    subtitle: "Decoupling Ephemeral Compute States from Persistent Host Storage",
    category: "Terminology",
    type: "text-content",
    bullets: [
      "Storage Strategies: Docker provides three ways to mount files from the host into a container: Volumes, Bind Mounts, and tmpfs mounts. Choosing the correct mount is critical for security and performance.",
      "Managed Volumes (Best Practice): Volumes are completely managed by Docker and stored in `/var/lib/docker/volumes/` on Linux. They are isolated from the host's direct user-space, making them the safest way to persist database data.",
      "Direct Bind Mounts: Bind mounts map an absolute path from the host system directly into the container. Non-Docker host processes can modify this data, which is useful for hot-reloading code during local development but less secure.",
      "In-Memory tmpfs Mounts: A tmpfs mount writes data directly to host memory (RAM) instead of persistent storage. It is ideal for storing sensitive credentials or temporary cache files that should never touch physical disk."
    ],
    diagramId: "volumes-mounts",
    speakerNotes: "State management is the critical boundary of container design. Compute nodes should be ephemeral and stateless. When deploying stateful systems like databases, we must mount persistent volumes. This decouples the lifecycle of your data from the lifecycle of your application container."
  },
  {
    id: 16,
    title: "Docker Networking: Bridge, Host, Overlay",
    subtitle: "Configuring Software-Defined Network Drivers for Secure Container Interconnects",
    category: "Terminology",
    type: "text-content",
    bullets: [
      "Software-Defined Networking (SDN): Docker uses network drivers to isolate or connect container networks on the host, eliminating the need to configure physical hardware switches.",
      "User-Defined Bridge Networks (Default): The standard driver for standalone containers. Bridge networks establish a private virtual switch on the host, allowing connected containers to communicate securely while isolating them from outside traffic.",
      "The Host Network Driver: Removes network isolation between the container and the Docker host. The container binds directly to the host's physical network ports, maximizing packet throughput and eliminating port-mapping overhead.",
      "Overlay, Macvlan, & None Drivers: Overlay networks connect multiple host daemons in a swarm cluster. Macvlan assigns a unique MAC address directly to the container's virtual card, and None disables all networking for complete isolation."
    ],
    diagramId: "container-networks",
    speakerNotes: "Networking is where container orchestrations come alive. Custom bridge networks provide automatic DNS routing between containers, allowing us to build secure microservice topologies. By keeping databases off public ports and routing traffic through web proxies, we enforce a zero-trust network boundary."
  },
  {
    id: 17,
    title: "Architectural Sandbox: Systems Diagnostics",
    subtitle: "An Interactive Playground to Validate and Master Terminal Operations",
    category: "Hands-on Labs",
    type: "text-content",
    bullets: [
      "High-Fidelity Terminal Simulator: The upcoming slides integrate a simulated Linux terminal environment designed to mirror actual Docker daemon command executions.",
      "Operational Learning Objectives: You will walk through 8 progressive systems engineering labs, starting from basic daemon verification to deploying multi-container stacks with Compose.",
      "Realistic Output Rendering: The CLI simulator accurately mimics virtual filesystems, container lifecycle tables, image-pulling states, and persistent network switch creation.",
      "Integrated Schema Verification: Each lab features a real-time validation engine. Typing and executing the appropriate systems commands unlocks the next architectural module."
    ],
    speakerNotes: "It is time to move from theory to execution. In the following slides, you will use our terminal simulator to run actual container commands. This provides hands-on practice with the CLI client, helping you master volume mounts, port-forwarding, and compose orchestration."
  },
  {
    id: 18,
    title: "Lab 1: Evaluating Daemon Availability",
    subtitle: "Checking that the local CLI client can establish API connections with the daemon",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab1",
      difficulty: "Beginner",
      timeEstimate: "2 mins",
      prerequisites: "None",
      steps: [
        {
          title: "Check Docker Version",
          instruction: "Verify that the local CLI client is available by retrieving its current compiled version.",
          command: "docker --version",
          expectedOutput: "Docker version 24.0.7, build afdd53b",
          hint: "Type: docker --version",
          validationKeyword: "version"
        },
        {
          title: "Inspect System Daemon info",
          instruction: "Confirm that the Docker client is connected to an active background daemon. Fetch full system diagnostics, running containers, and kernel info.",
          command: "docker info",
          expectedOutput: "Client:\n Context:    default\n Debug Mode: false\n\nServer:\n Containers: 4\n  Running: 2\n  Paused: 0\n  Stopped: 2\n Images: 12\n Server Version: 24.0.7\n Storage Driver: overlay2\n Kernel Version: 6.1.0-21-amd64\n Operating System: Debian GNU/Linux 12",
          hint: "Type: docker info",
          validationKeyword: "Server Version"
        }
      ]
    },
    speakerNotes: "Our first lab verifies client-to-daemon communication. 'docker --version' checks the client executable. 'docker info' triggers a REST API request to the background Daemon, retrieving critical metadata such as the active storage driver (overlay2) and host kernel version."
  },
  {
    id: 19,
    title: "Lab 2: Launching the Minimalist Sandbox",
    subtitle: "Evaluating remote image pulling mechanisms and container exit states",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab2",
      difficulty: "Beginner",
      timeEstimate: "3 mins",
      prerequisites: "Lab 1 Completed",
      steps: [
        {
          title: "Run hello-world",
          instruction: "Instruct the daemon to execute the diagnostic 'hello-world' image. Watch Docker pull the image from Docker Hub and instantiate the container process.",
          command: "docker run hello-world",
          expectedOutput: "Unable to find image 'hello-world:latest' locally\nlatest: Pulling from library/hello-world\nc1ec314a39e5: Pull complete \nDigest: sha256:4c060b2ece1d\nStatus: Downloaded newer image for hello-world:latest\n\nHello from Docker!\nThis message shows that your installation appears to be working correctly.\n\nTo generate this message, Docker took the following steps:\n 1. The Docker client contacted the Docker daemon.\n 2. The Docker daemon pulled the 'hello-world' image from the Docker Hub.\n 3. The Docker daemon created a new container from that image...",
          hint: "Type: docker run hello-world",
          validationKeyword: "Hello from Docker"
        },
        {
          title: "List stopped containers",
          instruction: "The diagnostic process exits immediately upon printing. Query the full process history (using '-a') to inspect stopped container metadata.",
          command: "docker ps -a",
          expectedOutput: "CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES\n8b64e030a5f9   hello-world   \"/hello\"   10 seconds ago   Exited (0) 9 seconds ago              peaceful_mayer",
          hint: "Type: docker ps -a (The -a flag displays both active and inactive containers)",
          validationKeyword: "hello-world"
        }
      ]
    },
    speakerNotes: "Observe how Docker handles image resolution: if an image is not found in the local cache, the daemon automatically pulls it from the registry. Once the primary containerized process exits, the container moves from an 'active' to a 'stopped' state. We use the '-a' flag to query it."
  },
  {
    id: 20,
    title: "Lab 3: Deploying Nginx as a Background Service",
    subtitle: "Configuring detached daemon mode execution and host port-forwarding",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab3",
      difficulty: "Beginner",
      timeEstimate: "4 mins",
      prerequisites: "Lab 2 Completed",
      steps: [
        {
          title: "Run Detached Nginx",
          instruction: "Deploy an official Nginx proxy. Run in detached background mode (using '-d') named 'webserver', forwarding host port 80 to container port 80 (using '-p 80:80').",
          command: "docker run -d -p 80:80 --name webserver nginx",
          expectedOutput: "Unable to find image 'nginx:latest' locally\nlatest: Pulling from library/nginx\n57e7f226d40c: Pull complete \nb0f840a5a3a1: Pull complete \nDigest: sha256:04ba811e51\nStatus: Downloaded newer image for nginx:latest\na1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
          hint: "Type: docker run -d -p 80:80 --name webserver nginx",
          validationKeyword: "a1b2c3d4e5f"
        },
        {
          title: "Check Active Container",
          instruction: "Query the active process table to prove that the webserver is running and binding to port 80.",
          command: "docker ps",
          expectedOutput: "CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                NAMES\na1b2c3d4e5f6   nginx     \"/docker-entrypoint…\"   25 seconds ago   Up 24 seconds   0.0.0.0:80->80/tcp   webserver",
          hint: "Type: docker ps",
          validationKeyword: "webserver"
        }
      ]
    },
    speakerNotes: "The '-d' flag runs the container in detached background mode, returning the 64-character container ID. The '-p 80:80' maps our physical host port 80 to the container's internal port 80. This is the entry point for directing external user traffic to containerized applications."
  },
  {
    id: 21,
    title: "Lab 4: Auditing Image Compilation Blueprints",
    subtitle: "Analyzing microservice codebase layouts and declarative Dockerfiles",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab4",
      difficulty: "Intermediate",
      timeEstimate: "4 mins",
      prerequisites: "Lab 3 Completed",
      steps: [
        {
          title: "View Application Code",
          instruction: "Inspect the core Express server code inside 'index.js' to see how the service handles ingress requests.",
          command: "cat index.js",
          expectedOutput: "const express = require('express');\nconst app = express();\nconst PORT = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello from inside our containerized Node app!');\n});\n\napp.listen(PORT, () => {\n  console.log(`App listening on port ${PORT}`);\n});",
          hint: "Type: cat index.js",
          validationKeyword: "express"
        },
        {
          title: "Inspect Dockerfile recipe",
          instruction: "Read the Dockerfile build script used to package the Node.js application into a production image.",
          command: "cat Dockerfile",
          expectedOutput: "FROM node:18-alpine\n\nWORKDIR /app\n\nCOPY package.json ./\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD [\"node\", \"index.js\"]",
          hint: "Type: cat Dockerfile",
          validationKeyword: "node:18-alpine"
        }
      ]
    },
    speakerNotes: "Here we examine a standard Node.js Dockerfile blueprint. It inherits from a lightweight Alpine Linux base image, establishes a secure working directory, copies dependency files first to optimize build caching, runs the package installer, copies the remaining codebase, and defines the start command."
  },
  {
    id: 22,
    title: "Lab 5: Compiling and Instantiating Custom Images",
    subtitle: "Baking declarative Dockerfile layers into an active host container",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab5",
      difficulty: "Intermediate",
      timeEstimate: "5 mins",
      prerequisites: "Lab 4 Completed",
      steps: [
        {
          title: "Build Node Image",
          instruction: "Compile the local build context ('.') into a custom image tagged as 'mynodeapp'. Observe each instruction forming a cached layer.",
          command: "docker build -t mynodeapp .",
          expectedOutput: "Sending build context to Docker daemon  4.5kB\nStep 1/7 : FROM node:18-alpine\n ---> 2db58df7c31e\nStep 2/7 : WORKDIR /app\n ---> Running in c9b3074d2\n ---> 5e7fcd3112a1\nStep 3/7 : COPY package.json ./\n ---> 9f12df1ab323\nStep 4/7 : RUN npm install\n ---> Running in 11b827361a\nadded 50 packages in 1.4s\n ---> c0f3d917361a\nStep 5/7 : COPY . .\n ---> d0a3dbf87e1a\nStep 6/7 : EXPOSE 3000\n ---> 7db1a457fe10\nStep 7/7 : CMD [\"node\", \"index.js\"]\n ---> f2db190ac41d\nSuccessfully built f2db190ac41d\nSuccessfully tagged mynodeapp:latest",
          hint: "Type: docker build -t mynodeapp .",
          validationKeyword: "Successfully built"
        },
        {
          title: "Run Node Container",
          instruction: "Instantiate the custom image. Forward host port 3000 to internal container port 3000, running in the background as 'active-app'.",
          command: "docker run -d -p 3000:3000 --name active-app mynodeapp",
          expectedOutput: "8c91d4e7f6c31a20bde157fcd311c1d881fa12e52b226d40c7ff5e7fcd3112a1",
          hint: "Type: docker run -d -p 3000:3000 --name active-app mynodeapp",
          validationKeyword: "8c91d4e7"
        }
      ]
    },
    speakerNotes: "We execute 'docker build' to compile our Dockerfile. The Docker engine processes each line sequentially, generating cached filesystem layers on disk. We then run the compiled image with port forwarding mapped to expose our Express server."
  },
  {
    id: 23,
    title: "Lab 6: Securing Persistent Data Storage",
    subtitle: "Mounting persistent Docker volumes to isolate DBMS files from ephemeral layers",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab6",
      difficulty: "Intermediate",
      timeEstimate: "4 mins",
      prerequisites: "Lab 5 Completed",
      steps: [
        {
          title: "Create persistent volume",
          instruction: "Provision a named, managed Docker storage volume called 'db-data' to securely store relational database tables.",
          command: "docker volume create db-data",
          expectedOutput: "db-data",
          hint: "Type: docker volume create db-data",
          validationKeyword: "db-data"
        },
        {
          title: "Run Postgres database",
          instruction: "Deploy a PostgreSQL container named 'pg-db' using Alpine, mounting the 'db-data' volume directly onto Postgres's internal storage path (`/var/lib/postgresql/data`). Set POSTGRES_PASSWORD to 'secret'.",
          command: "docker run -d --name pg-db -v db-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:alpine",
          expectedOutput: "Unable to find image 'postgres:alpine' locally\nalpine: Pulling from library/postgres\n4c1fbc30fbc: Pull complete \nb8a931a2c3d: Pull complete \nDigest: sha256:d81a938210bc\nStatus: Downloaded newer image for postgres:alpine\n3db341d3b5b67890abcdef1234567890abcdef1234567890abcdef1234567890",
          hint: "Type: docker run -d --name pg-db -v db-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:alpine",
          validationKeyword: "3db341d"
        }
      ]
    },
    speakerNotes: "Stateful systems like PostgreSQL must write to storage that persists outside the container's lifecycle. Here, we provision a managed volume. When we map it to `/var/lib/postgresql/data`, all transactional updates bypass the copy-on-write layer and write directly to host disk, surviving container deletion."
  },
  {
    id: 24,
    title: "Lab 7: Orchestrating Services with Docker Compose",
    subtitle: "Defining and launching complete microservice stacks via declarative Compose YAML manifests",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab7",
      difficulty: "Intermediate",
      timeEstimate: "5 mins",
      prerequisites: "Lab 6 Completed",
      steps: [
        {
          title: "Inspect Docker Compose config",
          instruction: "Inspect the multi-service 'docker-compose.yml' manifest designed to automatically link and orchestrate the Express web backend and PostgreSQL DBMS.",
          command: "cat docker-compose.yml",
          expectedOutput: "version: '3.8'\n\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n    depends_on:\n      - db\n\n  db:\n    image: postgres:alpine\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - db-data:/var/lib/postgresql/data\n\nvolumes:\n  db-data:",
          hint: "Type: cat docker-compose.yml",
          validationKeyword: "depends_on"
        },
        {
          title: "Boot multi-container stack",
          instruction: "Deploy the entire multi-service stack in detached mode using Compose. It handles private networking, volumes, and dependency sequencing.",
          command: "docker-compose up -d",
          expectedOutput: "Creating network \"project_default\" with the default driver\nCreating volume \"project_db-data\" with default driver\nCreating project_db_1 ... done\nCreating project_web_1 ... done\n[+] Running 2/2\n ✔ Container project-db-1   Started\n ✔ Container project-web-1  Started",
          hint: "Type: docker-compose up -d",
          validationKeyword: "Container project-web-1"
        }
      ]
    },
    speakerNotes: "Instead of executing separate, verbose run commands for each microservice, Docker Compose allows you to write your entire environment topology in a single, version-controlled YAML configuration. Running 'docker-compose up -d' instantiates all services, private bridge networks, and storage linkages automatically."
  },
  {
    id: 25,
    title: "Lab 8: Reclaiming Host Storage Sectors",
    subtitle: "Executing system-wide garbage collection to prune stopped tasks and dangling image layers",
    category: "Hands-on Labs",
    type: "lab",
    labDetails: {
      labId: "lab8",
      difficulty: "Intermediate",
      timeEstimate: "3 mins",
      prerequisites: "Lab 7 Completed",
      steps: [
        {
          title: "Shut down compose stack",
          instruction: "De-provision the active compose stack, cleanly stopping active processes and deleting ephemeral container links.",
          command: "docker-compose down",
          expectedOutput: "Stopping project_web_1 ... done\nStopping project_db_1 ... done\nRemoving project_web_1 ... done\nRemoving project_db_1 ... done\nRemoving network project_default ... done",
          hint: "Type: docker-compose down",
          validationKeyword: "Removing project_web_1"
        },
        {
          title: "Prune dangling assets",
          instruction: "Run system-wide garbage collection to permanently delete stopped container shells, dangling build layers, and unused networks.",
          command: "docker system prune -f",
          expectedOutput: "Deleted Containers:\n8b64e030a5f98\na1b2c3d4e5f67\n\nDeleted Networks:\nproject_default\n\nDeleted Images:\n<none>:<none>\n\nTotal reclaimed space: 120.4 MB",
          hint: "Type: docker system prune -f",
          validationKeyword: "reclaimed space"
        }
      ]
    },
    speakerNotes: "Dangling layers, build caches, and stopped tasks consume considerable storage space on your development nodes. 'docker-compose down' stops and removes active stacks. Running 'docker system prune' cleans out this clutter, restoring gigabytes of disk space."
  },
  {
    id: 26,
    title: "Systems Reference: Active Container Lifecycles",
    subtitle: "Production commands to manage active process states and isolated executions",
    category: "Cheat Sheet",
    type: "cheatsheet",
    cheatSheetDetails: {
      categoryName: "Container Lifecycle Controls",
      description: "Systems Architecture: Operational patterns to launch, freeze, or terminate isolated host process sandboxes.",
      commands: [
        {
          command: "docker run [image]",
          description: "Pull, build, and execute an active container process from a blueprint image.",
          syntax: "docker run [flags] [image] [command]",
          example: "docker run -d -p 8080:80 --name billing-app service-image:v1.0",
          flags: [
            { flag: "-d", desc: "Detached (background) mode. Detaches execution and outputs the container ID" },
            { flag: "-p host:container", desc: "Maps a physical host port directly to an isolated container port" },
            { flag: "--name", desc: "Overrides generic random names and assigns a unique, human-readable label" },
            { flag: "-it", desc: "Interactive TTY mode. Keeps stdin open to permit direct terminal access inside" }
          ]
        },
        {
          command: "docker ps",
          description: "Inspect active container processes running on the machine's kernel.",
          syntax: "docker ps [flags]",
          example: "docker ps -a",
          flags: [
            { flag: "-a", desc: "Display stopped containers, historical caches, and crashed tasks" },
            { flag: "-q", desc: "Quiet mode. Output container IDs only (highly useful for script piping)" }
          ]
        },
        {
          command: "docker stop / start",
          description: "Safely freeze or reactivate an existing container without destroying its persistent data.",
          syntax: "docker stop [name/id] && docker start [name/id]",
          example: "docker stop billing-app && docker start billing-app"
        },
        {
          command: "docker rm",
          description: "Permanently delete a stopped container, purging its temporary filesystem layers.",
          syntax: "docker rm [name/id]",
          example: "docker rm -f billing-app",
          flags: [
            { flag: "-f", desc: "Force termination. Sends a SIGKILL if the container is actively running" },
            { flag: "-v", desc: "Purge any linked anonymous volumes associated with this container" }
          ]
        }
      ]
    },
    speakerNotes: "This cheat sheet outlines the fundamental container operations you will use daily. Managing detached states, port maps, and proper cleanup processes is central to running stable microservices."
  },
  {
    id: 27,
    title: "Systems Reference: Image Compilation & Layers",
    subtitle: "Optimizing layer composition and distribution across cloud registries",
    category: "Cheat Sheet",
    type: "cheatsheet",
    cheatSheetDetails: {
      categoryName: "Image Engineering & Registries",
      description: "Systems Architecture: Guidelines to compile Dockerfile manifests and publish packages to distributed registries.",
      commands: [
        {
          command: "docker build",
          description: "Compile a custom Dockerfile script step-by-step into a read-only blueprint image.",
          syntax: "docker build -t [name]:[tag] [directory]",
          example: "docker build -t billing-service:v1.0 .",
          flags: [
            { flag: "-t", desc: "Assigns a custom name and version tag to identify the compiled image" },
            { flag: "--no-cache", desc: "Bypass cached layers, forcing a complete rebuild from step 1" }
          ]
        },
        {
          command: "docker images",
          description: "List the local catalog of compiled and pulled images stored on the host compute node.",
          syntax: "docker images",
          example: "docker images",
          flags: [
            { flag: "-a", desc: "Show all images, including intermediate, unnamed layer fragments" }
          ]
        },
        {
          command: "docker rmi",
          description: "Permanently delete a cached image blueprint from the local host disk.",
          syntax: "docker rmi [name/id]",
          example: "docker rmi billing-service:v1.0"
        },
        {
          command: "docker push / pull",
          description: "Distribute compiled blueprints up to cloud registries or pull pre-built packages down.",
          syntax: "docker pull [name] && docker push [name]",
          example: "docker pull node:18-alpine"
        }
      ]
    },
    speakerNotes: "Image compilation is based on overlay layering. We must understand how cache layers are constructed to optimize build times. Deleting unused images with 'docker rmi' reclaims disk storage."
  },
  {
    id: 28,
    title: "Systems Reference: Live Process Diagnostics",
    subtitle: "Observability and diagnostics inside active container environments",
    category: "Cheat Sheet",
    type: "cheatsheet",
    cheatSheetDetails: {
      categoryName: "Observability & Live Debugging",
      description: "Systems Architecture: Diagnostic commands to inspect process logs, metadata configurations, and runtimes.",
      commands: [
        {
          command: "docker logs",
          description: "Fetch stdout and stderr lines emitted by the active process inside the container.",
          syntax: "docker logs [flags] [container]",
          example: "docker logs -f --tail 50 billing-app",
          flags: [
            { flag: "-f", desc: "Follow live. Streams new terminal output directly as it gets printed" },
            { flag: "--tail N", desc: "Display only the last N lines of terminal log history" }
          ]
        },
        {
          command: "docker exec",
          description: "Slip inside a running container and execute a completely new command in its sandbox namespace.",
          syntax: "docker exec -it [container] [command]",
          example: "docker exec -it billing-app sh",
          flags: [
            { flag: "-it", desc: "Interactive mode. Spawns a fully active shell environment inside" }
          ]
        },
        {
          command: "docker inspect",
          description: "Retrieve complete, low-level JSON configuration metadata of a Docker asset.",
          syntax: "docker inspect [name]",
          example: "docker inspect billing-app"
        },
        {
          command: "docker stats",
          description: "Query real-time streaming CPU, RAM, and network statistics of running containers.",
          syntax: "docker stats",
          example: "docker stats"
        }
      ]
    },
    speakerNotes: "When debugging in production, standard diagnostic commands are essential. 'docker logs' provides direct observability, 'docker exec' allows for active namespace inspection, and 'docker stats' provides live telemetry metrics."
  },
  {
    id: 29,
    title: "The Production Architecture Commandments",
    subtitle: "Standard operating procedures for deploying secure, lightweight, and fast containers",
    category: "Summary & Best Practices",
    type: "text-content",
    bullets: [
      "1. Enforce Strict Version Tagging (Banish ':latest'): The ':latest' tag is an unpredictable, moving target. Releasing updates with unpinned tags introduces environment drift and breaks CI/CD reliability. Always specify exact versions, such as `node:20.11-alpine`.",
      "2. Minimize the Base OS Footprint (Leverage Alpine or Distroless): Standard OS base images (Ubuntu/Debian) contain hundreds of unnecessary utilities (e.g., mail servers, UI tools) that bloat image size. Alpine Linux averages 5MB, cutting pull latencies and shrinking the security attack surface.",
      "3. Enforce the Principle of Least Privilege (Run as Non-Root): Containers default execution to the privileged 'root' user. If an application is compromised, attackers gain root namespace access to the host kernel. Always declare a restricted, non-root system USER in your Dockerfile.",
      "4. Prevent Build Context Leakage via .dockerignore: Never permit copying development dependencies (`node_modules`), debug logs, local configurations, or sensitive environment secrets (`.env`) into immutable image layers. Establish a comprehensive `.dockerignore` filter."
    ],
    highlight: "production-practices",
    speakerNotes: "These four rules form the foundation of professional container security and optimization. Keeping images small and clean with Alpine, running processes as non-root users, pinning minor tags, and ignoring development assets ensures fast, secure scaling in cloud environments."
  },
  {
    id: 30,
    title: "Enterprise Systems Architecture Certification Check",
    subtitle: "Validate your systems-level knowledge against standard board paradigms",
    category: "Summary & Best Practices",
    type: "interactive-quiz",
    quizDetails: {
      title: "Enterprise Systems Architecture Certification Check",
      questions: [
        {
          question: "How does a container differ from a hardware-virtualized Virtual Machine (VM) at the system level?",
          options: [
            "Containers emulate complete physical computer motherboards, while VMs run as shared sub-threads.",
            "Containers share the host operating system's kernel instead of booting a full Guest OS, saving CPU/RAM.",
            "VMs only execute Postgres databases, while Docker containers are restricted to simple static HTML files.",
            "There is no difference; they are different marketing slogans for the same exact technology."
          ],
          correctAnswerIndex: 1,
          explanation: "Containers skip the VM hypervisor layer and Guest OS. They share the host computer's running kernel, initiating in milliseconds and utilizing only megabytes of RAM."
        },
        {
          question: "What is the primary role of Linux Namespaces in modern container isolation?",
          options: [
            "Setting strict allowance limits on the maximum CPU and RAM the container can consume.",
            "Allowing developers to dynamically alter system configurations on physical server hosts.",
            "Setting up a private DNS routing switch to resolve container names across host networks.",
            "Creating process-level visual isolation so a container only sees its own processes, mounts, and network."
          ],
          correctAnswerIndex: 3,
          explanation: "Namespaces act as blindfolds (isolating PID, Mount, and Network cards), creating the perfect process-level isolation boundary."
        },
        {
          question: "Which of the following Dockerfile instructions is executed at container runtime rather than during image composition?",
          options: [
            "COPY",
            "RUN",
            "CMD",
            "WORKDIR"
          ],
          correctAnswerIndex: 2,
          explanation: "CMD outlines the default execution command to trigger when the container is booted up. RUN, COPY, and WORKDIR are processed during build-time to construct the frozen layers."
        },
        {
          question: "Which mechanism guarantees persistent storage for stateful workloads (such as relational DBMS) across container restarts and destructions?",
          options: [
            "By caching logs inside the temporary top Read-Write layer of the container process.",
            "By executing the Postgres engine with root privileges to bypass the kernel filesystem.",
            "By mapping a persistent Docker Volume or Host Bind Mount to keep files safe on the host disk.",
            "By restarting the terminal CLI client to re-align internal system calls."
          ],
          correctAnswerIndex: 2,
          explanation: "Volumes write directly onto host persistent storage, meaning they survive container deletions and can easily map onto upgraded container instances."
        }
      ]
    },
    speakerNotes: "Let's validate your learning outcomes! Take this quick 4-question interactive systems assessment. Understanding namespaces, shared-kernel models, build lifecycles, and storage isolation is key to master container engineering."
  },
  {
    id: 31,
    title: "Enterprise Container Reference Vault",
    subtitle: "Production-grade templates, reference specifications, and advanced diagnostic guidelines",
    category: "Resources",
    type: "resources",
    speakerNotes: "To support your real-world systems architecture projects, I have curated a set of production-grade resources. This includes references to the official docs, optimized Dockerfile templates for Node, Python, and Go, alongside standard .dockerignore profiles to ensure your builds remain secure and highly compact."
  }
];
