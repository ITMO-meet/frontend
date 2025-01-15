import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { QuestionMark, Close } from '@mui/icons-material';
import QuestionChoice from '../basic/QuestionChoice';
import ImageButton from '../basic/ImageButton';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { answerQuestion, completeTest, getQuestion, getTest, startTest } from '../../api/tests';
import { userData } from '../../stores/UserDataStore';

interface QuizProps {
    onExit: () => void; // Функция для выхода из теста
}

export const Quiz: React.FC<QuizProps> = ({ onExit }) => {
    const navigate = useNavigate();

    const test_id = useParams().id || "default"
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("Вопрос загружается");
    const [resultId, setResultId] = useState("");
    const [questionCount, setQuestionCount] = useState(1);

    const [isExiting, setIsExiting] = useState(false); // Состояние для управления анимацией выхода
    const delay = 500; // Задержка для анимаций


    // load question count and resultId
    useEffect(() => {        
        if (test_id == "default") {
            console.warn("Wrong test_id!");
            return;
        }

        const fetchTest = async () => {
            try {
                const test = await getTest(test_id);
                setQuestionCount(test.questions_count);
            } catch (err) {
                console.error("Не удалось загрузить тест");
            }
        }
        const start = async () => {
            try {
                const resultId = await startTest(test_id, userData.getIsu());
                setResultId(resultId.result_id);
            } catch (err) {
                console.error("Не удалось начать тест");
            }
        }
        
        fetchTest();
        start();
    }, [test_id]);

    // load current question
    useEffect(() => {
        if (test_id == "default") {
            console.warn("Wrong test_id!");
            return;
        }

        const fetchQuestion = async () => {
            try {
                const question = await getQuestion(test_id, currentQuestionIndex);
                setCurrentQuestion(question.description);
            } catch (err) {
                console.error("Не удалось загрузить вопрос");
            }
        }
        
        fetchQuestion();
    }, [test_id, currentQuestionIndex]);

    const handleConfirm = (ansIndex: number) => {
        if (resultId === "") {
            return;
        }

        setIsExiting(true); // Устанавливаем состояние выхода
        try {
            answerQuestion(resultId, currentQuestionIndex, ansIndex);
        } catch (err) {
            console.error("Не отправить ответ");
        }

        // Задержка перед переходом к следующему вопросу
        setTimeout(() => {
            setIsExiting(false); // Сбрасываем состояние выхода
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            
            // Завершение теста, если это последний вопрос
            if (currentQuestionIndex === questionCount - 1) {
                completeTest(resultId);
                navigate("/tests");
            }
        }, delay); // Задержка, равная длительности анимации
    };


    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '90vh', // Занять всю высоту экрана
            justifyContent: 'space-between', // Разделить пространство между элементами
            padding: 2, // Добавить отступы
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                {/* Кнопка закрытия теста */}
                <ImageButton className="quiz-close" onClick={onExit}><Close /></ImageButton>
                {/* Прогресс-бар */}
                <LinearProgress 
                    variant="determinate" 
                    value={(currentQuestionIndex / questionCount) * 100} 
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
                    <Typography variant="h6"    
                        sx={{ 
                            marginBottom: 2, 
                            textAlign: 'center', // Центрирование текста
                            lineHeight: 1.5, // Увеличение междустрочного интервала для лучшей читаемости
                            color: 'text.primary', // Цвет текста, можно изменить на любой другой
                            padding: 2 // Добавление отступов, если нужно
                        }}>
                        {currentQuestion}
                    </Typography>
                </motion.div>

                {/* Анимация иконки вопроса */}
                <motion.div 
                    initial={{ scale: 0 }} // Начальное состояние
                    animate={{ scale: isExiting ? 0 : 1 }} // Конечное состояние
                    exit={{ scale: 0 }} // Состояние при выходе
                    transition={{ duration: delay / 1000 }} // Длительность анимации
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
