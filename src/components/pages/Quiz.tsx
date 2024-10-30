import React, { useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { QuestionMark, Close } from '@mui/icons-material';
import QuestionChoice from '../basic/QuestionChoice';
import ImageButton from '../basic/ImageButton';
import { motion } from 'framer-motion';

interface Question {
    id: number;
    text: string;
}

interface Answer {
    id: number;
    answerIndex: number;
}

interface QuizProps {
    questions: Question[]; // Список вопросов
    onExit: () => void; // Функция для выхода из теста
    onFinish: (answers: Answer[]) => void; // Функция при завершении теста 
}

export const Quiz: React.FC<QuizProps> = ({ questions, onExit, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
    const [isExiting, setIsExiting] = useState(false); // Состояние для управления анимацией выхода

    const currentQuestion = questions[currentQuestionIndex] || '';

    const handleConfirm = (ansIndex: number) => {
        setSelectedAnswers([...selectedAnswers, { id: currentQuestion.id, answerIndex: ansIndex }]);
        setIsExiting(true); // Устанавливаем состояние выхода

        // Задержка перед переходом к следующему вопросу
        setTimeout(() => {
            setIsExiting(false); // Сбрасываем состояние выхода
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            
            // Завершение теста, если это последний вопрос
            if (currentQuestionIndex === questions.length - 1) {
                onFinish([...selectedAnswers, { id: currentQuestion.id, answerIndex: ansIndex }]);
            }
        }, 500); // Задержка, равная длительности анимации
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', // Занять всю высоту экрана
            justifyContent: 'space-between', // Разделить пространство между элементами
            padding: 2 // Добавить отступы
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                {/* Кнопка закрытия теста */}
                <ImageButton onClick={onExit}><Close /></ImageButton>
                {/* Прогресс-бар */}
                <LinearProgress 
                    variant="determinate" 
                    value={(currentQuestionIndex / questions.length) * 100} 
                    sx={{ flexGrow: 1, marginLeft: 2 }} // Занять оставшееся пространство
                />
            </Box>

            <Box key={currentQuestionIndex} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', // Центрирование по горизонтали
                flexGrow: 1 // Занять оставшееся пространство
            }}>
                {/* Анимация текста вопроса */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} // Начальное состояние
                    animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }} // Конечное состояние
                    exit={{ opacity: 0, y: 20 }} // Состояние при выходе
                    transition={{ duration: 0.5 }} // Длительность анимации
                >
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {currentQuestion.text}
                    </Typography>
                </motion.div>

                {/* Анимация иконки вопроса */}
                <motion.div 
                    initial={{ scale: 0 }} // Начальное состояние
                    animate={{ scale: isExiting ? 0 : 1 }} // Конечное состояние
                    exit={{ scale: 0 }} // Состояние при выходе
                    transition={{ duration: 0.5 }} // Длительность анимации
                >
                    <QuestionMark sx={{ fontSize: "100px" }} />
                </motion.div>
            </Box>

            {/* Выбор ответа */}
            <QuestionChoice onFinish={handleConfirm} />
        </Box>
    );
};

export default Quiz;
