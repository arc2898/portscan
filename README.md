# 🔍 PortScan

**PortScan** is a lightweight, cross-platform CLI tool designed to answer one question quickly: *"What is running on this port?"* Unlike heavy network scanners, PortScan focuses on local process mapping, showing you PIDs, process names, and connection states in a clean, color-coded interface.

---

## ✨ Features

- **🚀 Instant Mapping**: Quickly identify which process (Node.js, Docker, Postgres, etc.) is occupying a port.
- **🎨 Visual Clarity**: Color-coded states (`LISTENING` in green, `ESTABLISHED` in yellow) for fast debugging.
- **💻 Multi-Platform**: Consistent behavior across Windows, macOS, and Linux.
- **📊 Detailed Info**: Shows local address, process name, and port state.
- **⚡ Zero Overhead**: Fast execution with no background daemon required.

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g @arc2898/portscan
```

---

## 🛠 Usage Guide

### 1. Check a Specific Port
Find out exactly what is listening on a given port.

```bash
portscan 3000
```

### 2. List All Active Ports
Get a bird's-eye view of all open ports on your system.

```bash
portscan --all
```

### 3. Filter by State
(Coming Soon) Filter output to show only listening or established connections.

---

## 📋 Example Output

```text
  PORT   STATE         ADDRESS         PROCESS
  3000   LISTENING     127.0.0.1       node
  5432   LISTENING     0.0.0.0         postgres
  8080   ESTABLISHED   192.168.1.5     chrome
  6379   LISTENING     127.0.0.1       redis-server
```

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## 📄 License

This project is licensed under the **MIT License**.

---
*Maintained by [@arc2898](https://github.com/arc2898)*
