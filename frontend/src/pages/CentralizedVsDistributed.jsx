import React, { useState } from 'react';
import { Server, Share2, Zap, Shield, Database, Activity, HardDrive, Cpu, Scaling } from 'lucide-react';
import Card from '../components/ui/Card';

export default function CentralizedVsDistributed() {
  const [activeTab, setActiveTab] = useState('performance');

  const comparisonData = {
    performance: [
      { metric: 'Local Read Latency', central: '50-100ms', distributed: '< 5ms', centralScore: 40, distScore: 95 },
      { metric: 'Global Read Latency', central: '50-100ms', distributed: '60-120ms', centralScore: 85, distScore: 70 },
      { metric: 'Write Throughput', central: 'Medium (Bottleneck at Hub)', distributed: 'High (Parallel writes across nodes)', centralScore: 60, distScore: 90 },
      { metric: 'Network Bandwidth Usage', central: 'High (All traffic to Hub)', distributed: 'Low (Traffic localized)', centralScore: 40, distScore: 85 },
    ],
    reliability: [
      { metric: 'Single Point of Failure', central: 'Yes', distributed: 'No (Partial degradation)', centralScore: 30, distScore: 90 },
      { metric: 'Availability', central: '99.9%', distributed: '99.999%', centralScore: 75, distScore: 98 },
      { metric: 'Disaster Recovery', central: 'Slower (Large monolithic backup)', distributed: 'Faster (Parallel distributed recovery)', centralScore: 60, distScore: 85 },
      { metric: 'Data Consistency', central: 'Strict (ACID)', distributed: 'Eventual (BASE) / Configurable', centralScore: 95, distScore: 80 },
    ],
    scalability: [
      { metric: 'Scaling Approach', central: 'Vertical (Scale Up)', distributed: 'Horizontal (Scale Out)', centralScore: 50, distScore: 95 },
      { metric: 'Cost of Scaling', central: 'High (Expensive hardware)', distributed: 'Low (Commodity hardware)', centralScore: 40, distScore: 90 },
      { metric: 'Max Capacity', central: 'Hardware Limited', distributed: 'Virtually Unlimited', centralScore: 60, distScore: 100 },
      { metric: 'Resource Utilization', central: 'Often over-provisioned', distributed: 'Dynamic and efficient', centralScore: 65, distScore: 85 },
    ]
  };

  const renderMetricBars = (data) => (
    <div className="space-y-6">
      {data.map((item, idx) => (
        <div key={idx} className="bg-black/20 p-4 rounded-xl border border-glass-border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-text-primary m-0">{item.metric}</h4>
          </div>
          
          <div className="space-y-4">
            {/* Centralized Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-accent-warning font-medium flex items-center gap-1.5"><Server size={12}/> Centralized</span>
                <span className="text-text-muted">{item.central}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-accent-warning transition-all duration-1000" 
                  style={{ width: `${item.centralScore}%` }}
                ></div>
              </div>
            </div>

            {/* Distributed Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-accent-primary font-medium flex items-center gap-1.5"><Share2 size={12}/> Distributed</span>
                <span className="text-text-muted">{item.distributed}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-accent-primary transition-all duration-1000" 
                  style={{ width: `${item.distScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Architecture Comparison</h1>
        <p className="text-text-secondary">Evaluating Centralized vs. Distributed Database Systems for Supply Chain Management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="!p-8 relative overflow-hidden group border-accent-warning/20 hover:border-accent-warning/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-warning/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-warning/20 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-accent-warning/20 rounded-xl text-accent-warning">
              <Server size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary m-0">Centralized Database</h2>
              <p className="text-sm text-text-muted m-0">Traditional Monolithic Approach</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed relative z-10">
            A single, powerful database server handles all requests from all regions. 
            While easier to maintain consistency and manage schemas, it suffers from a single point of failure, 
            high latency for distant clients, and significant vertical scaling costs.
          </p>
        </Card>

        <Card className="!p-8 relative overflow-hidden group border-accent-primary/20 hover:border-accent-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-accent-primary/20 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-accent-primary/20 rounded-xl text-accent-primary">
              <Share2 size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary m-0">Distributed Database</h2>
              <p className="text-sm text-text-muted m-0">Modern Fragmented Approach</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed relative z-10">
            Data is fragmented and stored across multiple geographic nodes. 
            This architecture provides ultra-low latency for local operations, high availability through partial replication, 
            and cost-effective horizontal scaling, making it ideal for a global supply chain.
          </p>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex border-b border-glass-border">
          <button 
            className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'performance' ? 'bg-white/10 text-accent-primary border-b-2 border-accent-primary' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
            onClick={() => setActiveTab('performance')}
          >
            <Zap size={18} /> Performance & Latency
          </button>
          <button 
            className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'reliability' ? 'bg-white/10 text-accent-success border-b-2 border-accent-success' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
            onClick={() => setActiveTab('reliability')}
          >
            <Shield size={18} /> Reliability & Fault Tolerance
          </button>
          <button 
            className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'scalability' ? 'bg-white/10 text-accent-secondary border-b-2 border-accent-secondary' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
            onClick={() => setActiveTab('scalability')}
          >
            <Activity size={18} /> Scalability & Cost
          </button>
        </div>
        
        <div className="p-8">
          {renderMetricBars(comparisonData[activeTab])}
        </div>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-black/40 to-black/80 rounded-xl p-6 border border-glass-border">
          <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <HardDrive size={18} className="text-text-muted" /> Centralized Bottleneck
          </h4>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between"><span className="text-text-muted">I/O Wait</span> <span className="text-accent-danger font-mono">High</span></div>
              <div className="flex justify-between"><span className="text-text-muted">CPU Load</span> <span className="text-accent-warning font-mono">85%</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Network Queue</span> <span className="text-accent-danger font-mono">Deep</span></div>
            </div>
            <div className="w-[1px] h-16 bg-glass-border mx-2"></div>
            <div className="flex-1">
              All 4 regions attempt to write simultaneously to a single disk array, causing contention.
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-black/40 to-black/80 rounded-xl p-6 border border-glass-border">
          <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Cpu size={18} className="text-accent-primary" /> Distributed Parallelism
          </h4>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between"><span className="text-text-muted">I/O Wait</span> <span className="text-accent-success font-mono">Low</span></div>
              <div className="flex justify-between"><span className="text-text-muted">CPU Load (Avg)</span> <span className="text-accent-success font-mono">25%</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Network Queue</span> <span className="text-accent-success font-mono">Minimal</span></div>
            </div>
            <div className="w-[1px] h-16 bg-glass-border mx-2"></div>
            <div className="flex-1">
              Read and write operations are processed locally at each node in parallel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
