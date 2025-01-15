import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Test {
  id: string;
  title: string;
  icon: string;
  section: string;
  premium: boolean;
}

const tests: Test[] = [
  { id: '6787dc30c35a41da41946137', title: 'Мечты', icon: '/images/dreams.jpg', section: 'О личном', premium: true },
  { id: '6787db23c35a41da41946132', title: 'Психология', icon: '/images/psychology.jpg', section: 'О личном', premium: true },
  { id: '6787db90c35a41da41946134', title: 'Бытовуха', icon: '/images/household.jpg', section: 'Поговорим серьезно?', premium: true },
  { id: '6787cbc24260c6a278175e8c', title: 'Будущее', icon: '/images/future.jpg', section: 'Поговорим серьезно?', premium: true },
  { id: '6787dbe4c35a41da41946135', title: 'Хобби', icon: '/images/hobby.jpg', section: 'Обо всем на свете', premium: true },
  { id: '6787dc0ac35a41da41946136', title: 'Медиа', icon: '/images/media.jpg', section: 'Обо всем на свете', premium: true },
  // { id: '6787db67c35a41da41946133', title: 'Мем', icon: '', section: 'Другое))', premium: true },
  // { id: '6787dc52c35a41da41946138', title: 'Фетиши', icon: '', section: 'Другое))', premium: true },
];

const TestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  const handleTestClick = (testId: string) => {
    if (completedTests.includes(testId)) {
      console.log('Test already completed'); // Add this line for debugging
      alert('Тест уже пройден. Показываем результат.');
    } else {
      setCompletedTests([...completedTests, testId]);
      navigate(`/tests/${testId}`);
    }
  };

  const sections = Array.from(new Set(tests.map((test) => test.section)));

  return (
    <Box p={2}>
      {/* Заголовок страницы */}
      <Box mb={3} textAlign="center">
        <Typography variant="h4"
                align="center"
                gutterBottom
                sx={{
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>
          Тесты
        </Typography>
      </Box>

      {sections.map((section) => (
        <Box key={section} mb={4}>
          {/* Заголовок раздела */}
          <Typography variant="h5" sx={{
                    color: '#4a4a4a', 
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                    mb: 2,
                }}>
            {section}
          </Typography>

          {/* Сетка тестов */}
          <Grid container spacing={2}>
            {tests
              .filter((test) => test.section === section)
              .map((test) => (
                <Grid item xs={6} sm={4} key={test.id}>
                  <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <CardActionArea onClick={() => handleTestClick(test.id)}>
                      {/* Фото теста с заполнением квадрата */}
                      <Box
                        sx={{
                          width: '100%',
                          height: '150px', 
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={test.icon}
                          alt={test.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', 
                            display: 'block',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" 
                        sx={{color: '#4a4a4a' }}>
                          {test.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default TestsPage;
