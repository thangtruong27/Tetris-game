import React from 'react';
import { StyledButton } from './styles/StyledButton';

const StartButton = ({ callback }) => {
    return (
        <StyledButton onClick={callback}>
            Start game!
        </StyledButton>
    )
}

export default StartButton
