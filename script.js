const https = require('https');
const nodemailer = require('nodemailer');

//bitcoin değerini aldığımız api
const apiUrl =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

// göndermek için mail bilgileri
const emailConfig = {
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 587,
  auth: {
    user: 'testgmail.com', // name
    pass: 'testpass', // pass
  },
  secure: true,
  debug: false,
  logger: true,
};

//set et
const sendEmail = (value) => {
  const transporter = nodemailer.createTransport(emailConfig);
  const mailOptions = {
    from: 'aa@gmail.com',
    to: 'test@gmail.com',
    subject: 'Kripto Değer Değişikliği Bildirimi',
    text: `Kripto para birimi değerinde bir değişiklik tespit edildi! Yeni değer: $${value}`,

    html: `
        <html>
        <head>
            <style>
                /* Stil ekleyebilirsiniz */
            </style>
        </head>
        <body>
            <h1>Kripto para birimi değerinde bir değişiklik tespit edildi!</h1>
            <p>Yeni değer: $${value}</p>
        </body>
        </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('E-posta gönderme hatası:', error);
    } else {
      console.log('E-posta başarıyla gönderildi:', info.response);
    }
  });
};

//control
const checkCryptoValue = () => {
  https
    .get(apiUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const bitcoinData = JSON.parse(data);
          const bitcoinValue = bitcoinData.bitcoin.usd;

          console.log('Kripto para birimi değeri:', bitcoinValue);

          if (bitcoinValue > 50000) {
            sendEmail(bitcoinValue);
          }
        } catch (error) {
          console.error('JSON verisi ayrıştırma hatası:', error);
        }
      });
    })
    .on('error', (error) => {
      console.error('API çağrısı sırasında bir hata oluştu:', error);
    });
};

setInterval(checkCryptoValue, 600000); // oto 1 dakikada bir takip edip mail atar süre opsiyenel
