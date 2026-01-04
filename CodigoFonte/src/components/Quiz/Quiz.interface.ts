export interface QuizQuestion {
	id: number;
	question: string;
	options: QuizOption[];
}

export interface QuizOption {
	id: string;
	text: string;
	icon?: string;
}

export interface QuizVideo {
	thumbnail?: string;
	url?: string;
	title?: string;
}

export interface QuizActivity {
	id: number;
	activityTitle: string;
	activityDescription: string;
	suggestionLabel?: string;
	downloadButtonText?: string;
	downloadUrl?: string;
	video?: QuizVideo; // Vídeo opcional para o feedback
}

export interface QuizProps {
	totalQuestions?: number;
	currentQuestion?: number;
	activities?: QuizActivity[]; // Array de atividades (etapas com upload)
	onAnswerSelect?: (questionId: number, optionId: string) => void;
	onActivitySubmit?: (activityId: number, files: File[]) => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

