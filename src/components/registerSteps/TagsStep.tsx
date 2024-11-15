// TagsStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import MultiSelectButtonGroup from '../basic/MultiSelectButtonGroup';
import RoundButton from '../basic/RoundButton';

const tags = ['Спорт', 'Музыка', 'Путешествия', 'Чтение'];

interface TagsStepProps {
  onNext: (data: { tags: string[] }) => void;
}

const TagsStep: React.FC<TagsStepProps> = ({ onNext }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = () => {
    onNext({ tags: selectedTags });
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center' sx={{marginBottom: "20px"}}>Main Interests</Typography>
      <MultiSelectButtonGroup options={tags} onClickOption={setSelectedTags} />
      <RoundButton onClick={handleSubmit} sx={{ width: "100%", marginTop: "20px" }}>Next</RoundButton>
    </Box>
  );
};

export default TagsStep;
