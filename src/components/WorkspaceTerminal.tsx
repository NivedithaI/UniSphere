import React, { useState, useRef, useEffect } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

interface WorkspaceTerminalProps {
  onRunProject?: () => void;
  projectName?: string;
}

export const WorkspaceTerminal: React.FC<WorkspaceTerminalProps> = ({ onRunProject, projectName }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
  
  const [logs, setLogs] = useState<string[]>([
    'AIET-UniSphere Project Terminal',
    'This is a browser-based terminal with limited command support.',
    'Type "help" to see available commands.',
    ''
  ]);

  const [inputCmd, setInputCmd] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;

    const cmd = inputCmd.trim();
    const newLogs = [...logs, `$ ${cmd}`];

    if (cmd === 'help') {
      newLogs.push('Available commands:');
      newLogs.push('  help       — Show this help message');
      newLogs.push('  clear      — Clear terminal output');
      newLogs.push('  date       — Show current date/time');
      newLogs.push('  echo <msg> — Print a message');
      newLogs.push('  whoami     — Show current user context');
      newLogs.push('  ls         — List project files (virtual)');
      newLogs.push('');
      newLogs.push('Note: OS-level commands (npm, git, node) cannot be executed');
      newLogs.push('in a browser environment. Use the Run/Preview button instead.');
    } else if (cmd === 'clear') {
      setLogs([]);
      setInputCmd('');
      return;
    } else if (cmd === 'date') {
      newLogs.push(new Date().toString());
    } else if (cmd.startsWith('echo ')) {
      newLogs.push(cmd.slice(5));
    } else if (cmd === 'whoami') {
      newLogs.push(`AIET-UniSphere Student · Project: ${projectName || 'Workspace'}`);
    } else if (cmd === 'ls') {
      newLogs.push('(Virtual file listing — see Project Explorer panel)');
    } else if (cmd === 'npm run dev' || cmd === 'npm start' || cmd === 'node' || cmd.startsWith('git ') || cmd === 'npm install' || cmd === 'npm test') {
      newLogs.push(`⚠ "${cmd}" requires OS-level execution which is not available in browser.`);
      newLogs.push('Use the "Run Project" button for preview functionality.');
    } else {
      newLogs.push(`Command not recognized: ${cmd}`);
      newLogs.push('Type "help" for available commands.');
    }

    setLogs(newLogs);
    setInputCmd('');
  };

  return (
    <div className="workspace-bottom-terminal">
      {/* Bottom Panel Navigation */}
      <div className="terminal-header-tabs">
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            className={`terminal-tab-btn ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            <Terminal size={14} /> Terminal
          </button>
          <button 
            className={`terminal-tab-btn ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            Output
          </button>
          <button 
            className={`terminal-tab-btn ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
          >
            Problems <span className="tab-badge-zero">0</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="terminal-action-btn"
            onClick={() => setLogs(['Terminal cleared.'])}
            title="Clear Console"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Terminal View Content */}
      {activeTab === 'terminal' && (
        <div className="terminal-body font-mono">
          <div className="terminal-logs">
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          <form onSubmit={handleCommandSubmit} className="terminal-input-form">
            <span className="prompt-symbol">$</span>
            <input 
              type="text" 
              className="terminal-input font-mono"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder="type a command..."
              aria-label="Terminal prompt input"
            />
          </form>
        </div>
      )}

      {activeTab === 'output' && (
        <div className="terminal-body font-mono" style={{ color: '#9ca3af' }}>
          No build output available. Use the Run/Preview button to generate output.
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="terminal-body font-mono" style={{ color: 'var(--color-success)' }}>
          ✓ No diagnostic problems found.
        </div>
      )}
    </div>
  );
};
