import { Command } from "commander";
import { customAlphabet } from "nanoid";

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
    const id = nanoid();
    console.log(`Confirmation code: ${id}`);
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
