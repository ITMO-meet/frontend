import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
    error: Error | null;
    resetError: () => void;
}

export const DisplayError: React.FC<Props> = ({ error, resetError }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        resetError();
        navigate("/");
    }

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '100px' }}>
                😵‍💫
            </Typography>
            <Typography variant="h4" sx={{ margin: '20px 0' }}>
                Oops... Something wrong
            </Typography>
            <Button 
                variant="contained" 
                onClick={handleClick} 
                sx={{ padding: '10px 20px' }}
            >
                Return to Main
            </Button>
        </Box>
    );
};
