"use server";

import { db } from "@/db";
import { resources } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function deleteResource(resourceId: string) {
  try {
    // On supprime d'abord les devoirs rendus liés à cette ressource (Nettoyage)
    await db.delete(submissions).where(eq(submissions.resourceId, resourceId));

    // Ensuite on supprime la ressource elle-même
    await db.delete(resources).where(eq(resources.id, resourceId));

    revalidatePath("/dashboard");
    return { success: true, message: "Ressource supprimée." };
  } catch (error) {
    console.error("Erreur suppression ressource:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

export async function deleteSubmission(submissionId: string) {
  try {
    await db.delete(submissions).where(eq(submissions.id, submissionId));
    
    // On revalidate le dashboard pour être sûr, mais surtout la page actuelle
    revalidatePath("/dashboard/submissions/[id]"); 
    return { success: true, message: "Copie supprimée." };
  } catch (error) {
    console.error("Erreur suppression copie:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}