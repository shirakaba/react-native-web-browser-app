import React from 'react';
import {View, Text} from 'react-native';

const Games = ({webView, route}) => {
  const {URL} = route.params;
  console.log('Games URL ======>', URL);
  console.log('========This is Games=======');
  return <>{webView(URL)}</>;
};

export default Games;
