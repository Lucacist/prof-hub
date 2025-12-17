// src/app/actions.ts
"use server"; // Très important : indique que ce code tourne sur le serveur

import { db } from "@/db";
import { resources } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { submissions } from "@/db/schema";

export async function createResource(
  title: string,
  type: "PDF" | "LINK",
  url: string
) {
  try {
    // Insertion dans la BDD via Drizzle
    await db.insert(resources).values({
      title,
      type,
      url,
    });

    // On rafraîchit la page pour afficher la nouvelle ressource
    revalidatePath("/dashboard");
    
    return { success: true, message: "Ressource créée avec succès !" };
  } catch (error) {
    console.error("Erreur création ressource:", error);
    return { success: false, message: "Erreur lors de la création." };
  }
}


export async function submitHomework(
  resourceId: string,
  studentName: string,
  fileUrl: string
) {
  try {
    await db.insert(submissions).values({
      resourceId,
      studentName,
      fileUrl,
    });
    
    // Pas besoin de revalidatePath ici car l'élève ne voit pas la liste des rendus
    return { success: true, message: "Devoir rendu avec succès !" };
  } catch (error) {
    console.error("Erreur rendu devoir:", error);
    return { success: false, message: "Erreur lors de l'envoi." };
  }
}