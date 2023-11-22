import { Command } from "commander";
import { customAlphabet } from "nanoid";
import { spawn } from "child_process";

const CLIENT_URL = "https://unkey-cli.vercel.app/auth/devices";

const program = new Command();
const nanoid = customAlphabet("123456789QAZWSXEDCRFVTGBYHNUJMIKOLP", 8);

program
  .name("unkey-cli")
  .description("Example CLI application with Unkey auth")
  .version("0.0.1");

program
  .command("login")
  .description("Authenticate with your service via the CLI")
  .action(() => {
    const code = nanoid();
    const confirmationUrl = `${CLIENT_URL}?code=${code}\n`;
    console.log(`Confirmation code: ${code}\n`);
    console.log(
      `If something goes wrong, copy and paste this URL into your browser: ${confirmationUrl}`
    );
    spawn("open", [`https://unkey-cli.vercel.app/auth/devices?code=${code}`]);

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
