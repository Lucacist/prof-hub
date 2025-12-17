import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// On charge les variables d'environnement
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts", // Le chemin vers ton schéma
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});