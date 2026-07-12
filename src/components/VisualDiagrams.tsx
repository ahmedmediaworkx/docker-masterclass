import React, { useState } from 'react';
import { Server, Cpu, Database, HardDrive, Layers } from 'lucide-react';

interface DiagramProps {
  diagramId: string;
}

export const VisualDiagrams: React.FC<DiagramProps> = ({ diagramId }) => {
  const [activeTab, setActiveTab] = useState<'vm' | 'container'>('container');
  const [hoveredSyscall, setHoveredSyscall] = useState<string | null>(null);

  switch (diagramId) {
    case 'shipping-container':
      return (
        <div className="liquid-glass corner-box p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="corner-box-bottom" />
          <div className="flex-1 space-y-4">
            <h4 className="text-[#2496ed] font-mono text-[10px] uppercase tracking-[0.16em] font-bold">Visual Analogy</h4>
            <p className="text-[#969696] text-xs leading-relaxed">
              Before standard shipping containers, cargo had unique dimensions requiring custom loading. In software, individual app dependencies conflict with other system libraries.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#181818] border border-[#303030] rounded-none text-[#969696]">
                <span className="font-bold block mb-1 uppercase tracking-wider text-[9px] text-[#2496ed]">Pre-Container Era:</span> Loose cargo. Mismatched library versions leak into each other and crash on launch.
              </div>
              <div className="p-4 bg-[#2496ed]/10 border border-[#2496ed]/20 rounded-none text-white">
                <span className="font-bold block mb-1 uppercase tracking-wider text-[9px] text-[#2496ed]">Docker Era:</span> Standard steel boxes. Cranes (OS) don't care what is inside; they just move the standardized box.
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 flex flex-col gap-3 relative">
            {/* Visual Grid of Shipping Boxes */}
            <div className="border border-[#303030] bg-[#181818]/60 p-4 rounded-none flex flex-col gap-2 shadow-2xl">
              <div className="bg-sky-900 p-3 rounded-none text-white font-mono text-[11px] text-center border-l-4 border-sky-950 transform hover:scale-[1.02] transition-transform">
                📦 NODE_APP [Port 3000]
              </div>
              <div className="bg-amber-900 p-3 rounded-none text-white font-mono text-[11px] text-center border-l-4 border-amber-950 transform hover:scale-[1.02] transition-transform">
                📦 PYTHON_ML_MODEL
              </div>
              <div className="bg-[#2496ed] p-3 rounded-none text-white font-mono text-[11px] text-center border-l-4 border-[#1d82ce] transform hover:scale-[1.02] transition-transform">
                📦 POSTGRES_DB [Port 5432]
              </div>
            </div>
            <div className="absolute -bottom-4 right-4 bg-black/90 text-[8px] text-[#969696] font-mono uppercase tracking-[0.14em] px-2.5 py-1 rounded-none border border-[#303030]">
              Standardized Ingress Ports
            </div>
          </div>
        </div>
      );

    case 'vm-architecture':
    case 'container-architecture':
      return (
        <div className="liquid-glass corner-box p-6 space-y-6">
          <div className="corner-box-bottom" />
          <div className="flex justify-between items-center border-b border-[#303030]/60 pb-4 flex-col sm:flex-row gap-4">
            <h4 className="text-[#2496ed] font-mono text-[10px] uppercase tracking-[0.16em] font-bold">Architecture Toggle</h4>
            <div className="flex bg-[#181818] p-1 rounded-none border border-[#303030]">
              <button
                onClick={() => setActiveTab('vm')}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] rounded-none transition-all cursor-pointer ${
                  activeTab === 'vm' ? 'bg-[#2496ed] text-white' : 'text-[#969696] hover:text-white'
                }`}
              >
                Virtual Machine (VM)
              </button>
              <button
                onClick={() => setActiveTab('container')}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] rounded-none transition-all cursor-pointer ${
                  activeTab === 'container' ? 'bg-[#2496ed] text-white' : 'text-[#969696] hover:text-white'
                }`}
              >
                Docker Container
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-[#969696] text-xs leading-relaxed">
                {activeTab === 'vm' ? (
                  <>
                    <strong className="text-cyan-400 font-sans uppercase tracking-wider text-[10px] block mb-1">VMs virtualize hardware.</strong> Every single application runs in its own dedicated, completely self-contained computer. To do this, it requires booting a full <strong className="text-white font-medium">Guest Operating System</strong>, carrying massive processing, storage, and memory overhead.
                  </>
                ) : (
                  <>
                    <strong className="text-[#2496ed] font-sans uppercase tracking-wider text-[10px] block mb-1">Containers virtualize the OS.</strong> Instead of duplicating virtual CPUs, RAM, and kernels, containers run directly inside the <strong className="text-white font-medium">Host OS space</strong>, sharing the physical kernel. They only hold your app and dependencies.
                  </>
                )}
              </p>

              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#969696] block">Core Components:</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  {activeTab === 'vm' ? (
                    <>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#969696] rounded-none">Hypervisor</div>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#ffffff] rounded-none font-bold">Guest Kernel</div>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#969696] rounded-none">App Binaries</div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#ffffff] rounded-none font-bold">Host Kernel</div>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#969696] rounded-none">Namespaces</div>
                      <div className="p-2 bg-[#181818] border border-[#303030] text-[#969696] rounded-none">Cgroups</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Stack Diagram */}
            <div className="flex flex-col gap-1.5 w-full max-w-sm mx-auto bg-[#181818]/60 p-5 rounded-none border border-[#303030] shadow-2xl relative">
              <span className="absolute top-2 right-2 text-[8px] font-mono text-[#969696] uppercase tracking-widest">Interactive Stack</span>
              
              {activeTab === 'vm' ? (
                <>
                  {/* VM Layer Stack */}
                  <div className="grid grid-cols-2 gap-2 mb-1.5">
                    <div className="bg-cyan-900 p-3 rounded-none text-white text-center font-bold text-xs font-mono">
                      App A
                      <div className="text-[9px] font-normal opacity-75">Libs & Node</div>
                    </div>
                    <div className="bg-sky-900 p-3 rounded-none text-white text-center font-bold text-xs font-mono">
                      App B
                      <div className="text-[9px] font-normal opacity-75">Libs & Python</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-1.5">
                    <div className="bg-[#303030] border border-[#303030] p-2.5 rounded-none text-[#969696] text-center text-[10px] font-mono">
                      Guest OS 1 (Linux)
                    </div>
                    <div className="bg-[#303030] border border-[#303030] p-2.5 rounded-none text-[#969696] text-center text-[10px] font-mono">
                      Guest OS 2 (Win)
                    </div>
                  </div>
                  <div className="bg-[#181818] border border-[#303030] p-3 rounded-none text-white text-center text-xs font-mono uppercase tracking-wider">
                    HYPERVISOR (ESXi / KVM)
                  </div>
                </>
              ) : (
                <>
                  {/* Container Layer Stack */}
                  <div className="grid grid-cols-2 gap-2 mb-1.5">
                    <div className="bg-[#2496ed] p-3 rounded-none text-white text-center font-bold text-xs font-mono">
                      App A (Container)
                      <div className="text-[9px] font-normal opacity-85">Libs only</div>
                    </div>
                    <div className="bg-[#303030] p-3 rounded-none text-white text-center font-bold text-xs font-mono border border-[#303030]">
                      App B (Container)
                      <div className="text-[9px] font-normal opacity-85">Libs only</div>
                    </div>
                  </div>
                  <div className="bg-[#181818] border border-[#303030] p-3 rounded-none text-[#ffffff] text-center text-xs font-mono font-medium uppercase tracking-widest">
                    CONTAINER ENGINE (Docker)
                  </div>
                </>
              )}

              {/* Shared Bottom Layers */}
              <div className="bg-[#303030] border border-[#303030] p-2.5 rounded-none text-[#969696] text-center text-xs font-mono uppercase tracking-wider">
                HOST OPERATING SYSTEM (Linux Kernel)
              </div>
              <div className="bg-[#181818] text-[#ffffff] border border-[#303030] p-2.5 rounded-none text-center text-xs font-mono flex items-center justify-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-[#2496ed]" />
                PHYSICAL HARDWARE (CPU, RAM, DISK)
              </div>
            </div>
          </div>
        </div>
      );

    case 'performance-charts':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boot Speed Comparison */}
          <div className="liquid-glass corner-box p-5 space-y-4">
            <div className="corner-box-bottom" />
            <h5 className="text-[#ffffff] font-mono text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-[#2496ed]" />
              BOOT SPEED IN SECONDS (Lower is better)
            </h5>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#969696]">Virtual Machine (VM)</span>
                  <span className="text-cyan-400 font-bold">120s</span>
                </div>
                <div className="w-full bg-[#181818] h-2 rounded-none overflow-hidden border border-[#303030]">
                  <div className="bg-cyan-800 h-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#969696]">Docker Container</span>
                  <span className="text-[#2496ed] font-bold">0.15s</span>
                </div>
                <div className="w-full bg-[#181818] h-2 rounded-none overflow-hidden border border-[#303030]">
                  <div className="bg-[#2496ed] h-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#969696] leading-relaxed pt-2">
              Containers launch instantly as standard shell processes because they bypass motherboard hardware initializations.
            </p>
          </div>

          {/* Idle RAM Footprint */}
          <div className="liquid-glass corner-box p-5 space-y-4">
            <div className="corner-box-bottom" />
            <h5 className="text-[#ffffff] font-mono text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest">
              <Database className="w-4 h-4 text-[#2496ed]" />
              MINIMUM MEMORY TO IDLE (Lower is better)
            </h5>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#969696]">Virtual Machine (VM Guest OS)</span>
                  <span className="text-cyan-400 font-bold">1024 MB</span>
                </div>
                <div className="w-full bg-[#181818] h-2 rounded-none overflow-hidden border border-[#303030]">
                  <div className="bg-cyan-800 h-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#969696]">Docker Container</span>
                  <span className="text-[#2496ed] font-bold">12 MB</span>
                </div>
                <div className="w-full bg-[#181818] h-2 rounded-none overflow-hidden border border-[#303030]">
                  <div className="bg-[#2496ed] h-full" style={{ width: '1.2%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#969696] leading-relaxed pt-2">
              Since containers share the physical host kernel, they consume only the actual byte allocations of the process threads.
            </p>
          </div>
        </div>
      );

    case 'kernel-syscalls':
      return (
        <div className="liquid-glass corner-box p-6 space-y-6">
          <div className="corner-box-bottom" />
          <h4 className="text-[#2496ed] font-mono text-[10px] uppercase tracking-[0.16em] font-bold">The System Call Bridge</h4>
          <p className="text-[#969696] text-xs leading-relaxed">
            Hover over the system commands to see how the software interacts directly with the physical host kernel using standard Linux syscalls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'write()', desc: 'Saves file data or outputs log text to streams.', trigger: 'e.g. console.log() or fs.writeFile()' },
              { name: 'socket()', desc: 'Allocates network sockets for incoming web traffic.', trigger: 'e.g. app.listen(3000)' },
              { name: 'fork()', desc: 'Creates child processes to handle computational workflows.', trigger: 'e.g. clustering or background jobs' }
            ].map((sys) => (
              <div
                key={sys.name}
                onMouseEnter={() => setHoveredSyscall(sys.name)}
                onMouseLeave={() => setHoveredSyscall(null)}
                className={`p-4 rounded-none border transition-all cursor-help ${
                  hoveredSyscall === sys.name
                    ? 'bg-[#303030] border-2 border-[#2496ed]'
                    : 'bg-[#181818] border-[#303030] hover:border-[#ffffff]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#2496ed] font-bold text-sm">{sys.name}</span>
                  <Layers className="w-3.5 h-3.5 text-[#969696]" />
                </div>
                <p className="text-xs text-[#969696] leading-relaxed mb-1">{sys.desc}</p>
                <span className="text-[9px] font-mono text-[#666]">{sys.trigger}</span>
              </div>
            ))}
          </div>

          <div className="border border-[#303030] bg-[#181818] rounded-none p-4 flex flex-col sm:flex-row items-center justify-center gap-6 shadow-xl">
            <div className="text-center font-mono text-xs px-4 py-2 border border-[#303030] bg-[#303030] text-[#ffffff]">
              Container Process
            </div>
            <div className="text-[#2496ed] animate-pulse text-[10px] font-mono font-bold uppercase tracking-widest">
              ── Syscall Passed directly ──&gt;
            </div>
            <div className="text-center font-mono text-xs px-4 py-2 bg-black text-white font-bold border border-black">
              Host Kernel Engine
            </div>
          </div>
        </div>
      );

    case 'namespaces-cgroups':
      return (
        <div className="liquid-glass corner-box p-6 space-y-6">
          <div className="corner-box-bottom" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#303030] bg-[#181818]/60 rounded-none p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-none"></div>
                <h5 className="font-mono text-[10px] text-white uppercase tracking-wider font-bold">Linux Namespaces (The Blinders)</h5>
              </div>
              <p className="text-xs text-[#969696] leading-relaxed">
                Provide visual virtualization boundaries. A process within a namespace thinks it is the only software alive on the host.
              </p>
              <ul className="text-[10px] font-mono text-[#969696] space-y-1.5 list-disc pl-4 pt-1">
                <li><span className="text-cyan-400">PID Namespace:</span> Hides other processes (gets PID 1)</li>
                <li><span className="text-cyan-400">NET Namespace:</span> Private IP, routing rules, and ports</li>
                <li><span className="text-cyan-400">MNT Namespace:</span> Custom isolated root directory</li>
              </ul>
            </div>

            <div className="border border-[#303030] bg-[#181818]/60 rounded-none p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-[#2496ed] rounded-none"></div>
                <h5 className="font-mono text-[10px] text-white uppercase tracking-wider font-bold">Control Groups / Cgroups (The Meter)</h5>
              </div>
              <p className="text-xs text-[#969696] leading-relaxed">
                Enforces hard resource limits. Prevents a single application thread from hogging hardware.
              </p>
              <ul className="text-[10px] font-mono text-[#969696] space-y-1.5 list-disc pl-4 pt-1">
                <li><span className="text-[#2496ed]">CPU Share Limits:</span> Cap container CPU utility</li>
                <li><span className="text-[#2496ed]">Memory Bounds:</span> Set max RAM limits (e.g. 256MB)</li>
                <li><span className="text-[#2496ed]">I/O Speed Budgets:</span> Limit read/write disk performance</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'client-daemon':
      return (
        <div className="liquid-glass corner-box p-6 flex flex-col items-center justify-center gap-6">
          <div className="corner-box-bottom" />
          <div className="w-full flex flex-col md:flex-row items-center justify-around gap-6 relative">
            
            {/* The Client */}
            <div className="flex flex-col items-center bg-[#181818]/80 border border-[#303030] p-4 rounded-none text-center w-full md:w-48">
              <Server className="w-8 h-8 text-cyan-400 mb-2" />
              <h5 className="font-bold text-xs text-[#ffffff] uppercase tracking-wider font-mono">Docker Client (CLI)</h5>
              <p className="text-[9px] text-[#969696] mt-1 font-mono">CMD ENTRY</p>
              <div className="bg-[#303030] border border-[#303030] px-2.5 py-1.5 rounded-none text-[9px] font-mono mt-2 text-cyan-400 font-bold">
                docker run nginx
              </div>
            </div>

            {/* REST API Connector */}
            <div className="flex flex-row md:flex-col items-center text-center gap-1 font-mono text-[9px] text-[#969696] uppercase tracking-[0.2em] font-bold">
              <span className="text-[#2496ed]">REST API</span>
              <span className="hidden md:inline">▼</span>
              <span className="md:hidden">◀──▶</span>
              <span>SOCKET</span>
            </div>

            {/* The Daemon */}
            <div className="flex flex-col items-center bg-[#181818] border border-[#2496ed]/40 p-4 rounded-none text-center w-full md:w-48 shadow-2xl">
              <Cpu className="w-8 h-8 text-[#2496ed] mb-2 animate-pulse" />
              <h5 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Docker Daemon (dockerd)</h5>
              <p className="text-[9px] text-[#969696] mt-1 font-mono">DAEMON PROCESS</p>
              <div className="bg-[#303030] border border-[#2496ed]/20 px-2.5 py-1.5 rounded-none text-[9px] font-mono mt-2 text-[#2496ed] font-bold">
                SPINS UP CONTAINERS
              </div>
            </div>

          </div>
        </div>
      );

    case 'volumes-mounts':
      return (
        <div className="liquid-glass corner-box p-6 space-y-4">
          <div className="corner-box-bottom" />
          <h4 className="text-[#2496ed] font-mono text-[10px] uppercase tracking-[0.16em] font-bold">Storage Boundary Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p className="text-[#969696] text-xs leading-relaxed">
                Containers are stateless. When deleted, all databases or files vanish instantly. Volumes and Bind Mounts map host paths to solve this.
              </p>
              <div className="space-y-2 text-[10px] text-[#969696] font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2496ed]"></div>
                  <span><strong>Named Volumes:</strong> Managed in /var/lib/docker/volumes/</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2496ed]"></div>
                  <span><strong>Bind Mounts:</strong> Map host folder directory directly for hot-reloads</span>
                </div>
              </div>
            </div>

            {/* Visual Storage Mapping */}
            <div className="border border-[#303030] bg-[#181818]/60 p-4 rounded-none flex flex-col gap-4 shadow-xl">
              <div className="border border-[#303030] p-3 bg-[#303030] rounded-none flex items-center justify-between text-xs font-mono">
                <span className="text-[#ffffff]">Container Layer</span>
                <span className="px-2 py-0.5 bg-sky-950/40 border border-sky-800 text-[#2496ed] text-[8px] uppercase font-bold tracking-widest rounded-none">Stateless</span>
              </div>
              <div className="flex justify-center text-[9px] text-[#2496ed] font-mono font-bold uppercase tracking-[0.2em]">
                ▲ Persistent Mapping Loop ▲
              </div>
              <div className="border border-[#303030] p-3 bg-black rounded-none flex items-center justify-between text-xs font-mono">
                <span className="text-[#ffffff]">Physical Host Hard Drive</span>
                <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[8px] uppercase font-bold tracking-widest rounded-none">Persistent</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'container-networks':
      return (
        <div className="liquid-glass corner-box p-6 space-y-4">
          <div className="corner-box-bottom" />
          <h4 className="text-[#2496ed] font-mono text-[10px] uppercase tracking-[0.16em] font-bold">The Docker Bridge Virtual Network</h4>
          <p className="text-[#969696] text-xs leading-relaxed">
            By default, containers share a private network bridge. This isolated switch ensures they are unreachable unless you explicitly forward host ports.
          </p>

          <div className="flex flex-col items-center bg-[#181818] p-4 border border-[#303030] rounded-none gap-4">
            <div className="flex justify-around w-full gap-4 flex-col sm:flex-row">
              <div className="bg-[#303030]/40 border border-[#303030] px-4 py-3 rounded-none text-center text-xs font-mono flex-1">
                <span className="text-[#2496ed] font-bold block">App Container</span>
                <span className="text-[9px] text-[#969696]">172.17.0.2</span>
              </div>
              <div className="bg-[#303030]/40 border border-[#303030] px-4 py-3 rounded-none text-center text-xs font-mono flex-1">
                <span className="text-[#2496ed] font-bold block">Database Container</span>
                <span className="text-[9px] text-[#969696]">172.17.0.3</span>
              </div>
            </div>

            <div className="w-full text-center py-2 border-y border-[#303030] text-[9px] font-mono uppercase tracking-[0.2em] text-[#969696] font-bold">
              ⚡ Inter-Container Comms VLAN ⚡
            </div>

            <div className="bg-[#303030] border border-[#2496ed] px-5 py-3 rounded-none text-center text-xs font-mono relative w-full sm:w-auto">
              <span className="text-[#ffffff] font-bold block uppercase tracking-wider text-[10px]">Physical Host Network</span>
              <span className="text-[9px] text-[#969696]">IP: 192.168.1.55</span>
              <div className="bg-[#2496ed] text-[#ffffff] rounded-none px-2 py-0.5 text-[8px] absolute -bottom-2.5 right-2 font-bold uppercase tracking-wider">
                -p 80:80 FORWARD
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
