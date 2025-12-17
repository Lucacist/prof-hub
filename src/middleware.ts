import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// On définit les routes qui nécessitent une protection (Le Dashboard)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Tout ce qui commence par /dashboard est protégé
]);

export default clerkMiddleware(async (auth, req) => {
  // Si l'utilisateur essaie d'aller sur le dashboard et n'est pas connecté -> On bloque
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignore les fichiers statiques (_next, images, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours exécuter pour les routes API
    '/(api|trpc)(.*)',
  ],
};