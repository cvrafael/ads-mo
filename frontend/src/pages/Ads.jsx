import React from 'react';
import Cards from '../components/Cards.jsx';
const Ads = ({idUser}) => {
  return (
    <Cards style={{ height: "25%" }} idUser={idUser}/>
  );
}
export default Ads;
