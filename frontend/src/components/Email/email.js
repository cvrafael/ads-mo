import emailjs from '@emailjs/browser';

export async function EmailValidated(datas) {
  console.log('datas enviado para email.js',datas);

   emailjs
      .send(import.meta.env.VITE_EMAIL_SERVICE_ID, import.meta.env.VITE_EMAIL_TEMPLATE_ID, {
        name: datas.userName,
        title: datas.title,
        email: datas.userEmail
        }, {
        publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

};

export async function EmailValidatedRepproved(datas) {

   emailjs
      .send(import.meta.env.VITE_EMAIL_SERVICE_ID, import.meta.env.VITE_EMAIL_TEMPLATE_ID_REPROVED, {
        name: datas.userName,
        title: datas.title,
        email: datas.userEmail
        }, {
        publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

};