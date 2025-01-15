/**
 * Компонент EditProfilePage
 * 
 * Этот компонент представляет страницу редактирования профиля, где пользователь может:
 * - Просматривать и редактировать свою биографию и цели пребывания в приложении знакомств.
 * - Выбирать различные основные параметры (например, рост, мировоззрение, знак зодиака) с помощью различных методов ввода.
 * - Выбирать несколько интересов из заранее заданного списка.
 * - Управлять своей фотогалереей с возможностью редактировать или удалять изображения.
 * - Доступ к кнопке "Премиум" для дополнительного функционала (например, подписки на премиум).
 *
 * Компонент разделен на несколько секций, каждая из которых выполняет свою конкретную функцию:
 * - Заголовок: Отображает кнопку "Назад", которая отправляет на страницу ProfilePage.
 * - Биография: Позволяет пользователю редактировать краткую биографию.
 * - Цель: Позволяет выбрать цель или предпочтения в отношениях.
 * - Основные параметры: Предоставляет выбор различных категорий (например, рост, мировоззрение) с использованием различных типов ввода.
 * - Интересы: Позволяет выбрать интересы из списка.
 * - Галерея: Отображает сетку изображений с возможностью редактирования и удаления.
 * - Кнопка "Премиум": Кнопка внизу страницы для продвижения премиум-функций.
 */

/*TODO: 1. Добавить навигацию на кнопку назад в хэдере
        2. Цель пребывания изначально подгружается с реги, потом можно изменять через эту страницу
        3. Все Main Featchers подгружаются изначально с реги, но учти, что Знак Зодиака подгружается из даты рождения, 
        которая в свою очередь подгружается из ITMO.id
        4. Interests тоже изначально подгружаются из реги, потом можно менять через эту страницу
        5. Фотки подгружаются из реги, можно менять через эту страницу (можно удалить, А ПОТОМ В ПУСТОЕ МЕСТО загрузить новое фото)...
        ..также можешь реализовать штуку, когда ты перетаскиваешь фото, чтобы поменять их местами, но это НЕопционально, просто прикольно
        в качестве доп анимашки 
        6. Добавить навигацию на кнопку Premium на страницу PremiumPage 
*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Chip, Button, Modal, CircularProgress } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import RoundButton from '../basic/RoundButton';
import EditableField from '../basic/EditableField';
import TargetSheetButton from '../basic/TargetSheetButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WineBarIcon from '@mui/icons-material/WineBar';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MultiCategorySheetButton, { CategoryOption } from '../basic/MultiCategorySheetButton';
import { useNavigate } from 'react-router-dom';
import { logEvent, logPageView } from '../../analytics';
import { userData } from '../../stores/UserDataStore';
import { observer } from 'mobx-react-lite';
import { fetchTags } from '../../api/register';
import { Tag } from "../../types";
import { uploadLogo, uploadCarousel } from '../../api/register';
import PhotoEditor from '../pages/PhotoEditor';
import Gallery from '../basic/Gallery';
import { urlToFile } from '../../utils';


const relationshipIds = [
    { id: "672b44eab151637e969889bb", label: 'Dates', icon: <WineBarIcon /> },
    { id: "672b44eab151637e969889bc", label: 'Romantic relationships', icon: <FavoriteBorderIcon /> },
    { id: "672b44eab151637e969889bd", label: 'Friendship', icon: <PeopleIcon /> },
    { id: "672b44eab151637e969889be", label: 'Casual Chat', icon: <ChatBubbleOutlineIcon /> },
];




const EditProfilePage: React.FC = observer(() => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const initRelation = relationshipIds.find(p => p.id === userData.getRelationshipPreference()) || relationshipIds[0];
    const [selectedTarget, setSelectedTarget] = useState<{ label: string; icon: JSX.Element }>();
    const [, setSelectedFeatures] = useState<{ [key: string]: string | string[] }>({});
    const [allTags, setAllTags] = useState<Tag[]>([]);

    const initTags = userData.getInterestIDs() || [];
    const [selectedTags, setSelectedTags] = useState<string[]>();
    const [loadingTags, setLoadingTags] = useState<boolean>(true);

    const targetOptions = [
        { ...relationshipIds[0], description: 'Looking for dates', onClick: () => handleTargetSelect(relationshipIds[0]) },
        { ...relationshipIds[1], description: 'Looking for romantic relationships', onClick: () => handleTargetSelect(relationshipIds[1]) },
        { ...relationshipIds[2], description: 'Looking for friendship', onClick: () => handleTargetSelect(relationshipIds[2]) },
        { ...relationshipIds[3], description: 'Looking for casual chat', onClick: () => handleTargetSelect(relationshipIds[3]) },
    ];

    const categoriesConfig: CategoryOption[] = [
        { label: 'Height', type: 'slider', min: 100, max: 250, onConfirm: v => userData.setHeight(v), selectedValue: userData.getHeight() },
        { label: 'Weight', type: 'slider', min: 40, max: 200, onConfirm: v => userData.setWeight(v), selectedValue: userData.getWeight() },
        { label: 'Worldview', type: 'select', options: ['Buddhism', 'Jewry', 'Hinduism', 'Islam', 'Catholicism', 'Confucianism', 'Orthodoxy', 'Protestantism', 'Secular humanism', 'Atheism', 'Agnosticism'], onConfirm: v => userData.setWorldview(v), selectedValue: userData.getWorldview() },
        { label: 'Zodiac Sign', type: 'buttonSelect', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'None'], onConfirm: v => userData.setZodiac(v), selectedValue: userData.getZodiac() },
        { label: 'Children', type: 'buttonSelect', options: ['No and not planning', 'No but would like', 'Already have'], onConfirm: v => userData.setChildren(v), selectedValue: userData.getChildren() },
        { label: 'Languages', type: 'languageSelect', onConfirm: v => userData.setLanguages(v), selectedValue: userData.getLanguages() },
        { label: 'Alcohol', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'], onConfirm: v => userData.setAlcohol(v), selectedValue: userData.getAlcohol() },
        { label: 'Smoking', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'], onConfirm: v => userData.setSmoking(v), selectedValue: userData.getSmoking() },
    ];

    //logo
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isEditingLogo, setIsEditingLogo] = useState(false);

    const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoUrl(result);
                setLogoFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditLogo = () => {
        setIsEditingLogo(true);
    };

    const handleSaveEditedLogo = (editedImage: string) => {
        setLogoUrl(editedImage);
    };


    const handleSubmitLogo = async () => {
        try {
            let finalFile = logoFile;
            if (!finalFile && logoUrl) {
                finalFile = await urlToFile(logoUrl, 'old_logo.png');
            }

            if (!finalFile) {
                alert('No logo to upload');
                return;
            }

            await uploadLogo(userData.getIsu(), finalFile);
            window.location.reload();
        } catch (error: unknown) {
            console.error('Error uploading logo:', error);
        }
    };

    //gall
    const [files, setFiles] = useState<(File | null)[]>(Array(6).fill(null));
    const [galleryImages, setGalleryImages] = useState<(string | null)[]>(Array(6).fill(null));
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);


    const handleFileSelect = (index: number, file: File, url: string) => {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);

        const newUrls = [...galleryImages];
        newUrls[index] = url;
        setGalleryImages(newUrls);
    };

    const handleDeleteImage = (index: number) => {
        const newFiles = [...files];
        newFiles[index] = null;
        setFiles(newFiles);

        const newUrls = [...galleryImages];
        newUrls[index] = null;
        setGalleryImages(newUrls);
    };

    const handleLoadImage = (index: number, url: string) => {
        const newUrls = [...galleryImages];
        newUrls[index] = url;
        setGalleryImages(newUrls);
    };

    const handleEditImage = (index: number) => {
        if (galleryImages[index]) {
            setCurrentIndex(index);
            setImageToEdit(galleryImages[index]);
            setIsEditingPhoto(true);
        }
    };

    const handleSaveEditedImage = (editedImage: string) => {
        if (currentIndex !== null) {
            const newUrls = [...galleryImages];
            newUrls[currentIndex] = editedImage;
            setGalleryImages(newUrls);
        }
    };

    const handleSubmitPhotos = async () => {
        try {
            const finalFiles: File[] = [];

            for (let i = 0; i < galleryImages.length; i++) {
                const url = galleryImages[i];
                const file = files[i];

                if (!url) {
                    continue;
                }
                if (file) {
                    finalFiles.push(file);
                } else {
                    const f = await urlToFile(url, `old_photo_${i}.png`);
                    finalFiles.push(f);
                }
            }

            if (finalFiles.length === 0) {
                alert('At least 1 photo required');
                return;
            }

            await uploadCarousel(userData.getIsu(), finalFiles);
            window.location.reload();
        } catch (error: unknown) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (!userData.loading) {
            setLogoUrl(userData.getPhoto() || "");

            const photos = userData.getAdditionalPhotos();
            const paddedPhotos = photos.slice(0, 6).concat(Array(6 - photos.length).fill(null));
            setGalleryImages(paddedPhotos);
        }
    }, [userData.loading]);

    useEffect(() => {
        logPageView('/edit-profile');
    }, []);

    useEffect(() => {
        const loadTags = async () => {
            try {
                const tags = await fetchTags();
                setAllTags(tags);
            } catch (err: unknown) {
                console.error("Error fetching tags: ", err)
            } finally {
                setLoadingTags(false);
            }
        };

        loadTags();
    }, [])



    const handleTargetSelect = (option: { label: string; icon: JSX.Element }) => {
        setSelectedTarget(option);
        const prefId = relationshipIds.find(p => p.label == option.label);
        if (prefId) {
            userData.setRelationshipPreference(prefId.id);
        }
    };

    const handleSave = (category: string, option: string | string[]) => {
        setSelectedFeatures((prev) => ({
            ...prev,
            [category]: option,
        }));
    };

    const handlePremiumClick = () => {
        logEvent("Profile", "To premium click", "Premium Button")
        navigate('/premium');
        console.log('Premium button clicked from edit');
    }

    const handleInterestSelect = (tagId: string) => {
        setSelectedTags((prev) => {
                const p = prev || initTags;
                const newP = p.includes(tagId) ? p.filter(t => t !== tagId) : [...p, tagId];
                userData.setInterests(newP);
                return newP;
            }
        );
    };

    const applyInterests = () => {
        // userData.setInterests(selectedTags || []);
        setModalOpen(false);
    };

    if (userData.loading) {
        return <CircularProgress />; // Show a loading spinner while data is being fetched
    }

    return (
        <Box position="relative" minHeight="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Box width="100%" color="white" display="flex" alignItems="center" p={2}>
                <IconButton data-testid="BackToProfile" onClick={() => navigate('/profile')} 
                    sx={{ '&:active': {
                        backgroundColor: '#6a8afc', // Цвет при нажатии
                        },
                        borderRadius: '50%', // Круглая форма
                        color: 'grey.800' }}>
                    <WestIcon />
                </IconButton>
            </Box>

            <Box
                component={Paper}
                elevation={3}
                sx={{
                    mt: 0,
                    width: '100%',
                    borderRadius: '16px 16px 0 0',
                    padding: 3,
                    backgroundColor: '#ffffff',
                    zIndex: 1,
                    overflowY: 'auto',
                    flexGrow: 1,
                    paddingBottom: '80px',
                }}
            >
                {/* Bio Section */}
                <Box display="flex" flexDirection="column">
                    <EditableField label="Username" initialValue={userData.getUsername()} onSave={(v) => userData.setUsername(v)} />
                    <Typography variant="h6" sx={{ mb: 1 }}>Возраст: {userData.getAge()} yo</Typography>
                </Box>
                <EditableField label="Bio" initialValue={userData.getBio()} onSave={(v) => userData.setBio(v)} />

                {/* Target Section */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Цель</Typography>
                    <TargetSheetButton label={selectedTarget?.label || initRelation.label} icon={selectedTarget?.icon || initRelation.icon} options={targetOptions} onSelect={handleTargetSelect} />
                </Box>

                {/* Main Features Section */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Основные характеристики</Typography>
                    {categoriesConfig.map((category, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                            <MultiCategorySheetButton
                                label={`Choose ${category.label}`}
                                category={category}
                                onSave={handleSave}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Interests Section */}
                <Box p={3}>
                    {/* Заголовок */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Интересы</Typography>

                    {/* Интересы */}
                    <Paper
                        variant="outlined"
                        onClick={() => setModalOpen(true)}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'grey.100' },
                        }}
                    >
                        {Object.keys(selectedTags || initTags).length === 0 ? (
                            <Box>
                                <Typography sx={{ fontWeight: 'bold' }}>Добавьте свои интересы</Typography>
                                <Typography sx={{ color: 'grey.600' }}>Расскажите, чем вы увлекаетесь и что вам нравится</Typography>
                            </Box>
                        ) : (
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {(selectedTags || initTags).map(tagId => {
                                    const foundTag = allTags.find(t => t.id === tagId);
                                    if (!foundTag) return null;

                                    return (
                                        <Chip
                                            key={tagId}
                                            label={foundTag.text}
                                            onDelete={() => handleInterestSelect(tagId)}
                                        />
                                    );
                                })}
                            </Box>

                        )}
                        <ChevronRightIcon />
                    </Paper>

                    {/* Модальное окно для выбора интересов */}
                    <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                        <Paper
                            sx={{
                                width: '90%',
                                maxWidth: '400px',
                                margin: '10% auto',
                                p: 3,
                                borderRadius: 2,
                                outline: 'none',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                boxShadow: 24,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                                Выберите интересы
                            </Typography>

                            {/* Перебор категорий */}
                            {loadingTags ? (
                                <Typography>Загрузка интересов...</Typography>
                            ) : (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {allTags.map(tag => (
                                        <Button
                                            key={tag.id}
                                            variant={
                                                (selectedTags || initTags).includes(tag.id) ? 'contained' : 'outlined'
                                            }
                                            onClick={() => handleInterestSelect(tag.id)}
                                        >
                                            {tag.text}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={applyInterests}>
                                Применить
                            </Button>
                        </Paper>
                    </Modal>



                </Box>

                {/*Logo*/}
                <Box mt={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Лого
                    </Typography>

                    <Box
                        sx={{
                            width: '100%',
                            position: 'relative',
                            paddingTop: '100%',
                        }}>

                        <Box
                            component="img"
                            src={logoUrl || ''}
                            alt="User Logo"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                bgcolor: logoUrl ? 'transparent' : 'grey.300',
                                borderRadius: 2,
                            }}
                        />
                    </Box>

                    <Box mt={2} display="flex" justifyContent="center" gap={2}>
                        <IconButton
                            size="small"
                            component="label"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                color: 'black',
                            }}
                        >
                            <UploadIcon />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleLogoFileChange}
                            />
                        </IconButton>

                        {logoUrl && (
                            <IconButton
                                size="small"
                                onClick={handleEditLogo}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    color: 'black',
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Box mt={2} display="flex" justifyContent="center">
                        <RoundButton onClick={handleSubmitLogo}>
                            Сохранить лого
                        </RoundButton>
                    </Box>
                </Box>

                {/*Gallery*/}
                <Box mt={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Дополнительные фотографии
                    </Typography>

                    <Gallery
                        columns={3}
                        rows={2}
                        galleryImages={galleryImages}
                        handleDeleteImage={handleDeleteImage}
                        handleLoadImage={handleLoadImage}
                        handleEditImage={handleEditImage}
                        handleFileSelect={handleFileSelect}
                    />

                    <Box mt={2} display="flex" justifyContent="center">
                        <RoundButton onClick={handleSubmitPhotos}>
                            Сохранить дополнительные фотографии
                        </RoundButton>
                    </Box>
                </Box>

                {isEditingLogo && logoUrl && (
                    <PhotoEditor
                        image={logoUrl}
                        onSave={edited => {
                            handleSaveEditedLogo(edited);
                            setIsEditingLogo(false);
                        }}
                        onClose={() => setIsEditingLogo(false)}
                    />
                )}

                {isEditingPhoto && imageToEdit && (
                    <PhotoEditor
                        image={imageToEdit}
                        onSave={edited => {
                            handleSaveEditedImage(edited);
                            setIsEditingPhoto(false);
                        }}
                        onClose={() => setIsEditingPhoto(false)}
                    />
                )}

                {/* Premium Button Section */}
                <Box mt={4} width="100%" display="flex" justifyContent="center" pb={8}>
                    <RoundButton onClick={handlePremiumClick}>Premium</RoundButton>
                </Box>
            </Box>
        </Box>
    );
});

export default EditProfilePage;
