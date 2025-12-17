"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createResource } from "@/app/actions";
import { UploadButton } from "@/lib/uploadthing";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CheckCircle2, FileIcon } from "lucide-react"; // Icônes pour le feedback visuel

export function CreateResourceForm() {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // NOUVEAU : On stocke l'URL du fichier ici après l'upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIQUE ENVOI PDF (MANUEL) ---
  const handlePdfSubmit = async () => {
    if (!title) {
      toast.error("Veuillez ajouter un titre.");
      return;
    }
    if (!uploadedFileUrl) {
      toast.error("Veuillez d'abord uploader un fichier PDF.");
      return;
    }

    setIsSubmitting(true);
    const result = await createResource(title, "PDF", uploadedFileUrl);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Devoir PDF créé avec succès !");
      // Reset complet
      setTitle("");
      setUploadedFileUrl("");
    } else {
      toast.error(result.message);
    }
  };

  // --- LOGIQUE ENVOI LIEN ---
  const handleLinkSubmit = async () => {
    if (!title || !linkUrl) {
      toast.error("Merci de remplir le titre et le lien.");
      return;
    }
    setIsSubmitting(true);
    const result = await createResource(title, "LINK", linkUrl);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Lien sauvegardé !");
      setTitle("");
      setLinkUrl("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une ressource</CardTitle>
        <CardDescription>
          Créez un nouveau devoir ou partagez un lien.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
            <TabsTrigger value="link">Lien Externe</TabsTrigger>
          </TabsList>

          {/* --- ONGLET PDF --- */}
          <TabsContent value="pdf" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Titre du devoir / cours</Label>
              <Input
                placeholder="Ex: Devoir de Mathématiques - Chapitre 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Zone d'upload ou Affichage du fichier prêt */}
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-slate-50 gap-4 transition-all">

              {!uploadedFileUrl ? (
                /* CAS 1 : PAS ENCORE DE FICHIER */
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Étape 1 : Uploadez le PDF (Max 4MB)
                  </p>
                  <UploadButton
                    endpoint="resourceUpload"
                    appearance={{
                      button: "bg-slate-900 text-white hover:bg-slate-800 rounded-md px-4 py-2 text-sm font-medium",
                      allowedContent: "hidden"
                    }}
                    onClientUploadComplete={(res) => {
                      // On ne sauvegarde PAS en BDD, on stocke juste l'URL
                      setUploadedFileUrl(res[0].appUrl); toast.success("Fichier uploadé ! Vous pouvez valider.");
                    }}
                    onUploadError={(error: Error) => {
                      console.error(error);
                      toast.error(`Erreur : ${error.message}`);
                    }}
                  />
                </>
              ) : (
                /* CAS 2 : FICHIER UPLOADÉ PRÊT */
                <div className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-md border border-green-200 w-full">
                  <CheckCircle2 className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Fichier prêt à l'envoi</p>
                    <a href={uploadedFileUrl} target="_blank" className="text-xs underline hover:text-green-800">
                      Voir le fichier
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setUploadedFileUrl("")}
                  >
                    X
                  </Button>
                </div>
              )}
            </div>

            {/* BOUTON FINAL DE SAUVEGARDE */}
            <Button
              onClick={handlePdfSubmit}
              disabled={isSubmitting || !uploadedFileUrl}
              className="w-full"
            >
              {isSubmitting ? "Création en cours..." : "Sauvegarder la ressource"}
            </Button>
          </TabsContent>

          {/* --- ONGLET LIEN --- */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                placeholder="Ex: Questionnaire de satisfaction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Lien (URL)</Label>
              <Input
                placeholder="https://docs.google.com/forms/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleLinkSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enregistrement..." : "Sauvegarder le lien"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}