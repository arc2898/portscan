import { execSync } from 'child_process';
import chalk from 'chalk';

interface ScanOptions {
  port?: string;
  all?: boolean;
  kill?: boolean;
  state?: string;
}

export function scan(port: string, options: ScanOptions) {
  if (!port && !options.all) {
    console.log('Usage: portscan <port> [--all] [--kill]');
    return;
  }

  if (options.all) {
    scanAll();
    return;
  }

  scanPort(port);
}

function scanPort(port: string) {
  try {
    const netstat = execSync(
      process.platform === 'win32'
        ? `netstat -ano | findstr :${port}`
        : `lsof -i :${port} 2>/dev/null || netstat -tlnp | grep :${port}`,
      { encoding: 'utf-8' }
    );

    const lines = netstat.split('\n').filter(l => l.trim());
    console.log(chalk.cyan(`Port ${port}:`));

    if (lines.length === 0) {
      console.log(chalk.gray('  No process found'));
      return;
    }

    const seen = new Set<string>();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (process.platform === 'win32') {
        const local = parts[1] || '';
        const pid = parts[parts.length - 1];
        if (!local.includes(`:${port}`)) continue;
        const key = `${local}:${pid}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const proc = getProcessInfo(pid);
        const state = local.includes('LISTENING') ? chalk.green('LISTEN') :
                      local.includes('ESTABLISHED') ? chalk.yellow('ESTABLISHED') :
                      chalk.gray('UNKNOWN');
        console.log(`  ${state} ${chalk.white(local)} PID: ${pid}`);
        if (proc) console.log(`         ${chalk.gray(proc)}`);
      } else {
        console.log(`  ${chalk.white(line)}`);
      }
    }
  } catch {
    console.log(chalk.gray(`Port ${port}: no process found`));
  }
}

function scanAll() {
  try {
    const netstat = execSync(
      process.platform === 'win32' ? 'netstat -ano' : 'netstat -tlnp 2>/dev/null',
      { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
    );

    let lines = netstat.split("\n").filter(l => l.trim() && !l.includes("0.0.0.0:0") && !l.includes("[::]"));

    if (options.state) {
      const filterState = options.state.toUpperCase();
      lines = lines.filter(line => line.toUpperCase().includes(filterState));
    }
    console.log(chalk.cyan('Active ports:\n'));

    const ports: Map<string, { addr: string; pid: string; state: string }> = new Map();
    for (const line of lines) {
      if (process.platform === 'win32') {
        const parts = line.trim().split(/\s+/);
        const local = parts[1] || '';
        const pid = parts[parts.length - 1];
        if (!local.match(/:\d+$/)) continue;
        const portNum = local.split(':').pop() || '';
        const addr = local.replace(`:${portNum}`, '');
        const state = parts[3] || 'UNKNOWN';

        if (!ports.has(portNum)) {
          ports.set(portNum, { addr, pid, state });
        }
      }
    }

    const sorted = Array.from(ports.entries()).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    for (const [portNum, info] of sorted) {
      const stateColor = info.state === 'LISTENING' ? 'green' : info.state.includes('ESTABLISHED') ? 'yellow' : 'gray';
      const proc = getProcessInfo(info.pid).split(' ')[0];
      console.log(`  ${chalk.white(portNum.padStart(5))} ${(chalk as any)[stateColor](info.state.padEnd(12))} ${info.addr.padEnd(20)} ${chalk.gray(proc)}`);
    }
  } catch (err) {
    console.error('Error:', (err as Error).message);
  }
}

function getProcessInfo(pid: string): string {
  try {
    if (process.platform === 'win32') {
      return execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, { encoding: 'utf-8' }).split(',')[0]?.replace(/"/g, '') || 'Unknown';
    } else {
      return execSync(`ps -p ${pid} -o comm= 2>/dev/null`, { encoding: 'utf-8' }).trim();
    }
  } catch {
    return 'Unknown';
  }
}