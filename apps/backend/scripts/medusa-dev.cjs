const { spawn } = require("node:child_process")

process.env.NODE_ENV = process.env.NODE_ENV || "production"

const medusaCommand = process.platform === "win32" ? "medusa.cmd" : "medusa"
const child = spawn(medusaCommand, ["develop"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
