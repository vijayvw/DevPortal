import { Router } from 'express';
import { skillController } from './skill.controller';

export const skillRouter = Router();

skillRouter.get(
  '/',
  skillController.list.bind(skillController),
);
