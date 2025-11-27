import { Category, SubType } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.MINISTRY]: 'bg-orange-100 text-orange-800 border-orange-300', // Laranja (RF1)
  [Category.FAMILY]: 'bg-blue-100 text-blue-800 border-blue-300',       // Azul (RF1)
  [Category.PERSONAL_GROWTH]: 'bg-green-100 text-green-800 border-green-300' // Verde (RF1)
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.MINISTRY]: 'Ministério',
  [Category.FAMILY]: 'Família',
  [Category.PERSONAL_GROWTH]: 'Crescimento Pessoal'
};

export const SUBTYPE_LABELS: Record<SubType, string> = {
  [SubType.SERMON_PREP]: 'Preparação de Sermão',
  [SubType.MEETING]: 'Reunião',
  [SubType.SERVICE]: 'Culto',
  [SubType.VISITATION]: 'Visitação',
  [SubType.DEVOTIONAL]: 'Devocional',
  [SubType.INTERCESSION]: 'Intercessão',
  [SubType.STUDY]: 'Estudo',
  [SubType.EXERCISE]: 'Exercício',
  [SubType.DATE_NIGHT]: 'Tempo com Esposa/Filhos',
  [SubType.LEISURE]: 'Lazer',
  [SubType.CHORE]: 'Tarefa Doméstica',
  [SubType.GENERIC]: 'Geral'
};

export const DAYS_OF_WEEK = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];