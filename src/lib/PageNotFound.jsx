import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-8xl font-light text-border">404</h1>
          <div className="h-px w-16 bg-border mx-auto"></div>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-light text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page <code className="text-xs bg-secondary px-1 py-0.5 rounded">{location.pathname}</code> doesn't exist.
          </p>
        </div>
        <div className="pt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm hover:bg-foreground/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
