// Backend Node.js with Express
import express from "express";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import pg from "pg"
import bcrypt from 'bcrypt';
import cors from 'cors';

const port = 3001
const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "jaundice",
  password: "Nabil",
  port: 5432,
})
db.connect()
app.use(cors());

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: 'nabilalakhdar4@gmail.com', // Your email
    pass: 'yqdz qdue uvgn jhho' // Your email password
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/send-verification', async (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);  // Code expires in 10 minutes

  try {
      const query = 'INSERT INTO verification_codes(email, code, expiration) VALUES($1, $2, $3)';
      await db.query(query, [email, verificationCode, expiration]);

      const mailOptions = {
          from: 'nabilalakhdar4@gmail.com',
          to: email,
          subject: 'Verification Code',
          text: `Your verification code is: ${verificationCode}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error(error);
              res.status(500).send('Error sending email');
          } else {
              res.status(200).send('Verification code sent');
          }
      });
  } catch (error) {
      console.error("Error storing verification code in database:", error);
      res.status(500).send('Error storing verification code in database');
  }
});

app.post('/send-email', (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: "nabilalakhdar4@gmail.com", 
    subject: `New Message from ${firstName} ${lastName} ${email}`,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.post('/register', async (req, res) => {
  const { email, password, verificationCode } = req.body;

  const codeQuery = 'SELECT * FROM verification_codes WHERE email = $1 AND code = $2 AND expiration > NOW()';
  try {
      const codeResult = await db.query(codeQuery, [email, verificationCode]);
      if (codeResult.rows.length === 0) {
          return res.status(400).json({ message: 'Invalid or expired verification code' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userQuery = 'INSERT INTO signup(email, password) VALUES($1, $2) RETURNING *';
      const userResult = await db.query(userQuery, [email, hashedPassword]);

      if (userResult.rows.length > 0) {
          res.status(201).json({ message: 'User created successfully' });
      } else {
          res.status(400).json({ message: 'User could not be created' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error in registration process');
  }
});




app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM signup WHERE email=$1";

  try {
      const result = await db.query(query, [email]);
      if (result.rowCount > 0) {
          const user = result.rows[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
              res.status(200).json({ message: 'User Logged in successfully' });
          } else {
              res.status(401).json({ message: 'Incorrect password' });
          }
      } else {
          res.status(404).json({ message: 'Email not found' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error logging in user');
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
