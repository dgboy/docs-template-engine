const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/client'));
console.log("Work!");

const router = express.Router();

// const convertingToPdf = (req, res) => {
//   res.end("PDF!");
// };
// const getTemplates = (req, res) => {
//   let templates = [
//     {
//       "name": "Титульный лист диплома",
//       "background": "diplom-title.jpg",
//       // "background": null,
//       "width": 793,
//       "height": 1122,
//       "elems": [
//         {
//           "name": "student",
//           "type": "text",
//           "value": "",
//           "x": 140,
//           "y": 855,
//           "font": 20
//         },
//         {
//           "name": "group",
//           "type": "text",
//           "value": "",
//           "x": 160,
//           "y": 833,
//           "font": 20
//         },
//         {
//           "name": "teacher",
//           "type": "text",
//           "value": "",
//           "x": 480,
//           "y": 835,
//           "font": 20
//         }
//       ]
//     },
//     {
//       "name": "Грамота",
//       "background": "charter.jpg",
//       "width": 793,
//       "height": 1122,
//       "elems": [
//         {
//           "type": "label",
//           "value": "Грамотой награждается",
//           "x": 10,
//           "y": 10
//         },
//         {
//           "type": "text",
//           "value": "<участник>",
//           "x": 150,
//           "y": 1000
//         }
//       ]
//     },
//     {
//       "name": "Титульный лист",
//       "background": null,
//       "width": 793,
//       "height": 1122,
//       "elems": [
//         {
//           "type": "label",
//           "value": "Министерство образования Нижегородской области",
//           "x": 200,
//           "y": 50,
//           "font": 14
//         },
//         {
//           "type": "label",
//           "value": "Государственное бюджетное профессиональное образовательное учреждение «Нижегородский радиотехнический колледж»",
//           "x": 50,
//           "y": 80,
//           "font": 14
//         },
//         {
//           "type": "label",
//           "value": "ОП.05 Основы программирования",
//           "x": 200,
//           "y": 250,
//           "font": 14
//         },
//         {
//           "type": "label",
//           "value": "Титульный лист",
//           "x": 250,
//           "y": 300,
//           "font": 20
//         },
//         {
//           "type": "label",
//           "value": "Выполнил:",
//           "x": 250,
//           "y": 350,
//           "font": 14
//         },
//         {
//           "type": "text",
//           "value": "<student>",
//           "x": 250,
//           "y": 350,
//           "font": 14
//         }
//       ]
//     }
//   ];
//  res.json(templates);
// };

const getData = (req, res) => {
  let data = [
    {
      "student": "Горбунов Даниил Павлович",
      "group": "3ПКС-17-2с",
      "teacher": "Слугин Владимир Георгиевич",
    },
    {
      "student": "Левин Иван Петрович",
      "group": "3ПКС-17-2с",
      "teacher": "Слугин Владимир Георгиевич",
    },
    {
      "student": "Лесков Иван Иванович",
      "group": "3РА-17-2с",
      "teacher": "Слугин Владимир Георгиевич",
    }
  ];
  res.json(data);
};
const getDataGramota = (req, res) => {
  let data = [
    {
      "member": "Горбунов Даниил Павлович",
      "date": "5 мая 2020г.",
      "leader": "Жуков Виталий Климович",
    },
    {
      "member": "Левин Иван Петрович",
      "date": "5 мая 2020г.",
      "leader": "Жуков Виталий Климович",
    },
    {
      "member": "Лесков Иван Иванович",
      "date": "5 мая 2020г.",
      "leader": "Жуков Виталий Климович",
    }
  ];
  res.json(data);
};

router.get('/data', getData);
router.get('/gramota', getDataGramota);
// router.get('/templates', getTemplates);
// router.get('/converting', convertingToPdf);

app.use('/api', router);

module.exports = app;
