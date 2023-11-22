import { Command } from "commander";
import { customAlphabet } from "nanoid";
import { spawn } from "child_process";
import http from "http";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { listen } from "async-listen";

const CLIENT_URL = "http://localhost:3000/auth/devices";
// const CLIENT_URL = "https://unkey-cli.vercel.app/auth/devices";

async function writeToConfigFile(data: any) {
  const filename = ".unkey";
  if (!filename) {
    console.error("CONFIG_FILE_NAME must be provided in .env");
    return 1;
  }
  try {
    const homeDir = os.homedir();
    const filePath = path.join(homeDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data));
    console.log(`Data written to ${filePath}`);
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
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            const data = JSON.parse(body);
            console.log(body);
            res.writeHead(200);
            res.end();
            resolve(data); // Resolve the promise with the received data
          });
        } else {
          reject(new Error("Invalid request method"));
        }
      });
    });

    const redirect = `http://127.0.0.1:${port}`;

    const code = nanoid();
    const confirmationUrl = new URL(CLIENT_URL);
    confirmationUrl.searchParams.append("code", code);
    confirmationUrl.searchParams.append("redirect", redirect);
    console.log(`Confirmation code: ${code}\n`);
    console.log(
      `If something goes wrong, copy and paste this URL into your browser: ${confirmationUrl.toString()}`
    );
    spawn("open", [confirmationUrl.toString()]);
    try {
      const authData = await authPromise;
      writeToConfigFile(authData);
      console.log("Authentication successful:", authData);
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      server.close();
    }

    // console.log(`Confirmation code: ${id}`);
  });

program.parse();

// type AuthConfig = {
//   token: string;
// };

// function openLoginPage(): AuthConfig {
//   return { token: "123" };
// }

// async function writeCredentialsToFile() {}

// async function getLocalCredentials(): Promise<AuthConfig> {
//   return new Promise(() => {
//     token: "123";
//   });
// }

// async function login() {
//   const { token } = await getLocalCredentials();

//   if (token) {
//     console.log("already logged in!");
//   } else {
//     try {
//       const result = await openLoginPage();
//       await writeCredentialsToFile();
//       console.log("logged in!");
//       return result;
//     } catch (error) {
//       throw new Error();
//     }
//   }
// }
