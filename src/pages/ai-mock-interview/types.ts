export type InterviewType = 'TECHNICAL' | 'HR';
export type DifficultyLevel = 'Beginner' | 'Professional';
export type Interviewer = 'John' | 'Jyoti' | 'Lisa' | 'Mike';

export interface InterviewQuestion {
  id: string;
  session_id: string;
  question_text: string;
  question_order: number;
  user_answer?: string;
  created_at?: string;
}

export interface InterviewSession {
  id: string;
  job_role: string;
  industry: string;
  company?: string;
  job_description?: string;
  interview_type: string;
  difficulty_level?: string;
  interviewer: string;
  custom_questions: string[];
  status: string;
  feedback?: any;
  video_url?: string;
  created_at?: string;
}
