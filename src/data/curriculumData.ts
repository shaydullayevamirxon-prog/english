import { GradeCurriculum } from '../types';
import { ELEMENTARY_GRADES } from './elementaryGrades';
import { MIDDLE_GRADES } from './middleGrades';
import { HIGH_GRADES } from './highGrades';

export const INITIAL_CURRICULUM: GradeCurriculum[] = [
  ...ELEMENTARY_GRADES,
  ...MIDDLE_GRADES,
  ...HIGH_GRADES,
];
