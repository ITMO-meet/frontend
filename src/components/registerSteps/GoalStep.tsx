// GoalStep.tsx
import { Box, Card, CardContent, Typography } from '@mui/material'; // Импортируем необходимые компоненты из MUI
import React from 'react'; // Импортируем React
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import theme from '../theme'; // Импортируем тему для стилизации

// Массив с целями, каждая цель имеет уникальный id, заголовок и описание
const goals = [
  { id: 1, title: 'Знакомства', description: 'Найти новых друзей и знакомых.' },
  { id: 2, title: 'Отношения', description: 'Построить романтические отношения.' },
  { id: 3, title: 'Дружба', description: 'Найти верных друзей.' },
  { id: 4, title: 'Общение', description: 'Улучшить навыки общения.' },
];

// Определяем интерфейс для пропсов компонента
interface GoalStepProps {
  onNext: (data: { goal: string }) => void; // Функция, которая будет вызвана при выборе цели
}

// Основной компонент GoalStep
const GoalStep: React.FC<GoalStepProps> = ({ onNext }) => {
  const [selectedGoal, setSelectedGoal] = React.useState<number | null>(null); // Хук состояния для хранения выбранной цели

  // Функция для обработки выбора цели
  const handleGoalSelect = (goalId: number) => {
    setSelectedGoal(goalId); // Устанавливаем выбранную цель
  };

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    if (selectedGoal !== null) { // Проверяем, что цель выбрана
      const selectedGoalData = goals.find(goal => goal.id === selectedGoal); // Находим выбранную цель по id
      if (selectedGoalData) {
        onNext({ goal: selectedGoalData.title }); // Вызываем функцию onNext с заголовком выбранной цели
      }
    }
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>What are you looking for?</Typography> {/* Заголовок */}
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>It can be changed at any time</Typography> {/* Подзаголовок с инструкцией */}
      {goals.map(({ id, title, description }) => ( // Перебираем массив целей и отображаем их
        <Card
          key={id} // Уникальный ключ для каждого элемента
          onClick={() => handleGoalSelect(id)} // Обработчик клика для выбора цели
          style={{
            margin: '10px 0', // Отступы между карточками
            cursor: 'pointer', // Указатель при наведении
            background: selectedGoal === id ? theme.palette.secondary.light : "white", // Изменяем фон выбранной карточки
          }}
        >
          <CardContent>
            <Typography variant="h6">{title}</Typography> {/* Заголовок цели */}
            <Typography variant="body2" color="textSecondary">
              {description} {/* Описание цели */}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <RoundButton 
        disabled={selectedGoal === null} // Кнопка отключена, если цель не выбрана
        onClick={handleSubmit} // Обработчик клика по кнопке
        sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
      >
        Next
      </RoundButton>
    </Box>
  );
};

export default GoalStep; // Экспортируем компонент для использования в других частях приложения
