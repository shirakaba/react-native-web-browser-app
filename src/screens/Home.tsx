import React from 'react';
import {View, Text} from 'react-native';
import BrowserViewController from '../browser/BrowserViewController.tsx';

const Home = () => {
  console.log('========This is Home=======');
  return (
    <>
      <BrowserViewController />
    </>
  );
};

export default Home;
