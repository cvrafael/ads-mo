import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Upload, Checkbox, Flex, Alert  } from 'antd';
import { useNavigate } from "react-router";
// import emailjs from '@emailjs/browser';
import {postApiMercadoPago, postApiUploadAds, getPaymentStatus, verifyPaymentWasApproved, handleCancelPayment } from './apiNewAds';

const NewAds = ({ idUser, userEmail }) => {
  const [checked, setChecked] = useState(false);
  const [form] = Form.useForm();
  const [areaPix, setReturnAreaPix] = useState("");
  const [successAlert, setSuccessAlert] = useState('');
  const [paymentResult, setPaymentResult] = useState('');
  const [buttonCancelPayment, setButtonCancelPayment] = useState('');
  const disabledSubmit = useRef(null);
  const intervalRef = useRef(null);
  const[ waitingApprovedPayment, setWaitingApprovedPayment ]= useState('Submit');
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isChecking) {
      intervalRef.current = setInterval(() => {
        console.log('setInterval executing')
        verifyPaymentWasApproved(paymentResult.id)
        .then((result) => {
            if (result.data === "approved") {
              setSuccessAlert(<Alert message="Success Tips" type="success" showIcon />)
              clearInterval(intervalRef.current);
              navigate("/myads");
            }else if (result.data === "cancelled"){
              clearInterval(intervalRef.current);
            }
          })
          .catch((err) => {
            console.error("Erro ao verificar status:", err.message);
          });
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
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

  const onFinish = async (values) => {
  try {

    let pagamento = {
      status: 'not_required',
      id: '',
      point_of_interaction: {
        transaction_data: {
          ticket_url: ''
        }
      }
    };
    
    if (checked === true) {
      const result = await postApiMercadoPago(userEmail, idUser, values.user.title);
      pagamento = result.data;
  
      setPaymentResult(pagamento);
      setIsChecking(true);

      setReturnAreaPix(
        <iframe
          style={{ width: 600, height: 600, border: "none" }}
          src={pagamento.point_of_interaction.transaction_data.ticket_url}
        />
      );

      await getPaymentStatus(pagamento.id);
      // setPaymentResultStatus(statusResult.data.status);

      setWaitingApprovedPayment('Waiting payment');
      disabledSubmit.current.disabled = true;

      setButtonCancelPayment(
        <Button color="default" onClick={() =>{ 
          handleCancelPayment(pagamento.id).then(() => {
          setButtonCancelPayment('');
          setReturnAreaPix('');
          setSuccessAlert(<Alert style={{width: 300}} message="Payment cancelled." type="success" showIcon />);
          disabledSubmit.current.disabled = false;
          setWaitingApprovedPayment('Submit');
        })}}>
          Cancel Payment?
        </Button>
      );
      setChecked(false);
    } else {
      setReturnAreaPix("");
    }

    const newArrayObject = {
      ...values.user,
      image: values.user.image.file.name,
      fk_id_user: idUser,
      file: values.user.image.file,
      premium: checked,
      website: values.user.website,
      payment_status: pagamento.status,
      id_payment: pagamento.id,
      status: 'analysis'
    };

    await postApiUploadAds(newArrayObject)
        .then(()=>{
          if (checked == true) {
            setSuccessAlert(<Alert style={{width: 300}} message="Waiting some seconds, checking payment..." type="success" showIcon />);  
          }else {
            setSuccessAlert(<Alert style={{width: 300}} message="Ad registered with success" type="success" showIcon />);
            setTimeout(() => {
              form.resetFields();
              setSuccessAlert('');
            }, 3000);
          }
        })
        .catch((error) => {
          if (checked == true) {
            handleCancelPayment(pagamento.id)
            .then(()=>{
              setSuccessAlert(<Alert style={{width: 300}} message="Payment cancelled. Already exists this image or title!" type="error" showIcon />);
              setTimeout(() => {
                setSuccessAlert('');
              }, 4000)
              setWaitingApprovedPayment('Submit');
              disabledSubmit.current.disabled = false;
              form.resetFields();
              setReturnAreaPix('');
            })
            .catch(() => {
              setSuccessAlert(<Alert style={{width: 300}} message="Do not possible cancel payment." type="error" showIcon />);
            })
            setButtonCancelPayment('');
          }else {
            setSuccessAlert(<Alert style={{width: 300}} message={`${error.request.response}`} type="error" showIcon />);
          }
        });
        
  } catch (error) {
      console.error("Erro durante o processamento:", error);
  }
};

  const showPixArea = (e) => {
    setChecked(e.target.checked);  
    console.log('paymentResult.id',paymentResult.id)
    if (checked == false) {
      handleCancelPayment(paymentResult.id);
      setReturnAreaPix('');
      disabledSubmit.current.disabled = false;
      setWaitingApprovedPayment('Submit');
      setButtonCancelPayment('');
      setSuccessAlert('');
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
          form={form}
          style={{
            width: 300,
          }}
          validateMessages={validateMessages}
        >
          <Form.Item>
            {successAlert}
          </Form.Item>
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
            <Input.TextArea style={{ width: 300 }} maxLength={70}/>
          </Form.Item>

          <Form.Item
            name={['user', 'premium']}
            label="Ad Premium"
            valuePropName="premium"
          >
            <Checkbox onChange={showPixArea} disabled={true} />
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
