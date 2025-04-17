import express from 'express';
import { resolveMudFile } from '../utils/resolveMudFiles.js';

const router = express.Router();

router.get('/intro', (req, res) => {
  const mud = req.query.mud || 'darkswamp';
  const introText = resolveMudFile(mud, 'intro.md');
  res.send(introText);
});

export default router;
