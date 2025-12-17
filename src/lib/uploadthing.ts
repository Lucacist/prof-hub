// src/lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// On exporte nos propres composants typés
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();