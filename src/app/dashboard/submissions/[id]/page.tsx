import { db } from "@/db";
import { resources, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DeleteSubmissionButton } from "@/components/delete-submission-button"; // <--- IMPORT

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. On récupère les infos du devoir
  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, id),
  });

  if (!resource) return notFound();

  // 2. On récupère la liste des copies rendues (plus récentes en haut)
  const allSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.resourceId, id))
    .orderBy(desc(submissions.submittedAt));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{resource.title}</h1>
            <p className="text-slate-500">
              {allSubmissions.length} copie(s) rendue(s)
            </p>
          </div>
        </div>

        {/* Tableau des résultats */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nom de l'élève</TableHead>
                <TableHead>Date de rendu</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    Aucune copie rendue pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                allSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {sub.studentName.charAt(0).toUpperCase()}
                        </div>
                        {sub.studentName}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {sub.submittedAt && format(sub.submittedAt, "d MMM à HH:mm", { locale: fr })}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <a href={sub.fileUrl} target="_blank" className="text-blue-600 hover:text-blue-700">
                          <Download className="h-4 w-4 mr-2" />
                          Voir la copie
                        </a>
                      </Button>
                      <DeleteSubmissionButton submissionId={sub.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}