import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config();

const router = express.Router();

router.get('/:auth0_id', async (req, res) => {
  const { auth0_id } = req.params;

  try {
    const query = `
      SELECT u.id, u.auth0_id, u.username, u.role, u.plan, u.created_at,
             up.language, up.theme, up.email_notifications, up.beta_features_opt_in, up.updated_at
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.auth0_id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [auth0_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:auth0_id', async (req, res) => {
  const { auth0_id } = req.params;
  const { language, theme, email_notifications, beta_features_opt_in } = req.body;

  try {
    const updateQuery = `
      UPDATE user_preferences up
      SET language = $1,
          theme = $2,
          email_notifications = $3,
          beta_features_opt_in = $4,
          updated_at = NOW()
      FROM users u
      WHERE up.user_id = u.id AND u.auth0_id = $5
      RETURNING up.*
    `;

    const updateValues = [language, theme, email_notifications, beta_features_opt_in, auth0_id];
    const { rows } = await pool.query(updateQuery, updateValues);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
