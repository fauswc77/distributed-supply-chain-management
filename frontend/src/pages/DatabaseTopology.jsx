import React, { useEffect, useState } from 'react';
import { Server, Database, Activity, Wifi, Shield, ArrowRightLeft } from 'lucide-react';
import Card from '../components/ui/Card';

export default function DatabaseTopology() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Network Topology</h1>
        <p className="text-text-secondary">Physical architecture of the Distributed Supply Chain Management system.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="!p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden">
            {/* Background Map/Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
            
            {/* Topology Diagram Container */}
            <div className="relative w-full max-w-2xl aspect-square mx-auto">
              
              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full bg-black/60 border-2 ${pulse ? 'border-accent-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-accent-primary/50'} flex flex-col items-center justify-center transition-all duration-1000 backdrop-blur-md`}>
                  <Server size={40} className="text-accent-primary mb-2" />
                  <span className="font-bold text-sm">Central Hub</span>
                </div>
                <div className="mt-4 bg-black/40 px-3 py-1 rounded text-xs text-text-muted border border-glass-border">
                  Port: 3306 (Global Catalog)
                </div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* North to Central */}
                <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className={pulse ? "opacity-100" : "opacity-50"} style={{ transition: 'opacity 1s ease' }} />
                
                {/* West to Central */}
                <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className={pulse ? "opacity-100" : "opacity-50"} style={{ transition: 'opacity 1s ease' }} />
                
                {/* South to Central */}
                <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" className={pulse ? "opacity-100" : "opacity-50"} style={{ transition: 'opacity 1s ease' }} />
                
                {/* Animated Data Packets */}
                {pulse && (
                  <>
                    <circle cx="50%" cy="35%" r="3" fill="#3b82f6" filter="url(#glow)">
                      <animate attributeName="cy" values="20%;50%" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="35%" cy="60%" r="3" fill="#3b82f6" filter="url(#glow)">
                      <animate attributeName="cx" values="20%;50%" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="cy" values="70%;50%" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="65%" cy="60%" r="3" fill="#3b82f6" filter="url(#glow)">
                      <animate attributeName="cx" values="80%;50%" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="cy" values="70%;50%" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </svg>

              {/* North Node */}
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-black/60 border border-glass-border flex flex-col items-center justify-center backdrop-blur-md">
                  <Database size={24} className="text-blue-400 mb-1" />
                  <span className="font-semibold text-xs">North DB</span>
                </div>
                <div className="mt-2 text-[10px] text-text-muted">Port: 3307</div>
              </div>

              {/* West Node */}
              <div className="absolute top-[70%] left-[10%] transform -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-black/60 border border-glass-border flex flex-col items-center justify-center backdrop-blur-md">
                  <Database size={24} className="text-green-400 mb-1" />
                  <span className="font-semibold text-xs">West DB</span>
                </div>
                <div className="mt-2 text-[10px] text-text-muted">Port: 3308</div>
              </div>

              {/* South Node */}
              <div className="absolute top-[70%] right-[10%] transform -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-black/60 border border-glass-border flex flex-col items-center justify-center backdrop-blur-md">
                  <Database size={24} className="text-orange-400 mb-1" />
                  <span className="font-semibold text-xs">South DB</span>
                </div>
                <div className="mt-2 text-[10px] text-text-muted">Port: 3309</div>
              </div>

            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="!p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 border-b border-glass-border pb-3">
              <Wifi size={20} className="text-accent-secondary" /> Architecture Type
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-accent-primary">Star</div>
              <div className="text-sm text-text-secondary">Network Topology</div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              All regional database nodes connect directly to a centralized hub. This architecture provides a single point for global queries, schema management, and catalog distribution.
            </p>
          </Card>

          <Card className="!p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 border-b border-glass-border pb-3">
              <ArrowRightLeft size={20} className="text-accent-success" /> Data Flow
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] text-accent-success"><Activity size={16} /></div>
                <div>
                  <strong className="text-text-primary block mb-1">Local Reads/Writes</strong>
                  <span className="text-text-muted">Regional operations hit their respective local nodes for zero-latency OLTP transactions.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] text-accent-primary"><Database size={16} /></div>
                <div>
                  <strong className="text-text-primary block mb-1">Replication</strong>
                  <span className="text-text-muted">Data written to regional nodes is asynchronously replicated to the Central Hub.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] text-accent-warning"><Server size={16} /></div>
                <div>
                  <strong className="text-text-primary block mb-1">Global Queries</strong>
                  <span className="text-text-muted">Distributed analytical queries are executed on the Central Hub which holds the complete dataset.</span>
                </div>
              </li>
            </ul>
          </Card>

          <Card className="!p-6 bg-gradient-to-br from-black/40 to-black/80 border-glass-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-text-primary">
              <Shield size={20} className="text-accent-warning" /> Reliability Metrics
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Node Availability</span>
                  <span className="text-accent-success font-mono">99.99%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-success" style={{ width: '99.99%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Replication Lag</span>
                  <span className="text-accent-warning font-mono">&lt; 50ms</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-warning" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
