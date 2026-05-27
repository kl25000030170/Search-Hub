
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 relative">
        <ShoppingBag className="w-12 h-12 text-primary relative z-10" />
        <span className="absolute -bottom-2 -right-2 text-4xl font-black opacity-30">?</span>
      </div>
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
