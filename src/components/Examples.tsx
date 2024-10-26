import React from 'react';
import "../styles/examples.css"
import WestIcon from '@mui/icons-material/West';    
import RoundButton from './basic/RoundButton';
import ImageButton from './basic/ImageButton';
import { Typography } from '@mui/material';
import theme from './theme';
import InputText from './basic/InputText';
import HorizontalButtonGroup from './basic/HorizontalButtonGroup';
import MultiSelectButtonGroup from './basic/MultiSelectButtonGroup';

function Examples() {
  return (
    <div className='examples'>
      <img src='images/test_img.jpg' />
      <Typography className='title'>Welcome to My React App</Typography>
      <Typography color={theme.palette.primary.dark} fontSize={"30px"}>Whats your name?</Typography>
      <Typography color={theme.palette.primary.main} fontSize={"16px"}>It’s recommended to give your actual name</Typography>
        <RoundButton id="123" width={"30%"} onClick={() => console.log(10)}>Continue</RoundButton>
      <br />
      <ImageButton onClick={() => console.log(1)} radius="70px"><WestIcon /></ImageButton>
      <br />
      <InputText id="123" width={"50%"} label={"Type your name"} onChange={(e) => console.log(e.target.value)} />
      <br />
      <HorizontalButtonGroup options={["Man", "Woman", "Anyone"]} spacing={0} onButtonClick={console.log  }/>
      <br/>
      <MultiSelectButtonGroup onClickOption={console.log} options={["Opt1", "Opt2", "Opt3", "Opt4"]} />
    </div>
  )
}

export default Examples;