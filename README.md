# PortScan

> Which process is using port X? Show PIDs, paths, stale ports.

## Install

```bash
npm install -g @arc2898/portscan
```

## Usage

```bash
portscan 3000           # Check specific port
portscan --all          # List all active ports
```

## Output

```
  3000   LISTENING     127.0.0.1       node
  5432   LISTENING     0.0.0.0         postgres
  8080   ESTABLISHED   192.168.1.5     chrome
```

## Features

- Works on Windows and Unix
- Shows process name for each port
- Color-coded state (green=LISTEN, yellow=ESTABLISHED)
- Sorted by port number

## License

MIT