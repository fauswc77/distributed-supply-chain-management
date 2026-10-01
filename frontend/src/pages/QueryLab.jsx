import React, { useState } from 'react';
import { Play, Database, Terminal, Server, AlertCircle } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function QueryLab() {
  const [query, setQuery] = useState('SELECT * FROM supplier LIMIT 5');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  const predefinedQueries = [
    { name: 'All Suppliers', sql: 'SELECT * FROM supplier LIMIT 10' },
    { name: 'Regional Warehouses', sql: 'SELECT * FROM warehouse' },
    { name: 'High Value Orders', sql: 'SELECT * FROM orders WHERE total_amount > 1000000' },
    { name: 'Inventory Shortage', sql: 'SELECT * FROM inventory WHERE quantity < 50' }
  ];

  const handleExecute = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    const startTime = performance.now();
    
    try {
      const res = await api.post('/distributed/query', { sql: query });
      setResults(res.data);
    } catch (err) {
      console.error('Query execution failed', err);
      setError(err.response?.data?.message || err.message || 'Failed to execute query across distributed nodes.');
    } finally {
      setExecutionTime(Math.round(performance.now() - startTime));
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (results.length === 0) return null;
    
    const columns = Object.keys(results[0]);
    
    return (
      <div className="overflow-x-auto rounded-lg border border-glass-border">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-bg-panel text-text-muted border-b border-glass-border">
              {columns.map(col => (
                <th key={col} className="p-3 font-semibold whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors">
                {columns.map(col => (
                  <td key={col} className="p-3 whitespace-nowrap">
                    {typeof row[col] === 'boolean' 
                      ? (row[col] ? 'true' : 'false') 
                      : (row[col] !== null ? row[col].toString() : 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-6">
        <h1 className="text-3xl font-bold mb-2">Query Lab (Fragmentation)</h1>
        <p className="text-text-secondary">Execute transparent queries across Horizontally Fragmented regional databases.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 flex flex-col gap-6">
          <Card className="!p-6 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-accent-primary/20 rounded-lg text-accent-primary">
                <Terminal size={20} />
              </div>
              <h3 className="text-xl font-semibold m-0">SQL Editor</h3>
            </div>
            
            <div className="bg-black/40 rounded-xl p-1 border border-glass-border relative z-10 focus-within:border-accent-primary/50 transition-colors">
              <div className="flex bg-black/60 px-4 py-2 border-b border-glass-border text-xs text-text-muted font-mono rounded-t-xl gap-4">
                <span>mysql&gt;</span>
                <span>distributed_db</span>
              </div>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-h-[160px] bg-transparent border-none text-text-primary font-mono text-[15px] outline-none resize-y p-4 leading-relaxed"
                spellCheck="false"
                placeholder="Enter SQL query here..."
              />
            </div>
            
            <div className="flex justify-end mt-4 relative z-10">
              <Button 
                onClick={handleExecute}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-6"
              >
                {loading ? 'Executing...' : <><Play size={16} /> Execute Query</>}
              </Button>
            </div>
          </Card>

          <Card className="!p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-success/20 rounded-lg text-accent-success">
                  <Database size={20} />
                </div>
                <h3 className="text-xl font-semibold m-0">Results</h3>
              </div>
              {results.length > 0 && !loading && (
                <div className="text-text-muted text-sm flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-glass-border">
                  <span className="text-accent-success font-semibold">{results.length}</span> rows returned in <span className="text-text-primary font-mono">{executionTime}ms</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4">
                  <Spinner size="lg" className="text-accent-primary" />
                  <p className="text-text-muted">Aggregating fragments from regional nodes...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-accent-danger gap-3 bg-accent-danger/5 rounded-xl border border-accent-danger/20 p-6 text-center">
                  <AlertCircle size={36} />
                  <p className="max-w-md">{error}</p>
                </div>
              ) : results.length > 0 ? (
                renderTable()
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px] text-text-muted bg-white/5 rounded-xl border border-dashed border-glass-border">
                  No results to display. Execute a query to view fragmented data.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="!p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-text-primary border-b border-glass-border pb-3">
              <Database size={18} className="text-accent-secondary" /> Predefined Queries
            </h3>
            <div className="flex flex-col gap-3">
              {predefinedQueries.map((pq, idx) => (
                <button 
                  key={idx}
                  onClick={() => setQuery(pq.sql)}
                  className="bg-white/5 border border-white/10 p-3 rounded-lg text-left cursor-pointer transition-all hover:bg-white/10 hover:border-accent-primary/50 group"
                >
                  <div className="font-semibold mb-1 text-text-primary group-hover:text-accent-primary transition-colors text-sm">{pq.name}</div>
                  <div className="text-text-muted text-xs font-mono truncate">
                    {pq.sql}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="!p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-text-primary border-b border-glass-border pb-3">
              <Server size={18} className="text-accent-warning" /> Fragmentation Info
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              The system uses horizontal fragmentation. Data is sharded across regional database nodes based on the <code className="bg-white/10 px-1 py-0.5 rounded text-accent-warning">region</code> attribute.
            </p>
            <ul className="text-sm text-text-primary m-0 p-0 list-none space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
                <span><strong>North Node:</strong> region = 'North'</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></span>
                <span><strong>South Node:</strong> region = 'South'</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>
                <span><strong>West Node:</strong> region = 'West'</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-accent-primary/10 border-l-4 border-accent-primary rounded-r text-xs text-text-muted">
              Queries executed here are routed to the central node which acts as the global catalog and aggregated view.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
