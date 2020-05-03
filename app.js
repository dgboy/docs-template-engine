const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/client'));
console.log("Work!");

const router = express.Router();

const getTemplates = (req, res) => {
 res.end("Templates!");
};
const convertingToPdf = (req, res) => {
  res.end("PDF!");
};
const getData = (req, res) => {
  let data = [
    {
      "student": "Горбунов Даниил Павлович",
      "group": "3ПКС-17-2с",
      "teacher": "Слугин Владимир Георгиевич",
    },
    {
      "student": "Горбов Дан Павич",
      "group": "3ПКС-17-2с",
      "teacher": "Слугин Владимир Георгиевич",
    }
  ];

  res.json(data);
};

router.get('/templates', getTemplates);
router.get('/converting', convertingToPdf);
router.get('/data', getData);

app.use('/api', router);

module.exports = app;
