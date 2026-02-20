# zodify-env 🚀

[![npm version](https://img.shields.io/npm/v/zodify-env.svg)](https://www.npmjs.com/package/zodify-env)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A blazing-fast, **zero-dependency** CLI tool that automatically generates strongly-typed [Zod](https://zod.dev/) schemas from your `.env.example` files.

Stop manually writing validation schemas for your environment variables. `zodify-env` reads your template, infers the types (strings, numbers, booleans), and writes a ready-to-use TypeScript schema file so you get instant auto-complete and runtime validation.

---

## 🚀 Quick Start (No Install Required)

You don't even need to install it to use it! Just run it via `npx` in the root of your project:

```bash
npx zodify-env
```

By default, this looks for a `.env.example` file in your current directory and generates an `env.schema.ts` file.

---

## ⚙️ Arguments & Options

You can customize where `zodify-env` looks for your environment variables and where it saves the generated schema using these arguments:

| Argument | Short Flag | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `--input` | `-i` | `.env.example` | The path to your environment variable template or source file. |
| `--output` | `-o` | `env.schema.ts` | The destination path and filename for the generated TypeScript file. |

### 💡 Usage Examples

**1. Basic Run (Uses Defaults)**
Reads from `.env.example` and outputs to `env.schema.ts` in the current folder.
```bash
npx zodify-env
```

**2. Custom Input File**
If your team uses a different naming convention, like `.env.local` or `.env.template`:
```bash
npx zodify-env --input .env.local
```

**3. Custom Output Location**
If you want to save the generated schema directly into your source code folder:
```bash
npx zodify-env --output src/config/env.ts
```

**4. Using Short Flags for Both**
You can combine the short flags (`-i` and `-o`) for a quicker command:
```bash
npx zodify-env -i .env.template -o src/schemas/env.ts
```

---

## 📦 Installation & Team Workflow

For teams, it is highly recommended to install `zodify-env` as a development dependency so everyone stays in sync.

### 1. Install

```bash
npm install -D zodify-env
```

### 2. Add a Script

Add a sync script to your `package.json`. You can pass your custom arguments right here:

```json
"scripts": {
  "env:sync": "zodify-env --input .env.example --output src/config/env.schema.ts"
}
```

### 3. Run it

Whenever you add a new variable to your `.env.example`, simply run:

```bash
npm run env:sync
```

---

## 📖 How it Works

Given an input file like this (`.env.example`):

```env
# Server Configuration
PORT=3000
DEBUG=true
API_KEY=
```

`zodify-env` will generate the following TypeScript file:

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DEBUG: z.coerce.boolean(),
  API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
```

### Implementing in your app

Import the generated schema into your application entry point (e.g., `server.ts` or `index.ts`) to validate your environment variables at startup:

```typescript
import { envSchema } from './env.schema';

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

// config is now fully typed!
const config = parsedEnv.data; 
console.log(`Server starting on port ${config.PORT}`);
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the project.
2. Clone your fork: `git clone https://github.com/your-username/zodify-env.git`
3. Install dependencies: `npm install`
4. Make your changes in the `src` directory.
5. Build the project to test your changes: `npm run build`
6. Test your local build: `node dist/index.js`
7. Create a Pull Request!

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.