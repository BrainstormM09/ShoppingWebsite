const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbUrl = 'mongodb://127.0.0.1:27017/online_marketplace';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username, email, password });

    if (user) {
      res.send(`
        <script>
          alert('Login successful. Welcome, ${username}!');
          window.location.href = 'index1.html';
        </script>
      `);
    } else {
      res.send(`
        <script>
          alert('Invalid username or password.');
          window.location.href = 'login.html';
        </script>
      `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
