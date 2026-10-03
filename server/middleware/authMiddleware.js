import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  // Handle Demo mode token directly
  if (token === 'demo_token_smartclinic_guest') {
    req.user = {
      _id: 'demo_user_divya',
      id: 'demo_user_divya',
      name: 'M. Durga (Demo PM)',
      email: 'demo@aihandoff.com',
      role: 'Project Manager'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_handoff_super_secret_jwt_key_2026');
    const user = await User.findById(decoded.id);

    if (!user) {
      // Fallback for demo/ephemeral session
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'Project Member',
        email: decoded.email || 'member@aihandoff.io',
        role: decoded.role || 'Project Member'
      };
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed'
    });
  }
}
