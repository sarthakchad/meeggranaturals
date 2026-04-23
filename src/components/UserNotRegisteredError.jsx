export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg border border-border text-center">
        <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
        <p className="text-muted-foreground">You are not registered to use this application.</p>
      </div>
    </div>
  );
}
