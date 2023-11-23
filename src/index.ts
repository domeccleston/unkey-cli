import { Command } from "commander";
import { customAlphabet } from "nanoid";
import { spawn } from "child_process";
import http from "http";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import url from "url";
import { listen } from "async-listen";
import pc from "picocolors";
import ora from "ora";

const FILENAME = ".unkey";
const CLIENT_URL = "http://localhost:3000";
// const CLIENT_URL = "https://unkey-cli.vercel.app";

async function writeToConfigFile(data: any) {
  try {
    const homeDir = os.homedir();
    const filePath = path.join(homeDir, FILENAME);
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to local config file", error);
  }
}

const program = new Command();
const nanoid = customAlphabet("123456789QAZWSXEDCRFVTGBYHNUJMIKOLP", 8);

program
  .name("unkey-cli")
  .description("Example CLI application with Unkey auth")
  .version("0.0.1");

program
  .command("login")
  .description("Authenticate with your service via the CLI")
  .action(async () => {
    const server = http.createServer();
    const { port } = await listen(server, 0, "127.0.0.1");
    const authPromise = new Promise((resolve, reject) => {
      server.once("request", (req, res) => {
        if (req.method === "GET") {
          const parsedUrl = url.parse(req.url as string, true);
          const queryParams = parsedUrl.query;

          res.writeHead(200);
          res.end();

          resolve(queryParams);
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    });

    const redirect = `http://127.0.0.1:${port}`;

    const code = nanoid();
    const confirmationUrl = new URL(CLIENT_URL + "/auth/devices");
    confirmationUrl.searchParams.append("code", code);
    confirmationUrl.searchParams.append("redirect", redirect);
    console.log(`Confirmation code: ${pc.bold(code)}\n`);
    console.log(
      `If something goes wrong, copy and paste this URL into your browser: ${pc.bold(
        confirmationUrl.toString()
      )}\n`
    );
    spawn("open", [confirmationUrl.toString()]);
    const spinner = ora("Waiting for authentication...\n\n").start();

    try {
      const authData = await authPromise;
      spinner.stop();
      writeToConfigFile(authData);
      console.log("Authentication successful.");
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      server.close();
    }
  });

program.parse();
