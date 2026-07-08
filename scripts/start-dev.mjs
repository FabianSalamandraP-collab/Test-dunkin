import { execFileSync, spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const projectRoot = path.resolve(currentDir, "..");
const nextCachePath = path.join(projectRoot, ".next");
const port = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortAvailable(targetPort) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(targetPort);
  });
}

function getPortOwner(targetPort) {
  try {
    const script = `
      $ownerPid = (Get-NetTCPConnection -LocalPort ${targetPort} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1)
      if ($ownerPid) {
        Get-CimInstance Win32_Process -Filter "ProcessId = $ownerPid" |
          Select-Object ProcessId, Name, CommandLine |
          ConvertTo-Json -Compress
      }
    `;

    const output = execFileSync(
      "powershell",
      ["-NoProfile", "-Command", script],
      {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    ).trim();

    return output ? JSON.parse(output) : null;
  } catch {
    return null;
  }
}

function isProjectDevProcess(owner) {
  if (!owner) return false;

  const processName = String(owner.Name || "").toLowerCase();
  const commandLine = String(owner.CommandLine || "").toLowerCase();
  const normalizedRoot = projectRoot.toLowerCase();

  return (
    processName === "node.exe" &&
    commandLine.includes(normalizedRoot) &&
    (commandLine.includes("next") || commandLine.includes("start-server.js"))
  );
}

function stopProcessTree(processId) {
  execFileSync("taskkill", ["/PID", String(processId), "/T", "/F"], {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function ensurePortReady(targetPort) {
  const owner = getPortOwner(targetPort);

  if (!owner) {
    return;
  }

  if (!isProjectDevProcess(owner)) {
    console.error(
      `El puerto ${targetPort} está ocupado por otro proceso: ${owner.Name} (${owner.ProcessId}).`
    );
    console.error("Ciérralo manualmente o cambia ese proceso antes de usar `npm run dev`.");
    process.exit(1);
  }

  console.log(
    `Se encontró un servidor previo del proyecto en el puerto ${targetPort}. Reiniciándolo...`
  );
  stopProcessTree(owner.ProcessId);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await isPortAvailable(targetPort)) {
      return;
    }

    await sleep(300);
  }

  console.error(
    `No fue posible liberar el puerto ${targetPort} después de reiniciar el proceso anterior.`
  );
  process.exit(1);
}

await ensurePortReady(port);

const portAvailable = await isPortAvailable(port);

if (existsSync(nextCachePath)) {
  rmSync(nextCachePath, { recursive: true, force: true });
  console.log("Cache .next limpiada antes de iniciar dev.");
}

if (!portAvailable) {
  console.error(`No fue posible reservar el puerto ${port}.`);
  process.exit(1);
}

const nextBinPath = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

const child = spawn(
  process.execPath,
  [nextBinPath, "dev", "--port", String(port)],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
