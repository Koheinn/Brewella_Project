import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = 'brewella_secret_key_2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Setup uploads directory
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

  // Authentication Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.user_role === 'Admin') {
      next();
    } else {
      res.sendStatus(403);
    }
  };

  // API Routes

  // Auth
  app.post('/api/auth/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const insert = db.prepare('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)');
      const info = insert.run(first_name, last_name, email, hashedPassword);
      res.json({ success: true, user_id: info.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user || user.status === 'Suspended') {
        return res.status(401).json({ error: 'Invalid credentials or account suspended' });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ user_id: user.user_id, email: user.email, user_role: user.user_role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { user_id: user.user_id, first_name: user.first_name, last_name: user.last_name, email: user.email, user_role: user.user_role } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    try {
      const user = db.prepare('SELECT user_id, first_name, last_name, email, user_role, status FROM users WHERE user_id = ?').get(req.user.user_id);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Menu
  app.get('/api/menu', (req, res) => {
    try {
      const menus = db.prepare('SELECT * FROM menus').all();
      res.json(menus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/menu', authenticate, requireAdmin, upload.single('image'), (req: any, res) => {
    const { menu_name, menu_description, menu_price } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    try {
      const insert = db.prepare('INSERT INTO menus (menu_name, menu_description, menu_price, menu_image_path, uploaded_user_id) VALUES (?, ?, ?, ?, ?)');
      insert.run(menu_name, menu_description, menu_price, imagePath, req.user.user_id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/menu/:id', authenticate, requireAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM menus WHERE menu_id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Tables CRUD
  app.post('/api/admin/tables', authenticate, requireAdmin, (req: any, res) => {
    const { table_number, capacity, area } = req.body;
    try {
      const insert = db.prepare('INSERT INTO cafe_tables (table_number, capacity, area) VALUES (?, ?, ?)');
      insert.run(table_number, capacity, area);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/tables/:id', authenticate, requireAdmin, (req, res) => {
    const { table_number, capacity, area } = req.body;
    try {
      db.prepare('UPDATE cafe_tables SET table_number = ?, capacity = ?, area = ? WHERE table_id = ?').run(table_number, capacity, area, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/tables/:id', authenticate, requireAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM cafe_tables WHERE table_id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Bookings
  app.get('/api/tables', (req, res) => {
    try {
      const tables = db.prepare('SELECT * FROM cafe_tables').all();
      res.json(tables);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/bookings', authenticate, (req: any, res) => {
    const { table_id, booking_date, booking_time, guest_count, customer_name, customer_phone, customer_email, special_request } = req.body;
    try {
      const existing = db.prepare(`
        SELECT * FROM bookings 
        WHERE table_id = ? AND booking_date = ? 
        AND status NOT IN ('Cancelled', 'Completed')
      `).get(table_id, booking_date);
      
      if (existing) {
        return res.status(400).json({ error: 'This table is already booked for the selected date' });
      }
      
      const insert = db.prepare('INSERT INTO bookings (user_id, table_id, booking_date, booking_time, guest_count, customer_name, customer_phone, customer_email, special_request) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      insert.run(req.user.user_id, table_id, booking_date, booking_time, guest_count, customer_name, customer_phone, customer_email, special_request);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/bookings/available/:date', (req, res) => {
    try {
      const bookedTables = db.prepare(`
        SELECT table_id FROM bookings 
        WHERE booking_date = ? AND status NOT IN ('Cancelled', 'Completed')
      `).all(req.params.date);
      res.json(bookedTables.map((b: any) => b.table_id));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/bookings/me', authenticate, (req: any, res) => {
    try {
      const bookings = db.prepare(`
        SELECT b.*, t.table_number, t.area 
        FROM bookings b 
        JOIN cafe_tables t ON b.table_id = t.table_id 
        WHERE b.user_id = ? 
        ORDER BY b.booking_date DESC, b.booking_time DESC
      `).all(req.user.user_id);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/bookings', authenticate, requireAdmin, (req, res) => {
    try {
      const bookings = db.prepare(`
        SELECT b.*, t.table_number, t.area 
        FROM bookings b 
        JOIN cafe_tables t ON b.table_id = t.table_id 
        ORDER BY b.booking_date DESC, b.booking_time DESC
      `).all();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/bookings/:id/status', authenticate, requireAdmin, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE bookings SET status = ? WHERE booking_id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Posts
  app.get('/api/posts', (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = null;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          userId = decoded.user_id;
        } catch (e) {
          // Ignore invalid token for public feed
        }
      }

      const posts = db.prepare(`
        SELECT 
          p.*, u.first_name, u.last_name,
          (SELECT COUNT(*) FROM post_reactions WHERE post_id = p.post_id) as likes_count,
          (SELECT COUNT(*) FROM post_comments WHERE post_id = p.post_id) as comments_count,
          (SELECT reaction_type FROM post_reactions WHERE post_id = p.post_id AND user_id = ?) as user_reaction
        FROM posts p 
        JOIN users u ON p.user_id = u.user_id 
        WHERE p.status = 'published'
        ORDER BY p.created_at DESC
      `).all(userId);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/posts/:id/comments', (req, res) => {
    try {
      const comments = db.prepare(`
        SELECT c.*, u.first_name, u.last_name 
        FROM post_comments c 
        JOIN users u ON c.user_id = u.user_id 
        WHERE c.post_id = ? 
        ORDER BY c.created_at DESC
      `).all(req.params.id);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/posts/:id/comments', authenticate, (req: any, res) => {
    const { comment } = req.body;
    try {
      const insert = db.prepare('INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)');
      const info = insert.run(req.params.id, req.user.user_id, comment);
      
      const newComment = db.prepare(`
        SELECT c.*, u.first_name, u.last_name 
        FROM post_comments c 
        JOIN users u ON c.user_id = u.user_id 
        WHERE c.comment_id = ?
      `).get(info.lastInsertRowid);
      
      res.json(newComment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/posts/:id/reactions', authenticate, (req: any, res) => {
    const { reaction_type } = req.body; // e.g., 'like'
    try {
      const existing = db.prepare('SELECT * FROM post_reactions WHERE post_id = ? AND user_id = ?').get(req.params.id, req.user.user_id);
      
      if (existing) {
        if (reaction_type) {
          db.prepare('UPDATE post_reactions SET reaction_type = ? WHERE post_id = ? AND user_id = ?').run(reaction_type, req.params.id, req.user.user_id);
        } else {
          db.prepare('DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?').run(req.params.id, req.user.user_id);
        }
      } else if (reaction_type) {
        db.prepare('INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES (?, ?, ?)').run(req.params.id, req.user.user_id, reaction_type);
      }
      
      const likes_count = db.prepare('SELECT COUNT(*) as count FROM post_reactions WHERE post_id = ?').get(req.params.id) as any;
      res.json({ success: true, likes_count: likes_count.count, user_reaction: reaction_type || null });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/posts', authenticate, requireAdmin, (req, res) => {
    try {
      const posts = db.prepare(`
        SELECT p.*, u.first_name, u.last_name 
        FROM posts p 
        JOIN users u ON p.user_id = u.user_id 
        ORDER BY p.created_at DESC
      `).all();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/posts', authenticate, requireAdmin, upload.single('image'), (req: any, res) => {
    const { title, content, post_type, status } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    try {
      const insert = db.prepare('INSERT INTO posts (user_id, title, content, image_path, post_type, status) VALUES (?, ?, ?, ?, ?, ?)');
      insert.run(req.user.user_id, title, content, imagePath, post_type, status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/posts/:id', authenticate, requireAdmin, upload.single('image'), (req: any, res) => {
    const { title, content, post_type, status } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : req.body.existing_image;
    try {
      db.prepare('UPDATE posts SET title = ?, content = ?, image_path = ?, post_type = ?, status = ? WHERE post_id = ?').run(title, content, imagePath, post_type, status, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/posts/:id', authenticate, requireAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM posts WHERE post_id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Issues
  app.post('/api/issues', authenticate, (req: any, res) => {
    const { title, description } = req.body;
    try {
      const insert = db.prepare('INSERT INTO issues (user_id, title, description) VALUES (?, ?, ?)');
      insert.run(req.user.user_id, title, description);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/issues/me', authenticate, (req: any, res) => {
    try {
      const issues = db.prepare('SELECT * FROM issues WHERE user_id = ? ORDER BY created_at DESC').all(req.user.user_id);
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/issues/:id/comments', authenticate, (req: any, res) => {
    try {
      const comments = db.prepare(`
        SELECT c.*, u.first_name, u.last_name, u.user_role 
        FROM issue_comments c 
        JOIN users u ON c.user_id = u.user_id 
        WHERE c.issue_id = ? 
        ORDER BY c.created_at ASC
      `).all(req.params.id);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/issues/:id/comments', authenticate, (req: any, res) => {
    const { comment } = req.body;
    try {
      const insert = db.prepare('INSERT INTO issue_comments (issue_id, user_id, comment) VALUES (?, ?, ?)');
      const info = insert.run(req.params.id, req.user.user_id, comment);
      
      const newComment = db.prepare(`
        SELECT c.*, u.first_name, u.last_name, u.user_role 
        FROM issue_comments c 
        JOIN users u ON c.user_id = u.user_id 
        WHERE c.comment_id = ?
      `).get(info.lastInsertRowid);
      
      res.json(newComment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/issues', authenticate, requireAdmin, (req, res) => {
    try {
      const issues = db.prepare(`
        SELECT i.*, u.first_name, u.last_name, u.email 
        FROM issues i 
        JOIN users u ON i.user_id = u.user_id 
        ORDER BY i.created_at DESC
      `).all();
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/issues/:id/status', authenticate, requireAdmin, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE issues SET status = ? WHERE issue_id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Users
  app.get('/api/admin/users', authenticate, requireAdmin, (req, res) => {
    try {
      const users = db.prepare('SELECT user_id, first_name, last_name, email, user_role, status FROM users').all();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/users/:id/status', authenticate, requireAdmin, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE users SET status = ? WHERE user_id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.prepare('SELECT * FROM shop_settings').all();
      const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.setting_key] = curr.setting_value;
        return acc;
      }, {});
      res.json(settingsObj);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/settings', authenticate, requireAdmin, (req, res) => {
    const { opening_time, closing_time, shop_status } = req.body;
    try {
      if (opening_time) db.prepare('UPDATE shop_settings SET setting_value = ? WHERE setting_key = ?').run(opening_time, 'opening_time');
      if (closing_time) db.prepare('UPDATE shop_settings SET setting_value = ? WHERE setting_key = ?').run(closing_time, 'closing_time');
      if (shop_status) db.prepare('UPDATE shop_settings SET setting_value = ? WHERE setting_key = ?').run(shop_status, 'shop_status');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
