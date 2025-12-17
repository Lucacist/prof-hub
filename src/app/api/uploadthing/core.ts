import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Route pour les profs (PDF seulement)
  resourceUpload: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé :", file.url);
      return { uploadedBy: "prof" };
    }),

  // Route pour les élèves
  submissionUpload: f({ pdf: { maxFileSize: "4MB" }, image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload élève terminé :", file.url);
      return { uploadedBy: "student" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;