// Enumerações baseadas nos Requisitos (RF1, RF2, RF3)
export enum Category {
  MINISTRY = 'MINISTRY',
  FAMILY = 'FAMILY',
  PERSONAL_GROWTH = 'PERSONAL_GROWTH'
}

export enum SubType {
  // Ministry
  SERMON_PREP = 'SERMON_PREP',
  MEETING = 'MEETING',
  SERVICE = 'SERVICE', // Culto
  VISITATION = 'VISITATION',
  
  // Personal Growth
  DEVOTIONAL = 'DEVOTIONAL',
  INTERCESSION = 'INTERCESSION',
  STUDY = 'STUDY',
  EXERCISE = 'EXERCISE',

  // Family
  DATE_NIGHT = 'DATE_NIGHT',
  LEISURE = 'LEISURE',
  CHORE = 'CHORE',
  
  GENERIC = 'GENERIC'
}

// Estrutura do Objeto de Tarefa (Conforme solicitado na Seção II do prompt)
export interface TaskObject {
  id: string;
  title: string;
  category: Category;
  subType: SubType;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  isRecurring: boolean;
  notes?: string;         // Rich text placeholder
  bibleReference?: string; // RF2: Apenas para SERMON_PREP
}

// Perfil do Usuário para configurações (RF4)
export interface UserProfile {
  name: string;
  restDay: number; // 0 = Domingo, 1 = Segunda, etc.
}

export type ViewMode = 'CALENDAR' | 'REPORT' | 'SETTINGS';