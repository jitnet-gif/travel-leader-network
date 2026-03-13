import { supabase } from '../services/supabase.js';

export const requireAuth = async (req, res, next) => {
  if (process.env.SUPABASE_BYPASS_AUTH === 'true') {
    req.user = { role: 'admin' };
    return next();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  req.user = {
    id: data.user.id,
    role: data.user.user_metadata?.role || data.user.app_metadata?.role
  };
  return next();
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(403).json({ error: 'Missing role' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient role' });
  }
  return next();
};
