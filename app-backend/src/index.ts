// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const restaurants = {
  1: {
    id: 1,
    name: 'restaurant 1',
    description: 'description 1',
  },
  2: {
    id: 2,
    name: 'restaurant 2',
    description: 'description 2',
  },
};

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/restaurants', (req: Request, res: Response) => {
  res.send(Object.values(restaurants));
});

app.get('/restaurants/:id', (req: Request, res: Response) => {
  const restaurant = restaurants[req.params.id];
  res.send(restaurant);
});
