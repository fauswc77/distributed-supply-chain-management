import React from 'react';
import { Network, Database, Map, CheckCircle, ArrowRight, Server } from 'lucide-react';
import Card from '../components/ui/Card';

export default function FragmentAllocation() {
  const fragments = [
    { id: 'F_North', predicate: "region = 'North'", size: '4.2 MB' },
    { id: 'F_South', predicate: "region = 'South'", size: '3.8 MB' },
    { id: 'F_West', predicate: "region = 'West'", size: '2.1 MB' },
    { id: 'F_East', predicate: "region = 'East'", size: '1.9 MB' },
    { id: 'F_Central', predicate: "region = 'Central'", size: '5.5 MB' }
  ];

  const sites = [
    { id: 'S_North', name: 'North Node', type: 'Regional DB', location: 'Delhi', status: 'Online' },
    { id: 'S_South', name: 'South Node', type: 'Regional DB', location: 'Chennai', status: 'Online' },
    { id: 'S_West', name: 'West Node', type: 'Regional DB', location: 'Mumbai', status: 'Online' },
    { id: 'S_Central', name: 'Central Node', type: 'Global Hub', location: 'HQ', status: 'Online' }
  ];

  // Allocation mapping: boolean values for Fragment -> Site
  // Columns: S_North, S_South, S_West, S_Central
  const allocationMatrix = {
    'F_North':   [true, false, false, true],
    'F_South':   [false, true, false, true],
    'F_West':    [false, false, true, true],
    'F_East':    [false, false, false, true],  // No dedicated East DB, stored in Central
    'F_Central': [false, false, false, true]
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Fragment Allocation</h1>
        <p className="text-text-secondary">Distribution of logical fragments to physical database sites (Partial Replication).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="!p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mb-4">
            <Network size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Allocation Strategy</h3>
          <p className="text-sm text-text-secondary">
            <strong>Partial Replication</strong> with a star topology. The Central node contains a full replica of all fragments for analytical queries, while regional nodes contain only their local fragments for fast OLTP operations.
          </p>
        </Card>
        
        <Card className="!p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-accent-success/20 flex items-center justify-center text-accent-success mb-4">
            <Database size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Data Locality</h3>
          <p className="text-sm text-text-secondary">
            Regional operations are routed to local nodes, minimizing network latency. Writes are synchronized asynchronously to the Central hub to maintain eventual consistency.
          </p>
        </Card>
        
        <Card className="!p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-accent-warning/20 flex items-center justify-center text-accent-warning mb-4">
            <Map size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Site Transparency</h3>
          <p className="text-sm text-text-secondary">
            The application layer issues global queries without specifying node addresses. The distributed query processor handles routing based on the allocation matrix.
          </p>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border">
          <h3 className="text-xl font-semibold m-0 flex items-center gap-2">
            <Database size={20} className="text-accent-primary" /> Allocation Matrix
          </h3>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 font-semibold text-text-primary border-b border-glass-border rounded-tl-lg">Fragments (Logical)</th>
                {sites.map(site => (
                  <th key={site.id} className="p-4 font-semibold text-text-primary border-b border-glass-border text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Server size={18} className={site.type === 'Global Hub' ? 'text-accent-warning' : 'text-accent-primary'} />
                      {site.name}
                      <span className="text-xs font-normal text-text-muted">{site.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fragments.map((frag, idx) => (
                <tr key={frag.id} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-text-primary">{frag.id}</div>
                    <div className="text-xs text-text-muted font-mono bg-black/30 p-1 rounded mt-1 w-fit">σ {frag.predicate}</div>
                  </td>
                  {allocationMatrix[frag.id].map((isAllocated, i) => (
                    <td key={i} className="p-4 text-center">
                      {isAllocated ? (
                        <div className="flex justify-center">
                          <CheckCircle size={24} className="text-accent-success" />
                        </div>
                      ) : (
                        <span className="text-text-muted/30">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="mt-8">
        <Card className="!p-6 bg-black/40 border border-accent-primary/20">
          <h4 className="font-semibold text-accent-primary mb-4 flex items-center gap-2">
            <ArrowRight size={18} /> Query Routing Example
          </h4>
          <div className="text-sm text-text-secondary font-mono space-y-4">
            <div className="bg-black/60 p-4 rounded border border-glass-border">
              <div className="text-text-primary mb-2">// Querying a specific region</div>
              <div className="text-accent-warning">SELECT * FROM orders WHERE region = 'North';</div>
              <div className="text-accent-success mt-2 flex items-center gap-2">
                <ArrowRight size={14} /> Routed directly to <strong>North Node (S_North)</strong>
              </div>
            </div>
            
            <div className="bg-black/60 p-4 rounded border border-glass-border">
              <div className="text-text-primary mb-2">// Querying across regions without predicates</div>
              <div className="text-accent-warning">SELECT COUNT(*) FROM orders;</div>
              <div className="text-accent-success mt-2 flex items-center gap-2">
                <ArrowRight size={14} /> Routed to <strong>Central Node (S_Central)</strong> for aggregated results
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
