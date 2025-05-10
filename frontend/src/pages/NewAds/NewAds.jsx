import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Upload, Checkbox, Flex, Spin } from 'antd';
import { useNavigate } from "react-router";
// import emailjs from '@emailjs/browser';
import {postApiMercadoPago, postApiUploadAds, getPaymentStatus, verifyPaymentWasApproved, handleCancelPayment } from './apiNewAds';

const NewAds = ({ idUser, userEmail }) => {
  const [checked, setChecked] = useState(false);
  const [areaPix, setReturnAreaPix] = useState("");
  const [paymentResult, setPaymentResult] = useState('');
  const [paymentResultStatus, setPaymentResultStatus] = useState('');
  const [buttonCancelPayment, setButtonCancelPayment] = useState('');
  const disabledSubmit = useRef(null);
  const[ waitingApprovedPayment, setWaitingApprovedPayment ]= useState('Submit');
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    if (isChecking) {
      interval = setInterval(() => {
        verifyPaymentWasApproved(paymentResult.id)
          .then((result) => {
            console.log('verifyPaymentWasApprovedtestest',result.data);

            if (result.data === "approved") {
              clearInterval(interval);
              navigate("/myads");
            }
          })
          .catch((err) => {
            console.error("Erro ao verificar status:", err.message);
          });
      }, 5000); // checa a cada 5 segundos
    }

    return () => clearInterval(interval);
  }, [isChecking, navigate]);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  useEffect(() => {
    postApiMercadoPago(userEmail, idUser).then((result)=> {
      setPaymentResult(result.data);// point_of_interaction.transaction_data.ticket_url
    });
  }, []);

  // const waitingPayment = (idPayment) => {
    
  //   setInterval(()=>{
  //       if (waitingPaymentWasApproved !== 'approved') {
  //       verifyPaymentWasApproved(idPayment)
  //       .then((result) => {
  //         console.log('waitingPayment',result.data);
  //         setWaitingPaymentWasApproved(result.data);
  //       });
  //       console.log('setInterval')
  //     }
  //     }, 4000)
  //   disabledSubmit.current.disabled = false;
  // }

  const onFinish = async (values) => {

    if (checked == true) {
      setIsChecking(true)
      setReturnAreaPix(<>
        <iframe style={{ width: 600, height: 600, border: "none" }} src={paymentResult.point_of_interaction.transaction_data.ticket_url} />
      </>);
      getPaymentStatus(paymentResult.id)
      .then((result) => {
        setPaymentResultStatus(result.data.status) 
      });
      setWaitingApprovedPayment('Waiting payment');
      disabledSubmit.current.disabled = true;
      setButtonCancelPayment(<Button color="default" onClick={() => {handleCancelPayment(paymentResult.id, navigate)}}>Cancel Payment?</Button>)
      setChecked(false);
    } else {
      setReturnAreaPix("");

      // disabledSubmit.current.disabled = false;
    }
    
    const newArrayObject = {
      ...values.user,
      'image': values.user.image.file.name,
      'fk_id_user_entity': idUser,
      'file': values.user.image.file,
      'premium': checked,
      'website': values.user.website,
      'payment_status': paymentResult.status,
      'id_payment': paymentResult.id
    }

    try {
      postApiUploadAds(newArrayObject);
    } catch (error) {
      console.log(error);
    }

    // waitingPayment(paymentResult.id);
    // const caio = {
    //   name:'caaiioviictor@gmail.com',
    //   email: 'caio-victor-rafael@hotmail.com',
    //   to_name: 'caio',

    //   message: 'olá'

    // }

    // emailjs
    // .send('service_3qm9yen', 'template_ygm4d1b', caio,
    //  {
    //   publicKey: 'lIhGRAXkwkjmRctfW',
    // })
    // .then(
    //   () => {
    //     console.log('SUCCESS!');
    //   },
    //   (error) => {
    //     console.log('FAILED...', error.text);
    //   },
    // );
  };

  const showPixArea = (e) => {
    setChecked(e.target.checked);  
    console.log(checked)
    if (checked == false) {
      setReturnAreaPix('');
      disabledSubmit.current.disabled = false;
      setWaitingApprovedPayment('Submit');
      setButtonCancelPayment('');
    }
  }
  // const returnNormalAd = (value) => {
  //   console.log('returnNomralAd', value);
  // }
// Return HTML component
  return (

    <Flex vertical  >
      <Flex gap={150}>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{
            width: 300,
          }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={['user', 'image']}
            label="Image Logo"
            valuePropName="image"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file.size > 2) {
                    reject('File size exceeded');
                  } else {
                    resolve('Success');
                  }
                })
              }}
              accept='.jpg, .gif'
              maxCount={1}
            >
              <Button>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name={['user', 'title']}
            label="Title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            name={['user', 'website']}
            label="Website"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            name={['user', 'description']}
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            name={['user', 'premium']}
            label="Ad Premium"
            valuePropName="premium"
          >
            <Checkbox onChange={showPixArea}/>
          </Form.Item>

          <Form.Item label={null}>
            <Flex gap={5}>

            <Button type="primary" htmlType="submit" ref={disabledSubmit}>
            {waitingApprovedPayment}
            </Button>
            {buttonCancelPayment}
            </Flex>
          </Form.Item>
        </Form>
        <div style={{ width: 200 }}>
          {areaPix}

        </div>
      </Flex>
    </Flex>
  )
};

export default NewAds;
