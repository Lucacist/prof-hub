"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitHomework } from "@/app/actions";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, UploadCloud } from "lucide-react";

export function StudentSubmissionForm({ resourceId }: { resourceId: string }) {
  const [studentName, setStudentName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!studentName || !fileUrl) {
      toast.error("N'oublie pas ton nom et ton fichier !");
      return;
    }

    setIsSubmitting(true);
    const result = await submitHomework(resourceId, studentName, fileUrl);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true); // Affiche l'écran de succès
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Si le devoir est rendu, on affiche un message de félicitations
  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4 animate-in fade-in zoom-in">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800">Devoir envoyé !</h3>
        <p className="text-green-700">Ton prof a bien reçu ton fichier.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Envoyer un autre fichier (si erreur)
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
      
      {/* 1. NOM DE L'ÉLÈVE */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-semibold">Ton Prénom et Nom</Label>
        <Input
          id="name"
          placeholder="Ex: Thomas Dupuis"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="text-lg py-6" // Plus gros pour le mobile
        />
      </div>

      {/* 2. ZONE D'UPLOAD */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Ta copie (Photo ou PDF)</Label>
        
        {!fileUrl ? (
          <div className="border-2 border-dashed rounded-xl p-6 bg-slate-50 flex flex-col items-center gap-2">
            <UploadButton
              endpoint="submissionUpload" // <-- Note bien : endpoint différent du prof
              appearance={{
                button: "bg-blue-600 w-full py-4 text-base font-semibold",
                allowedContent: "text-slate-500"
              }}
              content={{
                button: "Choisir un fichier / Photo"
              }}
              onClientUploadComplete={(res) => {
                setFileUrl(res[0].appUrl); // Utilisation de appUrl comme corrigé précédemment
                toast.success("Fichier chargé !");
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erreur : ${error.message}`);
              }}
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Formats acceptés : PDF, Images (JPG, PNG)
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium truncate flex-1">Fichier prêt à l'envoi</span>
            <button 
              onClick={() => setFileUrl("")}
              className="text-xs underline hover:text-blue-900"
            >
              Changer
            </button>
          </div>
        )}
      </div>

      {/* 3. BOUTON ENVOYER */}
      <Button 
        onClick={handleSubmit}
        disabled={!studentName || !fileUrl || isSubmitting}
        className="w-full py-6 text-lg font-bold bg-slate-900 hover:bg-slate-800"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer mon devoir"}
      </Button>
    </div>
  );
}