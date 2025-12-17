"use server";

import { db } from "@/db";
import { resources, submissions } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
// 1. On importe l'outil serveur d'UploadThing
import { UTApi } from "uploadthing/server";

// On initialise l'API
const utapi = new UTApi();

// --- UTILITAIRE : Extraire la clé du fichier depuis l'URL ---
// Ex: "https://utfs.io/f/mon-fichier.pdf" -> "mon-fichier.pdf"
function getFileKey(url: string) {
  if (!url) return null;
  const parts = url.split("/f/");
  // Si l'URL contient bien "/f/", on prend ce qu'il y a après
  if (parts.length > 1) return parts[1];
  // Sinon on essaie de prendre juste le dernier segment
  return url.substring(url.lastIndexOf("/") + 1);
}

// --- TES FONCTIONS EXISTANTES (CREATE / SUBMIT) ---
// (Je les remets ici pour que tu aies le fichier complet, mais elles ne changent pas)

export async function createResource(title: string, type: "PDF" | "LINK", url: string) {
  try {
    await db.insert(resources).values({
      title,
      type,
      url,
    });
    revalidatePath("/dashboard");
    return { success: true, message: "Ressource créée avec succès !" };
  } catch (error) {
    return { success: false, message: "Erreur lors de la création." };
  }
}

export async function submitHomework(resourceId: string, studentName: string, fileUrl: string) {
  try {
    await db.insert(submissions).values({
      resourceId,
      studentName,
      fileUrl,
    });
    return { success: true, message: "Devoir rendu avec succès !" };
  } catch (error) {
    return { success: false, message: "Erreur lors de l'envoi." };
  }
}

// --- FONCTIONS DE SUPPRESSION AMÉLIORÉES ---

// 1. SUPPRIMER UNE RESSOURCE (ET SES FICHIERS)
export async function deleteResource(resourceId: string) {
  try {
    // A. On récupère les infos AVANT de supprimer pour avoir les URLs
    const resourceToDelete = await db.query.resources.findFirst({
      where: eq(resources.id, resourceId),
    });
    
    const submissionsToDelete = await db
      .select()
      .from(submissions)
      .where(eq(submissions.resourceId, resourceId));

    if (!resourceToDelete) return { success: false, message: "Ressource introuvable" };

    // B. On prépare la liste des clés de fichiers à supprimer chez UploadThing
    const filesToDelete: string[] = [];

    // 1. Le fichier du prof (si c'est un PDF)
    if (resourceToDelete.type === "PDF" && resourceToDelete.url) {
      const key = getFileKey(resourceToDelete.url);
      if (key) filesToDelete.push(key);
    }

    // 2. Les fichiers des élèves
    submissionsToDelete.forEach((sub) => {
      const key = getFileKey(sub.fileUrl);
      if (key) filesToDelete.push(key);
    });

    // C. Suppression physique chez UploadThing (si y'a des fichiers)
    if (filesToDelete.length > 0) {
      await utapi.deleteFiles(filesToDelete);
    }

    // D. Suppression en Base de Données
    await db.delete(submissions).where(eq(submissions.resourceId, resourceId));
    await db.delete(resources).where(eq(resources.id, resourceId));

    revalidatePath("/dashboard");
    return { success: true, message: "Ressource et fichiers supprimés." };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

// 2. SUPPRIMER UNE COPIE (ET SON FICHIER)
export async function deleteSubmission(submissionId: string) {
  try {
    // A. On récupère la copie pour avoir l'URL
    const sub = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId)
    });

    if (sub && sub.fileUrl) {
       // B. Suppression physique chez UploadThing
       const key = getFileKey(sub.fileUrl);
       if (key) {
         await utapi.deleteFiles(key);
       }
    }

    // C. Suppression BDD
    await db.delete(submissions).where(eq(submissions.id, submissionId));
    
    revalidatePath("/dashboard/submissions/[id]"); 
    return { success: true, message: "Copie supprimée." };
  } catch (error) {
    console.error("Erreur suppression copie:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}