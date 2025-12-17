"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Link as LinkIcon, FileText, Calendar, Download, Trash2 } from "lucide-react"; // <--- Ajout Trash2
import QRCode from "react-qr-code";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { deleteResource } from "@/app/actions"; // <--- Import de l'action
import { toast } from "sonner"; // <--- Pour le feedback

type Resource = {
  id: string;
  title: string;
  type: "PDF" | "LINK";
  url: string;
  createdAt: Date | null;
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const studentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/s/${resource.id}`;

  // Fonction de suppression avec confirmation
  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource et toutes les copies associées ?")) {
      const result = await deleteResource(resource.id);
      if (result.success) {
        toast.success("Ressource supprimée");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col justify-between group relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 overflow-hidden pr-8"> 
            {resource.type === "PDF" ? (
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
            ) : (
              <LinkIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
            )}
            <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
          </div>
          
          {/* BOUTON SUPPRIMER (En haut à droite) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                resource.type === 'PDF' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
                {resource.type}
            </span>
            <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {resource.createdAt && format(new Date(resource.createdAt), "d MMM yyyy", { locale: fr })}
            </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-wrap gap-2 pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="flex-1 min-w-[120px]">
              Voir QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md flex flex-col items-center">
            <DialogHeader>
              <DialogTitle className="text-center mb-4">Scanner pour accéder</DialogTitle>
              <DialogDescription className="text-center text-sm text-muted-foreground">
                Scannez ce QR Code avec votre appareil pour ouvrir la ressource.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-white p-4 rounded-lg shadow-inner border">
              <QRCode value={studentUrl} size={200} />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center break-all">
              Lien direct : <br/>
              <a href={studentUrl} target="_blank" className="text-blue-500 hover:underline">
                {studentUrl}
              </a>
            </p>
          </DialogContent>
        </Dialog>

        {resource.type === "PDF" && (
          <Button variant="secondary" className="flex-1 min-w-[120px]" asChild>
            <a href={`/dashboard/submissions/${resource.id}`}>
              Voir les copies
            </a>
          </Button>
        )}

        <Button variant="outline" size="icon" className="shrink-0" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
             <Download className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}