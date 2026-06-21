import type { RewardItem } from '../types'

// TODO: replace with React Query + Supabase fetch
export const MOCK_REWARDS: RewardItem[] = [
  {
    id: '1',
    earned: true,
    category: 'surprise',
    title: 'Sorpresa misteriosa',
    subtitle: 'Por completar tus primeras 2 lecciones',
    code: 'AURORA-001',
  },
  {
    id: '2',
    earned: true,
    category: 'dinner',
    title: 'Cena especial',
    subtitle: 'Por completar el módulo de Saludos',
    code: 'AURORA-002',
  },
  {
    id: '3',
    earned: false,
    unlockHint: 'Completa "Verbos en pasado"',
  },
  {
    id: '4',
    earned: false,
    unlockHint: 'Mantén una racha de 7 días',
  },
  {
    id: '5',
    earned: false,
    unlockHint: 'Completa 5 lecciones seguidas',
  },
]
