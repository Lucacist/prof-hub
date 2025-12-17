import { CreateResourceForm } from "@/components/create-resource-form";
import { ResourceCard } from "@/components/resource-card";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { desc } from "drizzle-orm";

// Cette page est un "Server Component" par défaut, donc on peut faire des requêtes BDD directes !
export default async function DashboardPage() {
  
  // 1. On récupère les ressources, triées par date (les plus récentes en haut)
  const allResources = await db.select().from(resources).orderBy(desc(resources.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Professeur</h1>
          <p className="text-slate-500">Gérez vos devoirs et vos liens ici.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Colonne Gauche : Formulaire (Fixe) */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <CreateResourceForm />
            </div>
          </div>

          {/* Colonne Droite : Liste Dynamique */}
          <div className="md:col-span-2 space-y-4">
             <h2 className="text-xl font-semibold text-slate-800">Mes Ressources ({allResources.length})</h2>
             
             {allResources.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                 <p className="text-muted-foreground">Aucune ressource créée pour le moment.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {allResources.map((resource) => (
                   <ResourceCard key={resource.id} resource={resource} />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}