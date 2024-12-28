const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb://localhost:27017/architecturecomfort', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


const CalculationSchema = new mongoose.Schema({
  name: String,
  email: String,
  calculation: Object,
  date: { type: Date, default: Date.now },
});

const Calculation = mongoose.model('Calculation', CalculationSchema);

let etherealTransporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account:', err);
    return;
  }

  etherealTransporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  console.log('Ethereal test account created:', account);
});

app.post('/api/save-calculation', async (req, res) => {
  try {
    const { name, email, calculation } = req.body;

    const newCalculation = new Calculation({ name, email, calculation });
    await newCalculation.save();

    const mailOptions = {
      from: 'no-reply@architecturecomfort.test', // Отправитель
      to: email, // Получатель
      subject: 'Ваш расчет', // Тема письма
      text: `Здравствуйте, ${name}!\n\nВаш расчет:\n${JSON.stringify(
        calculation,
        null,
        2
      )}\n\nСпасибо за использование нашего сервиса!`,
    };

    const info = await etherealTransporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: 'Расчет сохранён и отправлен на email.',
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ message: 'Ошибка при сохранении расчета или отправке email.' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
