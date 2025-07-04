import { existsSync, readFileSync, writeFileSync } from "fs";
import process from "process";
import path, { join } from "path";
import os, { platform } from "os";
import { printInConsole } from "./printInConsole";
import { sendError } from "./sendError";
import { transport } from "../src/server";

type MCPConfig = {
    mcpServers: Record<
        string,
        {
            command: string;
            args?: string[];
            cwd?: string;
        }
    >;
};

function getClaudeConfigPath(): string {
    const home = os.homedir();

    switch (process.platform) {
        case "darwin":
            // macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
            return join(
                home,
                "Library",
                "Application Support",
                "Claude",
                "claude_desktop_config.json"
            );

        case "win32":
            // Windows: %APPDATA%\Claude\claude_desktop_config.json
            const appData = join(home, "AppData", "Roaming");
            return join(appData, "Claude", "claude_desktop_config.json");

        case "linux":
            // Linux: ~/.config/Claude/claude_desktop_config.json
            return join(home, ".config", "Claude", "claude_desktop_config.json");

        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

function loadConfig(path: string): MCPConfig {
    if (!existsSync(path)) {
        sendError(transport, new Error(`File not found: ${path}`), "update-claude-config");
        // TODO: Display warning
        process.exit(1);
    }
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as MCPConfig;
}

function saveConfig(path: string, cfg: MCPConfig) {
    const pretty = JSON.stringify(cfg, null, 2);
    writeFileSync(path, pretty, "utf8");
}

export async function addOrUpdateMCPServer(
    name: string,
    serverEntry: MCPConfig["mcpServers"][string]
) {
    const configPath = getClaudeConfigPath();
    const config = loadConfig(configPath);

    config.mcpServers = {
        ...config.mcpServers,
        [name]: serverEntry,
    };

    saveConfig(configPath, config);
    await printInConsole(transport, `Updated "${name}" in ${configPath}`);
}

export function setEntry(projectName: string) {
    const isPkg = (process as any).pkg;

    if (isPkg) {
        return {
            entry: {
                command: process.execPath,
                args: [],
                cwd: process.cwd(),
            },
        };
    }

    // CommonJS supports __dirname directly
    const projectPath = path.resolve(__dirname, "../mcp-servers", projectName);

    if (platform() === "darwin") {
        return {
            entry: {
                command: "bash",
                args: ["-c", `cd "${projectPath}" && npx ts-node src/server.ts`],
            },
        };
    } else if (platform() === "win32") {
        return {
            entry: {
                command: "cmd",
                args: ["/c", `cd /d "${projectPath}" && npx ts-node src/server.ts`],
            },
        };
    } else {
        throw new Error("Unsupported platform");
    }
}
