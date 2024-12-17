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
  { id: 'dreams', title: 'Мечты', icon: '/images/dreams.jpg', section: 'О личном', premium: true },
  { id: 'psychology', title: 'Психология', icon: '/images/psychology.jpg', section: 'О личном', premium: true },
  { id: 'household', title: 'Бытовуха', icon: '/images/household.jpg', section: 'Поговорим серьезно?', premium: true },
  { id: 'future', title: 'Будущее', icon: '/images/future.jpg', section: 'Поговорим серьезно?', premium: true },
  { id: 'hobby', title: 'Хобби', icon: '/images/hobby.jpg', section: 'Обо всем на свете', premium: true },
  { id: 'media', title: 'Медиа', icon: '/images/media.jpg', section: 'Обо всем на свете', premium: true },
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
        <Typography variant="h4" fontWeight="bold">
          Tests
        </Typography>
      </Box>

      {sections.map((section) => (
        <Box key={section} mb={4}>
          {/* Заголовок раздела */}
          <Typography variant="h5" sx={{ mb: 2 }}>
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
                        <Typography variant="subtitle1" fontWeight="bold">
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
