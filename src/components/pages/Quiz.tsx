import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Button, Modal } from '@mui/material';
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

const ResultModal: React.FC<{ open: boolean, score: number, onClose: () => void }> = ({ open, score, onClose }) => {
    const radius = 100; // Радиус кружка
    const circumference = 2 * Math.PI * radius; // Длина окружности
    const strokeDashoffset = circumference - (score / 100) * circumference; // Смещение для заполнения

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant='h5' sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: "#4a4a4a"
                }}>
                    Ваш результат
                </Typography>
                <svg width="240" height="240">
                    <circle cx="120" cy="120" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
                    <circle
                        cx="120"
                        cy="120"
                        r={radius}
                        fill="none"
                        stroke="#3f51b5"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <Typography variant="body1">{score} из 100</Typography>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#4d60bf', // Цвет кнопки
                        color: 'white', // Цвет текста
                        borderRadius: '30px', // Скруглённые края
                        textTransform: 'none', // Убрать CAPS
                        fontSize: '1.1rem', // Увеличенный размер текста
                        fontWeight: 700, // Жирный текст
                        fontFamily: "'Poppins', Arial, sans-serif",
                        letterSpacing: '0.05em', // Расширение текста
                        padding: '10px 20px', // Пространство внутри кнопки
                        '&:hover': { backgroundColor: '#1e4dc7' }, // Тёмный оттенок при наведении
                    }}
                >
                    Завершить
                </Button>
            </Box>
        </Modal>
    );
};

export const Quiz: React.FC<QuizProps> = ({ onExit }) => {
    const navigate = useNavigate();
    const test_id = useParams().id || "default";
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("Вопрос загружается");
    const [resultId, setResultId] = useState("");
    const [questionCount, setQuestionCount] = useState(1);
    const [isExiting, setIsExiting] = useState(false);
    const delay = 500;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (test_id === "default") {
            console.warn("Wrong test_id!");
            return;
        }

        const fetchTest = async () => {
            try {
                const test = await getTest(test_id);
                setQuestionCount(test.questions_count);
            } catch (err) {
                console.error("Не удалось загрузить тест", err);
            }
        };

        const start = async () => {
            try {
                const resultId = await startTest(test_id, userData.getIsu());
                setResultId(resultId.result_id);
            } catch (err) {
                console.error("Не удалось начать тест", err);
            }
        };

        fetchTest();
        start();
    }, [test_id]);

    useEffect(() => {
        if (test_id === "default") {
            console.warn("Wrong test_id!");
            return;
        }

        const fetchQuestion = async () => {
            try {
                const question = await getQuestion(test_id, currentQuestionIndex);
                setCurrentQuestion(question.description);
            } catch (err) {
                console.error("Не удалось загрузить вопрос", err);
            }
        };

        fetchQuestion();
    }, [test_id, currentQuestionIndex]);

    const handleConfirm = async (ansIndex: number) => {
        if (resultId === "") {
            return;
        }

        setIsExiting(true);
        try {
            await answerQuestion(resultId, currentQuestionIndex, ansIndex);
        } catch (err) {
            console.error("Не удалось отправить ответ", err);
        }

        setTimeout(async () => {
            setIsExiting(false);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

            if (currentQuestionIndex === questionCount - 1) {
                const finalScore = Math.round((await completeTest(resultId)).score); // Подсчет финального результата
                setScore(finalScore);
                setIsModalOpen(true); // Открываем модальное окно
            }
        }, delay);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate("/tests"); // Переход на страницу тестов после закрытия модального окна
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '90vh',
            justifyContent: 'space-between',
            padding: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <ImageButton className="quiz-close" onClick={onExit}><Close /></ImageButton>
                <LinearProgress
                    variant="determinate"
                    value={(currentQuestionIndex / questionCount) * 100}
                    sx={{ flexGrow: 1, marginLeft: 2 }}
                />
            </Box>

            <Box key={currentQuestionIndex} sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h6"
                        sx={{
                            marginBottom: 2,
                            textAlign: 'center',
                            lineHeight: 1.5,
                            color: 'text.primary',
                            padding: 2
                        }}>
                        {currentQuestion}
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isExiting ? 0 : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: delay / 1000 }}
                >
                    <QuestionMark sx={{ fontSize: "100px" }} />
                </motion.div>
            </Box>
            <QuestionChoice onFinish={handleConfirm} />

            <ResultModal open={isModalOpen} score={score} onClose={handleCloseModal} />
        </Box>
    );
};

export default Quiz;
