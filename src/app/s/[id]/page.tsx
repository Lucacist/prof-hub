import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StudentSubmissionForm } from "@/components/student-submission-form";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Download } from "lucide-react";

// MODIFICATION 1 : Le type est maintenant Promise<{ id: string }>
export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  
  // MODIFICATION 2 : On attend la résolution des paramètres
  const { id } = await params;

  // 1. On cherche la ressource en BDD en utilisant la variable 'id'
  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, id), // <-- On utilise 'id', et plus 'params.id'
  });

  // Si l'ID n'existe pas -> Erreur 404
  if (!resource) {
    return notFound();
  }

  // ... Le reste du code ne change pas ...
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* EN-TÊTE COMMUN */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-2">
            {resource.type === 'PDF' ? <FileText className="w-6 h-6 text-blue-600"/> : <ExternalLink className="w-6 h-6 text-purple-600"/>}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            {resource.title}
          </h1>
          <p className="text-sm text-slate-500">
            {resource.type === 'PDF' ? "Devoir à rendre" : "Lien externe"}
          </p>
        </div>

        {/* CAS 1 : C'EST UN LIEN */}
        {resource.type === 'LINK' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center space-y-6">
            <p className="text-slate-600">
              Le professeur a partagé un lien externe. Clique ci-dessous pour y accéder.
            </p>
            <Button asChild className="w-full py-6 text-lg font-bold bg-purple-600 hover:bg-purple-700">
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                Ouvrir le lien <ExternalLink className="ml-2 h-5 w-5"/>
              </a>
            </Button>
          </div>
        )}

        {/* CAS 2 : C'EST UN PDF */}
        {resource.type === 'PDF' && (
          <div className="space-y-6">
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-blue-900">Sujet du devoir</p>
                <p className="text-xs text-blue-700">PDF - À télécharger</p>
              </div>
              <Button size="sm" variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100" asChild>
                <a href={resource.url} target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </a>
              </Button>
            </div>

            <StudentSubmissionForm resourceId={resource.id} />
            
          </div>
        )}

      </div>
    </div>
  );
}