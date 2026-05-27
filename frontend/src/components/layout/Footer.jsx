import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, CheckCircle } from 'lucide-react';
import { PLATFORM_NAME } from '../../utils/constants';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg">{PLATFORM_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Multi-category search and filter platform for education, technology, books, and
              learning resources.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                ['Search Platform', '/search'],
                ['Categories', '/categories'],
                ['Dashboard', '/dashboard'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2.5">
              {[
                ['Profile', '/profile'],
                ['Sign In', '/login'],
                ['Register', '/register'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Updates
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get search tips and new category alerts.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-success text-sm font-semibold">
                <CheckCircle className="w-4 h-4" /> Subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field pl-9 text-sm py-2.5"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-sm">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© 2026 {PLATFORM_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
