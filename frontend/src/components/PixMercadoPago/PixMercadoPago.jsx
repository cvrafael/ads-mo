import React, { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
import axios from 'axios';

const PixMercadoPago = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');


  useEffect(()=> {
      const getPix = () => {
        axios.post("http://localhost:3030/payment")
          .then((result) => {
            setTicketUrl(result.data.point_of_interaction.transaction_data.ticket_url);
            console.log(result)
          })
          .catch(error => { console.log(error) });
      }
      getPix();
  },[]);

  const handleOpenTicketUrl = () => {
      window.open(ticketUrl, '_blank'); // Abre a URL do pagamento em uma nova aba
  };

  return (
    <>
      <Button type="primary" onClick={handleOpenTicketUrl}>
        Open Modal
      </Button>
    </>
  );
};

export default PixMercadoPago;
