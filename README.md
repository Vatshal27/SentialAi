# SentinelAI

SentinelAI is a developer-focused security platform that combines static
analysis, optional local LLM analysis, Docker-based security scanning,
runtime discovery, controlled runtime validation, evidence collection,
and unified reporting.

The current repository contains two main applications:

``` text
Vatshal/
├── backend/        # Node.js security backend
└── SentialAi/      # VS Code extension / UI
```

The extension is primarily the client. The backend performs the security
work.

------------------------------------------------------------------------

## 1. What SentinelAI Does

The current pipeline is:

``` text
VS Code Extension
      |
      | Workspace files
      v
Node.js Backend :3000
      |
      +--------------------+
      |                    |
      v                    v
Docker Static Scan     Optional Ollama LLM
      |                    |
      |                    +--> explanations
      |                    +--> attack payloads
      |                    +--> remediation
      |                    +--> fixed-code suggestions
      |
      v
Runtime Discovery
      |
      v
Docker Runtime Validation
      |
      +--> Safe Simulation
      |
      +--> Project Runtime Validation
      |
      v
Evidence
      |
      v
Unified Security Report
```

Important:

-   Docker is required for the Docker-based scanner and runtime
    validation.
-   Ollama is optional. SentinelAI must also work with
    `LLM_ENABLED=false`.
-   Runtime validation can produce runtime findings even when static/AI
    analysis produced zero findings.
-   Safe Simulation uses a synthetic target and must not be interpreted
    as a real vulnerability in the user's project.
-   Project Runtime Validation is intended for an application the user
    controls or is explicitly authorized to test.

------------------------------------------------------------------------

# 2. Current Components

## VS Code extension

Location:

``` text
SentialAi/
```

Important files include:

``` text
SentialAi/
├── src/
│   ├── extension.ts
│   └── webview.ts
├── package.json
├── tsconfig.json
└── out/
```

The extension communicates with the backend at:

``` text
http://localhost:3000
```

The current extension exposes commands including:

``` text
SentinelAI: Scan Project
SentinelAI: Open Report
```

Runtime/sandbox controls are also exposed through the SentinelAI UI.

## Backend

Location:

``` text
backend/
```

Entry point:

``` text
backend/server.js
```

Start command:

``` bash
npm start
```

Default address:

``` text
http://localhost:3000
```

Important backend areas:

``` text
backend/
├── server.js
├── docker/
│   ├── client.js
│   ├── config.js
│   ├── planner.js
│   ├── runner.js
│   ├── sandbox.js
│   ├── target.js
│   ├── validator.js
│   ├── evidence.js
│   └── report.js
├── docker-scanner.js
├── scanner/
├── llm/
└── package.json
```

------------------------------------------------------------------------

# 3. Requirements

For the current development setup you should have:

-   Git
-   Node.js
-   npm
-   Docker
-   VS Code
-   Optional: Ollama
-   Optional: `qwen2.5:3b`

The project documentation currently requires Node.js 18+.

For a new installation, use an active Node.js LTS release unless the
project/package lock explicitly requires another version.

Check:

``` bash
node --version
npm --version
docker --version
docker info
```

The Node.js project publishes current LTS installers at:

https://nodejs.org/en/download/

------------------------------------------------------------------------

# 4. Install on Windows

## 4.1 Install Git

Install Git for Windows from:

https://git-scm.com/download/win

After installation, open PowerShell and verify:

``` powershell
git --version
```

------------------------------------------------------------------------

## 4.2 Install Node.js

Install the current Node.js LTS release.

If `winget` is available:

``` powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen PowerShell after installation.

Verify:

``` powershell
node --version
npm --version
```

You need Node.js 18 or newer for the current project.

------------------------------------------------------------------------

# 5. Install Docker on Windows

SentinelAI uses Linux containers, so Docker Desktop should run using its
Linux-container/WSL 2 setup.

Docker Desktop's current Windows installation uses WSL 2 by default for
most systems.

## 5.1 Install or update WSL

Open **PowerShell as Administrator**:

``` powershell
wsl --install
wsl --update
```

Restart Windows if Windows asks you to.

Verify:

``` powershell
wsl --version
```

You should have WSL 2 available.

------------------------------------------------------------------------

## 5.2 Install Docker Desktop

Download Docker Desktop for Windows:

https://docs.docker.com/desktop/setup/install/windows-install/

After downloading `Docker Desktop Installer.exe`, you can install it
from PowerShell.

Per-user installation:

``` powershell
Start-Process 'Docker Desktop Installer.exe' -Wait -ArgumentList 'install', '--user'
```

Or, for an all-users installation from an elevated PowerShell:

``` powershell
Start-Process 'Docker Desktop Installer.exe' -Wait -ArgumentList 'install'
```

Start Docker Desktop after installation.

Then verify:

``` powershell
docker --version
docker info
```

If Docker Desktop is using the wrong container mode, switch to **Linux
containers**.

------------------------------------------------------------------------

# 6. Test Docker on Windows

Run:

``` powershell
docker run --rm hello-world
```

If Docker is working, Docker will download the `hello-world` image and
print a successful installation message.

Do not continue with SentinelAI until:

``` powershell
docker info
```

works successfully.

------------------------------------------------------------------------

# 7. Download SentinelAI Docker Images

The runtime sandbox currently uses:

``` text
node:20-alpine
```

The static scanner currently uses the Semgrep image configured by the
project.

To pre-download the runtime image:

``` powershell
docker pull node:20-alpine
```

To pre-download the Semgrep image used by the current scanner:

``` powershell
docker pull returntocorp/semgrep:latest
```

Verify:

``` powershell
docker images
```

You should see the required images.

### Important

The runtime sandbox can also pull required images automatically if they
are missing.

Pre-pulling them is recommended because:

-   the first scan is faster after the download;
-   image-download problems are discovered before a scan;
-   the first runtime validation is easier to troubleshoot.

Semgrep's official Docker images have moved to the `semgrep/semgrep`
repository. If `backend/docker-scanner.js` or the project's scanner
configuration has been changed to use that repository, use:

``` powershell
docker pull semgrep/semgrep:latest
```

Do not change the image name in the README and code independently. The
image name used here should match the scanner configuration in the
repository.

------------------------------------------------------------------------

# 8. Install Ollama on Windows (Optional)

LLM analysis is optional.

If you want the LLM-enabled pipeline, install Ollama.

Official PowerShell installer:

``` powershell
irm https://ollama.com/install.ps1 | iex
```

Verify:

``` powershell
ollama --version
```

Pull the configured model:

``` powershell
ollama pull qwen2.5:3b
```

Verify the model:

``` powershell
ollama list
```

Test it:

``` powershell
ollama run qwen2.5:3b
```

Exit the model with:

``` text
/bye
```

Ollama normally exposes its local API at:

``` text
http://localhost:11434
```

------------------------------------------------------------------------

# 9. Clone the Project on Windows

Example:

``` powershell
cd $HOME
git clone <YOUR_REPOSITORY_URL> Vatshal
cd Vatshal
```

The expected structure is:

``` text
Vatshal/
├── backend/
└── SentialAi/
```

If the repository is already present, simply enter it:

``` powershell
cd C:\path\to\Vatshal
```

------------------------------------------------------------------------

# 10. Install Backend Dependencies

Open PowerShell:

``` powershell
cd C:\path\to\Vatshal\backend
npm install
```

Verify:

``` powershell
npm --version
node --version
```

------------------------------------------------------------------------

# 11. Install Extension Dependencies

Open another PowerShell terminal:

``` powershell
cd C:\path\to\Vatshal\SentialAi
npm install
```

Compile the extension:

``` powershell
npm run compile
```

The extension should compile to:

``` text
SentialAi/out/
```

------------------------------------------------------------------------

# 12. Install on Linux

The following instructions are written for Ubuntu.

For another Linux distribution, use the Docker installation instructions
for that distribution.

------------------------------------------------------------------------

## 12.1 Update the system

``` bash
sudo apt update
sudo apt upgrade -y
```

Install basic tools:

``` bash
sudo apt install -y git curl ca-certificates
```

------------------------------------------------------------------------

# 13. Install Node.js on Linux

The project requires Node.js 18+.

Using the Node.js version manager is convenient for development.

Install `nvm`:

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

Reload your shell:

``` bash
source ~/.bashrc
```

Verify:

``` bash
command -v nvm
```

Install an active Node.js LTS release:

``` bash
nvm install --lts
nvm use --lts
```

Verify:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

# 14. Install Docker Engine on Ubuntu

Use Docker's official apt repository.

Remove conflicting unofficial packages if present:

``` bash
sudo apt remove -y \
  docker.io \
  docker-compose \
  docker-compose-v2 \
  docker-doc \
  docker-buildx \
  podman-docker \
  containerd \
  runc
```

Install repository prerequisites:

``` bash
sudo apt update
sudo apt install -y ca-certificates curl
```

Create the Docker keyring directory:

``` bash
sudo install -m 0755 -d /etc/apt/keyrings
```

Download Docker's official GPG key:

``` bash
sudo curl -fsSL \
  https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
```

Set permissions:

``` bash
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add Docker's official repository:

``` bash
sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Update apt:

``` bash
sudo apt update
```

Install Docker Engine and plugins:

``` bash
sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

Check the service:

``` bash
sudo systemctl status docker
```

If it is not running:

``` bash
sudo systemctl start docker
```

Enable it at boot:

``` bash
sudo systemctl enable docker
```

------------------------------------------------------------------------

# 15. Allow Your Linux User to Run Docker

By default you may need `sudo`.

To use Docker as your normal user:

``` bash
sudo usermod -aG docker "$USER"
```

Then either log out and log back in, or run:

``` bash
newgrp docker
```

Verify:

``` bash
docker info
```

If that works without `sudo`, Docker is ready.

------------------------------------------------------------------------

# 16. Test Docker on Linux

Run:

``` bash
docker run --rm hello-world
```

Then:

``` bash
docker version
docker info
```

Do not continue until Docker is healthy.

------------------------------------------------------------------------

# 17. Download SentinelAI Docker Images on Linux

Runtime image:

``` bash
docker pull node:20-alpine
```

Current scanner image:

``` bash
docker pull returntocorp/semgrep:latest
```

Verify:

``` bash
docker images
```

If the current scanner configuration uses the newer official Semgrep
repository:

``` bash
docker pull semgrep/semgrep:latest
```

Again, the image name must match the actual scanner configuration.

------------------------------------------------------------------------

# 18. Install Ollama on Linux (Optional)

If LLM analysis is required:

``` bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify:

``` bash
ollama --version
```

Pull the configured model:

``` bash
ollama pull qwen2.5:3b
```

Verify:

``` bash
ollama list
```

Test:

``` bash
ollama run qwen2.5:3b
```

Ollama should provide its local API at:

``` text
http://localhost:11434
```

------------------------------------------------------------------------

# 19. Clone SentinelAI on Linux

``` bash
cd ~
git clone <YOUR_REPOSITORY_URL> Vatshal
cd Vatshal
```

Expected:

``` text
~/Vatshal/
├── backend/
└── SentialAi/
```

------------------------------------------------------------------------

# 20. Install Backend Dependencies on Linux

``` bash
cd ~/Vatshal/backend
npm install
```

------------------------------------------------------------------------

# 21. Install Extension Dependencies on Linux

``` bash
cd ~/Vatshal/SentialAi
npm install
```

Compile:

``` bash
npm run compile
```

Verify TypeScript:

``` bash
node ./node_modules/typescript/bin/tsc --noEmit
```

Then:

``` bash
node ./node_modules/typescript/bin/tsc -p .
```

Both commands should complete without errors.

------------------------------------------------------------------------

# 22. Choose LLM Mode

SentinelAI supports two important development modes.

## Mode A --- Docker + static/runtime scanning, no LLM

This is the recommended first test.

Linux/macOS:

``` bash
cd ~/Vatshal/backend
LLM_ENABLED=false node server.js
```

Windows PowerShell:

``` powershell
cd C:\path\to\Vatshal\backend
$env:LLM_ENABLED="false"
node server.js
```

The server should print:

``` text
[server] Running on http://localhost:3000
[server] LLM: disabled
```

This mode does NOT remove Docker.

Docker remains responsible for the Docker-based security pipeline.

------------------------------------------------------------------------

## Mode B --- Docker + static/runtime scanning + local LLM

Linux/macOS:

``` bash
cd ~/Vatshal/backend
LLM_ENABLED=true MODEL=qwen2.5:3b node server.js
```

Windows PowerShell:

``` powershell
cd C:\path\to\Vatshal\backend
$env:LLM_ENABLED="true"
$env:MODEL="qwen2.5:3b"
node server.js
```

Make sure Ollama is running and the model exists:

``` bash
ollama list
```

------------------------------------------------------------------------

# 23. Start the Backend

The simplest command is:

``` bash
cd backend
npm start
```

Equivalent:

``` bash
node server.js
```

Expected output is similar to:

``` text
[server] Running on http://localhost:3000
[server] Model: qwen2.5:3b
[server] LLM: disabled
```

or:

``` text
[server] LLM: enabled
```

------------------------------------------------------------------------

# 24. Verify the Backend

Open:

``` text
http://localhost:3000/health
```

Or from Linux/macOS:

``` bash
curl http://localhost:3000/health
```

Windows PowerShell:

``` powershell
Invoke-WebRequest http://localhost:3000/health
```

When LLM is disabled, the health endpoint should report that Ollama is
disabled.

When LLM is enabled, the backend checks its Ollama connection.

------------------------------------------------------------------------

# 25. Verify Docker Through SentinelAI

With the backend running, check:

``` text
GET /sandbox/check
```

Linux/macOS:

``` bash
curl http://localhost:3000/sandbox/check
```

Windows PowerShell:

``` powershell
Invoke-WebRequest http://localhost:3000/sandbox/check
```

The response should indicate that Docker is available.

If it reports that Docker is unavailable, fix Docker before testing
SentinelAI runtime validation.

------------------------------------------------------------------------

# 26. Start the VS Code Extension

Open the extension project:

``` bash
cd SentialAi
code .
```

In VS Code:

1.  Install the project's dependencies.
2.  Run `npm run compile`.
3.  Press `F5`.
4.  A new Extension Development Host window should open.
5.  Open a project/workspace in that window.
6.  Open SentinelAI.
7.  Run a scan.

The extension talks to:

``` text
http://localhost:3000
```

Therefore the backend must be running before using the extension.

------------------------------------------------------------------------

# 27. Normal Development Workflow

Use three terminals.

### Terminal 1 --- Ollama

Only required when LLM mode is enabled.

``` bash
ollama serve
```

### Terminal 2 --- Backend

Without LLM:

``` bash
cd backend
LLM_ENABLED=false node server.js
```

With LLM:

``` bash
cd backend
LLM_ENABLED=true MODEL=qwen2.5:3b node server.js
```

### Terminal 3 --- Extension

``` bash
cd SentialAi
npm run compile
```

Then press:

``` text
F5
```

inside VS Code.

------------------------------------------------------------------------

# 28. Security Scan Pipeline

A normal scan follows this general sequence:

``` text
1. Extension collects workspace files
2. Extension sends files to backend
3. Backend starts static analysis
4. Docker scanner filters files
5. Semgrep/Bandit analysis runs
6. Static findings are normalized
7. If enabled, Ollama analyzes source/findings
8. Findings are returned to the extension
9. User can review findings
10. Runtime discovery can identify the running application
11. Docker runtime validation can be started
12. Evidence is normalized
13. Runtime verdicts are generated
14. Report is shown to the user
```

------------------------------------------------------------------------

# 29. Safe Simulation

Safe Simulation uses a synthetic vulnerable application created inside
Docker.

It is designed to verify that SentinelAI's runtime-validation pipeline
works.

The synthetic target can contain controlled fixtures for categories such
as:

``` text
SQL injection
XSS
Command injection
Path traversal
Authentication bypass
Code injection
```

The simulation does not mean that the user's project has those
vulnerabilities.

A successful simulation means:

``` text
SentinelAI correctly reproduced the expected behaviour
of its controlled test target.
```

------------------------------------------------------------------------

# 30. Project Runtime Validation

Project Runtime Validation is different.

The target is a running application that the user controls or is
authorized to test.

Typical flow:

``` text
Runtime discovery
      ↓
Select/confirm target
      ↓
Docker attacker/validator environment
      ↓
Controlled requests
      ↓
Response/evidence analysis
      ↓
Runtime finding/verdict
```

Do not point the project-validation feature at systems you do not own or
have explicit authorization to test.

------------------------------------------------------------------------

# 31. Runtime Validation Does Not Depend Only on Static Findings

This is an important SentinelAI design rule.

A project can have:

``` text
Static findings: 0
AI findings: 0
```

and still have runtime security problems.

For example:

``` text
/admin              → exposed
/debug              → exposed
:8080               → unexpected service
/api/users          → leaks sensitive data
```

Therefore runtime discovery and runtime testing must be capable of
generating runtime findings independently.

------------------------------------------------------------------------

# 32. Useful Backend API Endpoints

Current backend endpoints include:

``` text
GET  /health

GET  /runtime/discover

POST /runtime/check

POST /analyze-project

POST /sandbox/run

POST /sandbox/stop

GET  /sandbox/check
```

### Health

``` bash
curl http://localhost:3000/health
```

### Docker check

``` bash
curl http://localhost:3000/sandbox/check
```

### Runtime discovery

``` bash
curl http://localhost:3000/runtime/discover
```

### Runtime check

Example:

``` bash
curl -X POST http://localhost:3000/runtime/check \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"http://localhost:5000"}'
```

------------------------------------------------------------------------

# 33. Docker Images Used by SentinelAI

The current Docker-based implementation uses:

  -----------------------------------------------------------------------
  Image                               Purpose
  ----------------------------------- -----------------------------------
  `node:20-alpine`                    Synthetic target and
                                      attacker/runtime containers

  `returntocorp/semgrep:latest`       Static Semgrep scanner in the
                                      current implementation
  -----------------------------------------------------------------------

The runtime image is deliberately small and is used for the isolated
runtime environment.

The scanner image is used for static security analysis.

The attacker container is restricted by the sandbox configuration with
controls such as:

``` text
memory limit
CPU limit
PID limit
capability dropping
no-new-privileges
read-only root filesystem
restricted temporary filesystem
isolated Docker network
```

------------------------------------------------------------------------

# 34. Check Downloaded Docker Images

Windows:

``` powershell
docker images
```

Linux:

``` bash
docker images
```

Check the runtime image:

``` bash
docker image inspect node:20-alpine
```

Check Semgrep:

``` bash
docker image inspect returntocorp/semgrep:latest
```

------------------------------------------------------------------------

# 35. Clean Old SentinelAI Containers

If a previous development run crashed and left containers behind,
inspect:

``` bash
docker ps -a
```

Look for SentinelAI containers such as:

``` text
sentinelai-target-*
sentinelai-attacker-*
sentinelai-sandbox-*
```

Only remove containers that you know belong to SentinelAI.

Example:

``` bash
docker ps -a --filter "name=sentinelai"
```

To remove a specific container:

``` bash
docker rm -f <CONTAINER_ID>
```

Do not blindly remove unrelated Docker containers.

------------------------------------------------------------------------

# 36. Clean Unused Docker Resources

Use carefully.

List unused resources:

``` bash
docker system df
```

If you are certain unused resources can be removed:

``` bash
docker system prune
```

Do not use aggressive cleanup commands on a development machine
containing containers/images you still need.

------------------------------------------------------------------------

# 37. Troubleshooting

## `docker: command not found`

Docker is not installed or is not on PATH.

Check:

``` bash
docker --version
```

Install Docker and restart the terminal.

------------------------------------------------------------------------

## `Cannot connect to the Docker daemon`

Linux:

``` bash
sudo systemctl status docker
sudo systemctl start docker
```

Then:

``` bash
docker info
```

Windows:

Start Docker Desktop and wait until Docker reports that it is running.

Then:

``` powershell
docker info
```

------------------------------------------------------------------------

## `permission denied while trying to connect to Docker`

Linux:

``` bash
sudo usermod -aG docker "$USER"
newgrp docker
```

Then:

``` bash
docker info
```

------------------------------------------------------------------------

## `Synthetic target failed its health check`

Check Docker first:

``` bash
docker info
```

Then inspect recent containers:

``` bash
docker ps -a --filter "name=sentinelai"
```

Inspect logs:

``` bash
docker logs <CONTAINER_ID>
```

Inspect state:

``` bash
docker inspect <CONTAINER_ID>
```

Look especially for:

``` text
ExitCode
OOMKilled
network errors
permission errors
container startup errors
```

------------------------------------------------------------------------

## `network ... not found`

A previous sandbox may have been interrupted while its network was being
removed.

Inspect:

``` bash
docker network ls
```

Inspect SentinelAI networks:

``` bash
docker network ls --filter "name=sentinelai"
```

Remove only stale SentinelAI networks that are no longer used.

------------------------------------------------------------------------

## `Attack container failed`

Check:

``` bash
docker ps -a --filter "name=sentinelai"
```

Then:

``` bash
docker logs <ATTACKER_CONTAINER_ID>
```

If the error comes from JavaScript generated inside the attacker
container, run the generated code through Node syntax checking before
changing Docker configuration.

------------------------------------------------------------------------

## `Attack result JSON parsing failed`

This means the attacker container did not return the exact JSON format
expected by the backend.

Check:

``` bash
docker logs <ATTACKER_CONTAINER_ID>
```

Do not assume that the Docker network or target is broken until the
attacker output has been inspected.

------------------------------------------------------------------------

## `LLM Disabled. Using static findings only.`

This is not an error.

It means:

``` text
LLM_ENABLED=false
```

Docker/static/runtime functionality should still operate.

------------------------------------------------------------------------

## Ollama connection failure

Check:

``` bash
ollama list
```

Then:

``` bash
curl http://localhost:11434/api/tags
```

If Ollama is not running:

``` bash
ollama serve
```

Verify that the configured model exists:

``` bash
ollama list
```

------------------------------------------------------------------------

## Backend returns HTTP 500

Look at the backend terminal first.

The backend logs the underlying error.

For Docker/runtime failures, inspect:

``` bash
docker ps -a
docker logs <CONTAINER_ID>
docker network ls
docker info
```

Do not troubleshoot the extension UI first if the backend has returned
HTTP 500.

------------------------------------------------------------------------

# 38. Recommended First-Time Verification

After installation, perform these checks in this exact order.

### Check 1 --- Node

``` bash
node --version
npm --version
```

### Check 2 --- Docker

``` bash
docker --version
docker info
```

### Check 3 --- Docker test container

``` bash
docker run --rm hello-world
```

### Check 4 --- Runtime image

``` bash
docker pull node:20-alpine
```

### Check 5 --- Semgrep image

``` bash
docker pull returntocorp/semgrep:latest
```

### Check 6 --- Ollama, if enabled

``` bash
ollama --version
ollama list
```

### Check 7 --- Backend dependencies

``` bash
cd backend
npm install
```

### Check 8 --- Extension dependencies

``` bash
cd ../SentialAi
npm install
```

### Check 9 --- Compile extension

``` bash
npm run compile
```

### Check 10 --- Start backend

Without LLM:

``` bash
cd ../backend
LLM_ENABLED=false node server.js
```

### Check 11 --- Backend health

``` bash
curl http://localhost:3000/health
```

### Check 12 --- Docker health through SentinelAI

``` bash
curl http://localhost:3000/sandbox/check
```

### Check 13 --- Start extension

Open:

``` text
SentialAi/
```

in VS Code and press:

``` text
F5
```

### Check 14 --- Run Safe Simulation

Run Safe Simulation from the SentinelAI UI.

The Docker target and attacker containers should start, communicate
through the isolated sandbox network, produce evidence, and be cleaned
up afterward.

------------------------------------------------------------------------

# 39. LLM-Free Development Is Supported

You do NOT need Ollama to develop the Docker runtime pipeline.

Use:

``` bash
LLM_ENABLED=false node server.js
```

The intended architecture is:

``` text
LLM enabled
    |
    +--> static analysis
    +--> AI analysis
    +--> Docker runtime testing
    +--> report

LLM disabled
    |
    +--> static analysis
    +--> Docker runtime testing
    +--> report
```

Docker is not replaced by the LLM.

The LLM and Docker have separate responsibilities.

------------------------------------------------------------------------

# 40. Privacy Model

The current architecture is primarily local during development:

``` text
VS Code
   |
   v
localhost backend
   |
   +--> local Docker
   |
   +--> local Ollama
```

With local Ollama, source-code analysis can remain on the developer
machine.

The Docker runtime environment is also local.

Do not expose the development backend publicly without adding
authentication, authorization, transport security, rate limiting, and
other production controls.

------------------------------------------------------------------------

# 41. Important Security Notes

SentinelAI is a security-testing system. Runtime validation can send
deliberately constructed test requests.

Only use project-runtime validation against applications you own or have
explicit authorization to test.

Safe Simulation is intended to remain isolated and synthetic.

Do not:

-   point validation at arbitrary third-party services;
-   expose the development backend directly to the Internet;
-   run untrusted generated attacker code outside the intended sandbox;
-   give the SentinelAI backend unnecessary host privileges;
-   mount sensitive host directories into attacker containers.

Docker itself is security-sensitive infrastructure. Treat access to the
Docker daemon as privileged access to the host.

------------------------------------------------------------------------

# 42. Development Architecture

The current project should be thought of as:

``` text
                    SentinelAI

             ┌──────────┴──────────┐
             │                     │
        VS Code UI             Backend
             │                     │
             │          ┌──────────┼──────────┐
             │          │          │          │
             │       Static       LLM       Runtime
             │       Scanner     Ollama     Security
             │          │          │          │
             │          └──────────┼──────────┘
             │                     │
             │                  Docker
             │                     │
             └─────────────── Report
```

The longer-term architecture can add a SentinelAI Server Agent and
central control plane without replacing the local development pipeline.

------------------------------------------------------------------------

# 43. Future Server Agent Architecture

The planned server-agent system is separate from the current local
Docker validator.

Future architecture:

``` text
SentinelAI Control Server
        |
        +---- Server Agent A
        |
        +---- Server Agent B
        |
        +---- Server Agent C
```

The agent can eventually monitor authorized servers for:

-   exposed ports;
-   service changes;
-   endpoint changes;
-   deployment drift;
-   Docker/container changes;
-   security configuration changes;
-   suspicious activity indicators;
-   possible sensitive-data exposure;
-   runtime security changes.

This is future functionality and should not be treated as fully
implemented merely because the current Docker validator exists.

------------------------------------------------------------------------

# 44. Release / Distribution

The current project is developed as a VS Code extension plus local
backend.

For development:

``` text
VS Code
   ↓
SentialAi extension
   ↓
localhost:3000
   ↓
backend
   ↓
Docker
```

A future distributable version should decide whether the backend:

1.  runs locally as a companion process;
2.  runs as a remote SentinelAI service;
3.  or supports both modes.

The IDE should ultimately remain a client of the SentinelAI security
engine rather than containing the complete security engine itself.

------------------------------------------------------------------------

# 45. Useful Commands Cheat Sheet

## Windows

``` powershell
# Verify
node --version
npm --version
docker --version
docker info

# Docker test
docker run --rm hello-world

# Images
docker pull node:20-alpine
docker pull returntocorp/semgrep:latest
docker images

# Backend
cd C:\path\to\Vatshal\backend
npm install
$env:LLM_ENABLED="false"
node server.js

# Extension
cd C:\path\to\Vatshal\SentialAi
npm install
npm run compile
```

## Linux

``` bash
# Verify
node --version
npm --version
docker --version
docker info

# Docker test
docker run --rm hello-world

# Images
docker pull node:20-alpine
docker pull returntocorp/semgrep:latest
docker images

# Backend
cd ~/Vatshal/backend
npm install
LLM_ENABLED=false node server.js

# Extension
cd ~/Vatshal/SentialAi
npm install
npm run compile
```

## With LLM

Linux/macOS:

``` bash
LLM_ENABLED=true MODEL=qwen2.5:3b node server.js
```

Windows PowerShell:

``` powershell
$env:LLM_ENABLED="true"
$env:MODEL="qwen2.5:3b"
node server.js
```

------------------------------------------------------------------------

# 46. Final Expected State

When everything is installed correctly, the system should look
approximately like this:

``` text
Docker
  ✓ running

node
  ✓ installed

npm
  ✓ installed

Ollama
  ✓ optional

qwen2.5:3b
  ✓ optional

node:20-alpine
  ✓ downloaded

Semgrep image
  ✓ downloaded

backend
  ✓ npm install completed

extension
  ✓ npm install completed
  ✓ TypeScript compiled

backend
  ✓ http://localhost:3000

VS Code
  ✓ SentinelAI extension running

SentinelAI
  ✓ static analysis
  ✓ LLM analysis when enabled
  ✓ Docker scanner
  ✓ runtime discovery
  ✓ Safe Simulation
  ✓ Project Runtime Validation
  ✓ evidence/report generation
```

------------------------------------------------------------------------

## Official installation references

Docker Desktop for Windows:

https://docs.docker.com/desktop/setup/install/windows-install/

Docker Engine on Ubuntu:

https://docs.docker.com/engine/install/ubuntu/

Docker WSL 2 integration:

https://docs.docker.com/desktop/features/wsl/

Node.js:

https://nodejs.org/en/download/

Ollama:

https://ollama.com/download

Semgrep Docker images:

https://hub.docker.com/r/semgrep/semgrep

------------------------------------------------------------------------

## Status

SentinelAI is under active development.

The current focus is making the local development pipeline reliable:

``` text
IDE
 ↓
Static analysis
 ↓
Optional LLM analysis
 ↓
Runtime discovery
 ↓
Docker validation
 ↓
Evidence
 ↓
Unified report
```

The planned next major subsystem is the SentinelAI Server Agent for
continuous authorized server monitoring.
