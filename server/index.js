const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// SQLite Database Setup
const dbPath = process.env.NODE_ENV === 'production' ? '/app/data/budget_tracker.db' : './budget_tracker.db';
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    hourly_rate REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Budget changes table
  db.run(`CREATE TABLE IF NOT EXISTS budget_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    comment TEXT,
    change_type TEXT NOT NULL CHECK(change_type IN ('increase', 'decrease', 'initial')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  )`);

  // Time entries table
  db.run(`CREATE TABLE IF NOT EXISTS time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_seconds INTEGER DEFAULT 0,
    is_running BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  )`);
});

// API Routes

// Customers CRUD
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, hourly_rate } = req.body;
  
  db.run(
    'INSERT INTO customers (name, email, phone, hourly_rate) VALUES (?, ?, ?, ?)',
    [name, email, phone, hourly_rate],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, email, phone, hourly_rate });
    }
  );
});

app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, hourly_rate } = req.body;
  
  db.run(
    'UPDATE customers SET name = ?, email = ?, phone = ?, hourly_rate = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, hourly_rate, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, email, phone, hourly_rate });
    }
  );
});

app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// Budget changes
app.get('/api/customers/:id/budget-changes', (req, res) => {
  const { id } = req.params;
  
  db.all(
    'SELECT * FROM budget_changes WHERE customer_id = ? ORDER BY created_at DESC',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post('/api/customers/:id/budget-changes', (req, res) => {
  const { id } = req.params;
  const { amount, comment, change_type } = req.body;
  
  db.run(
    'INSERT INTO budget_changes (customer_id, amount, comment, change_type) VALUES (?, ?, ?, ?)',
    [id, amount, comment, change_type],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, customer_id: id, amount, comment, change_type });
    }
  );
});

// Time entries
app.get('/api/customers/:id/time-entries', (req, res) => {
  const { id } = req.params;
  
  db.all(
    'SELECT * FROM time_entries WHERE customer_id = ? ORDER BY created_at DESC',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post('/api/customers/:id/time-entries', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const start_time = new Date().toISOString();
  
  db.run(
    'INSERT INTO time_entries (customer_id, description, start_time, is_running) VALUES (?, ?, ?, 1)',
    [id, description, start_time],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        customer_id: id, 
        description, 
        start_time, 
        is_running: 1 
      });
    }
  );
});

app.put('/api/time-entries/:id/pause', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM time_entries WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Time entry not found' });
      return;
    }
    
    const now = new Date();
    const startTime = new Date(row.start_time);
    const durationSeconds = Math.floor((now - startTime) / 1000) + row.duration_seconds;
    
    db.run(
      'UPDATE time_entries SET duration_seconds = ?, is_running = 0 WHERE id = ?',
      [durationSeconds, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Time entry paused', duration_seconds: durationSeconds });
      }
    );
  });
});

app.put('/api/time-entries/:id/resume', (req, res) => {
  const { id } = req.params;
  const start_time = new Date().toISOString();
  
  db.run(
    'UPDATE time_entries SET start_time = ?, is_running = 1 WHERE id = ?',
    [start_time, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Time entry resumed', start_time });
    }
  );
});

app.put('/api/time-entries/:id/finish', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM time_entries WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Time entry not found' });
      return;
    }
    
    const now = new Date();
    const startTime = new Date(row.start_time);
    const durationSeconds = Math.floor((now - startTime) / 1000) + row.duration_seconds;
    
    db.run(
      'UPDATE time_entries SET end_time = ?, duration_seconds = ?, is_running = 0 WHERE id = ?',
      [now.toISOString(), durationSeconds, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Time entry finished', duration_seconds: durationSeconds });
      }
    );
  });
});

// Customer overview with budget calculation
app.get('/api/customers/:id/overview', (req, res) => {
  const { id } = req.params;
  
  // Get customer info
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    
    // Get budget changes
    db.all(
      'SELECT * FROM budget_changes WHERE customer_id = ? ORDER BY created_at ASC',
      [id],
      (err, budgetChanges) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Get time entries
        db.all(
          'SELECT * FROM time_entries WHERE customer_id = ? ORDER BY created_at ASC',
          [id],
          (err, timeEntries) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            // Calculate total budget
            let totalBudget = 0;
            budgetChanges.forEach(change => {
              if (change.change_type === 'increase' || change.change_type === 'initial') {
                totalBudget += change.amount;
              } else if (change.change_type === 'decrease') {
                totalBudget -= change.amount;
              }
            });
            
            // Calculate total time costs
            let totalTimeCosts = 0;
            timeEntries.forEach(entry => {
              const hours = entry.duration_seconds / 3600;
              totalTimeCosts += hours * customer.hourly_rate;
            });
            
            const remainingBudget = totalBudget - totalTimeCosts;
            
            res.json({
              customer,
              budgetChanges,
              timeEntries,
              totalBudget,
              totalTimeCosts,
              remainingBudget
            });
          }
        );
      }
    );
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
