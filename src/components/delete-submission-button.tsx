"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteSubmission } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteSubmissionButton({ submissionId }: { submissionId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Supprimer cette copie définitivement ?")) {
      const result = await deleteSubmission(submissionId);
      if (result.success) {
        toast.success("Copie supprimée");
        router.refresh(); // Rafraîchit la liste visuellement
      } else {
        toast.error("Erreur suppression");
      }
    }
  };

  return (
    <Button 
      size="sm" 
      variant="ghost" 
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      title="Supprimer la copie"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}