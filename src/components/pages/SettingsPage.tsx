import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Switch,
    Divider,
    IconButton,
    TextField,
    List,
    ListItemText,
    ListItemButton
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NotificationsIcon from '@mui/icons-material/Notifications';
// import LanguageIcon from '@mui/icons-material/Language';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { logEvent, logPageView } from '../../analytics';
import { userData } from '../../stores/UserDataStore';

const SettingsPage: React.FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // const [selectedLanguage, setSelectedLanguage] = useState('Русский');
    const [isNotificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
    const [isLanguageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [isProblemDialogOpen, setProblemDialogOpen] = useState(false);
    const [isExitDialogOpen, setExitDialogOpen] = useState(false);
    const [problemText, setProblemText] = useState('');

    const navigate = useNavigate();

    useEffect(() => { logPageView("/settings") }, []);

    const handleOpenNotificationsDialog = () => setNotificationsDialogOpen(true);
    const handleCloseNotificationsDialog = () => setNotificationsDialogOpen(false);

    // const handleOpenLanguageDialog = () => setLanguageDialogOpen(true);
    const handleCloseLanguageDialog = () => setLanguageDialogOpen(false);

    const handleOpenProblemDialog = () => setProblemDialogOpen(true);
    const handleCloseProblemDialog = () => setProblemDialogOpen(false);

    const handleOpenExitDialog = () => setExitDialogOpen(true);
    const handleCloseExitDialog = () => setExitDialogOpen(false);

    const handleLanguageSelect = (language: string) => {
        // setSelectedLanguage(language);
        logEvent("Settings", "Set language", language);
        setLanguageDialogOpen(false);
    };

    const handleSendProblem = () => {
        logEvent("Settings", "Problem submit", problemText);
        // console.log('Problem submitted:', problemText);
        setProblemText('');
        setProblemDialogOpen(false);
    };

    function handleExit(): void {
        navigate('/login');
    }
    
    return (
        <Box sx={{ px: 2, py: 1 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton data-testid="BackToProfile" onClick={() => navigate('/profile')} sx={{
                    '&:active': {
                        backgroundColor: '#6a8afc', // Цвет при нажатии
                    },
                    borderRadius: '50%', // Круглая форма
                    }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" fontWeight="bold">
                    Настройки
                </Typography>
            </Box>


            <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                Основные
            </Typography>
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Typography>Имя</Typography>
                    <Typography color="text.secondary">{userData.getUsername()}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Typography>Дата рождения</Typography>
                    <Typography color="text.secondary">{userData.getBirthdate()}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Typography>Пол</Typography>
                    <Typography color="text.secondary">{userData.getGender()}</Typography>
                </Box>
            </Box>


            <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
                Приложение
            </Typography>
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1} onClick={handleOpenNotificationsDialog}>
                    <Box display="flex" alignItems="center">
                        <NotificationsIcon sx={{ mr: 1 }} />
                        <Typography>Уведомления</Typography>
                    </Box>
                    <Typography color="text.secondary">{notificationsEnabled ? 'Включены' : 'Выключены'}</Typography>
                </Box>
                {/* <Divider /> */}
                {/* <Box display="flex" justifyContent="space-between" alignItems="center" py={1} onClick={handleOpenLanguageDialog}>
                    <Box display="flex" alignItems="center">
                        <LanguageIcon sx={{ mr: 1 }} />
                        <Typography>Язык</Typography>
                    </Box>
                    <Typography color="text.secondary">{selectedLanguage}</Typography>
                </Box> */}
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1} onClick={handleOpenProblemDialog}>
                    <Box display="flex" alignItems="center">
                        <ReportProblemIcon sx={{ mr: 1 }} />
                        <Typography>Сообщить о проблеме</Typography>
                    </Box>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1} onClick={handleOpenExitDialog}>
                    <Box display="flex" alignItems="center">
                        <ExitToAppIcon sx={{ mr: 1 }} />
                        <Typography>Выйти</Typography>
                    </Box>
                </Box>
            </Box>

            <Dialog open={isNotificationsDialogOpen} onClose={handleCloseNotificationsDialog}>
                <DialogTitle>Уведомления</DialogTitle>
                <DialogContent>
                    <Typography>Включить уведомления?</Typography>
                    <Switch
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNotificationsDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isLanguageDialogOpen} onClose={handleCloseLanguageDialog}>
                <DialogTitle>Выберите язык</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItemButton component="li" onClick={() => handleLanguageSelect('Русский')}>
                            <ListItemText primary="Русский" />
                        </ListItemButton>
                        <ListItemButton component="li" onClick={() => handleLanguageSelect('Английский')}>
                            <ListItemText primary="Английский" />
                        </ListItemButton>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLanguageDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isProblemDialogOpen} onClose={handleCloseProblemDialog}>
                <DialogTitle>Сообщить о проблеме</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Опишите проблему"
                        multiline
                        rows={4}
                        fullWidth
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSendProblem} disabled={!problemText}>
                        Отправить
                    </Button>
                    <Button onClick={handleCloseProblemDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isExitDialogOpen} onClose={handleCloseExitDialog}>
                <DialogTitle>Выйти</DialogTitle>
                <DialogContent>
                    <Typography>Вы уверены, что хотите выйти?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExit} color="error">
                        Да
                    </Button>
                    <Button onClick={handleCloseExitDialog}>Нет</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SettingsPage;
