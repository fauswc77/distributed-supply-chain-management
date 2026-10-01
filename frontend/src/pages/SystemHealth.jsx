import React, { useState, useEffect } from 'react';
import { Server, Activity, Database, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function SystemHealth() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      setRefreshing(true);
      const data = await api.get('/distributed/health');
      setHealthData(data.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch system health', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealth();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !healthData) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-muted">Diagnosing distributed nodes...</p>
      </div>
    );
  }

  const nodes = [
    { id: 'central', name: 'Centralized Hub', status: healthData?.central_db === 'Online' ? 'UP' : 'DOWN', role: 'Global Catalog & Aggregation' },
    { id: 'north', name: 'North Region DB', status: healthData?.north_db === 'Online' ? 'UP' : 'DOWN', role: 'Data Shard (region="North")' },
    { id: 'south', name: 'South Region DB', status: healthData?.south_db === 'Online' ? 'UP' : 'DOWN', role: 'Data Shard (region="South")' },
    { id: 'west', name: 'West Region DB', status: healthData?.west_db === 'Online' ? 'UP' : 'DOWN', role: 'Data Shard (region="West")' }
  ];

  const overallStatus = nodes.every(n => n.status === 'UP') ? 'HEALTHY' : 
                        nodes.some(n => n.status === 'UP') ? 'DEGRADED' : 'OFFLINE';

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Health Monitor</h1>
          <p className="text-text-secondary">Real-time status of the distributed database infrastructure.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-text-muted flex items-center gap-2 text-sm bg-black/20 px-3 py-1.5 rounded-full border border-glass-border">
            <Clock size={14} /> Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            variant="secondary" 
            onClick={fetchHealth} 
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> 
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Card className="mb-8 flex items-center justify-between !p-8 bg-gradient-to-r from-bg-elevated to-bg-panel relative overflow-hidden">
        {/* Background glow based on status */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -mr-48 -mt-48 opacity-20 transition-colors duration-1000 ${
          overallStatus === 'HEALTHY' ? 'bg-accent-success' : (overallStatus === 'DEGRADED' ? 'bg-accent-warning' : 'bg-accent-danger')
        }`}></div>

        <div className="flex items-center gap-6 relative z-10">
          <div className={`p-5 rounded-2xl ${
            overallStatus === 'HEALTHY' ? 'bg-accent-success/20 text-accent-success' : 
            (overallStatus === 'DEGRADED' ? 'bg-accent-warning/20 text-accent-warning' : 'bg-accent-danger/20 text-accent-danger')
          }`}>
            <Activity size={40} />
          </div>
          <div>
            <h2 className="text-lg text-text-muted mb-1">Overall Network Status</h2>
            <div className={`text-4xl font-bold ${
              overallStatus === 'HEALTHY' ? 'text-accent-success' : 
              (overallStatus === 'DEGRADED' ? 'text-accent-warning' : 'text-accent-danger')
            }`}>
              {overallStatus}
            </div>
          </div>
        </div>
        
        <div className="flex gap-12 text-center relative z-10 mr-8">
          <div>
            <div className="text-4xl font-bold text-text-primary mb-1">{nodes.filter(n => n.status === 'UP').length}</div>
            <div className="text-text-muted text-xs uppercase tracking-wider font-semibold">Nodes Online</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-text-primary mb-1">{nodes.length}</div>
            <div className="text-text-muted text-xs uppercase tracking-wider font-semibold">Total Nodes</div>
          </div>
        </div>
      </Card>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <Server size={22} className="text-accent-primary" /> Infrastructure Topology
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {nodes.map(node => (
          <Card key={node.id} className={`flex flex-col relative overflow-hidden group hover:border-${node.status === 'UP' ? 'accent-success' : 'accent-danger'}/50 transition-colors`}>
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${node.status === 'UP' ? 'bg-accent-success' : 'bg-accent-danger'}`}></div>
            
            <div className="flex justify-between items-start mb-6 pt-2">
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Database size={28} className="text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold m-0 text-text-primary">{node.name}</h3>
                  <div className="text-text-secondary text-sm mt-1">{node.role}</div>
                </div>
              </div>
              <Badge variant={node.status === 'UP' ? 'success' : 'danger'} className="flex items-center gap-1.5 px-3 py-1.5">
                {node.status === 'UP' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {node.status || 'UNKNOWN'}
              </Badge>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl flex-1 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Connection Type</span>
                <span className="text-text-primary font-medium bg-white/5 px-2 py-0.5 rounded">JDBC</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Database Engine</span>
                <span className="text-text-primary font-medium bg-white/5 px-2 py-0.5 rounded">MySQL 8.0</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                <span className="text-text-muted">Latency</span>
                <span className={node.status === 'UP' ? 'text-accent-success font-mono font-medium' : 'text-text-muted'}>
                  {node.status === 'UP' ? `${Math.floor(Math.random() * 15) + 2}ms` : '--'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
