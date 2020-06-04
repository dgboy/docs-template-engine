docsTemplateEngine.factory('templateService', () => {
  return {
    templates: [
      {
        "name": "Титульный лист отчёта",
        "background": null,
        "width": 793,
        "height": 1122,
        "offsets": {
          "left": 75,
          "right": 56,
          "top": 75,
          "bottom": 75
        },
        "elems": {
          "labels": [{
              "value": "Министерство образования Нижегородской области",
              "x": 0,
              "y": 10,
              "family": "Times New Roman",
              "font": 20,
              "align": "center"
            },
            {
              "value": "Государственное бюджетное профессиональное образовательное учреждение «Нижегородский радиотехнический колледж»",
              "x": 0,
              "y": 30,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "value": "ОП.05 Основы программирования",
              "x": 150,
              "y": 250,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "value": "ОТЧЁТ",
              "x": 320,
              "y": 400,
              "family": "Times New Roman",
              "color": "black",
              "font": 26,
              "align": "center"
            },
            {
              "value": "по лабораторной работе № 1",
              "x": 130,
              "y": 430,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "value": "Тема 'Двухмерные массивы'",
              "x": 130,
              "y": 450,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "value": "Выполнил:",
              "x": 0,
              "y": 810,
              "defaultX": 0,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "ученик группы",
              "x": 0,
              "y": 835,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "Проверил:",
              "x": 400,
              "y": 810,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "преподаватель",
              "x": 400,
              "y": 835,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "г.Нижний Новгород",
              "x": 320,
              "y": 920,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "value": "2020г.",
              "x": 380,
              "y": 950,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            }
          ],
          "dataFields": [{
              "name": "student",
              "value": "",
              "x": 0,
              "y": 860,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "name": "group",
              "value": "",
              "x": 130,
              "y": 835,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "name": "teacher",
              "value": "",
              "x": 400,
              "y": 860,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            }
          ]
        }
      },
      {
        "name": "Грамота",
        "background": "charter.jpg",
        "width": 793,
        "height": 1122,
        "offsets": {
          "left": 115,
          "right": 115,
          "top": 100,
          "bottom": 100
        },
        "elems": {
          "labels": [{
              "value": "НАГРАЖДАЕТСЯ",
              "x": 0,
              "y": 250,
              "family": "Times New Roman",
              "color": "black",
              "font": 40,
              "align": "center"
            },
            {
              "value": "за стремление учиться лучше, за пытливый ум и доброту, за то, что в борьбе с самим собой научился находить правильное решение и управлять своим поведением. за стремление учиться лучше и умение преодолевать трудности, за умный взгляд пытливых глаз, за смелость при принятии решений, за то, что станет пятый класс ступенькой к новым достижениям.",
              "x": 0,
              "y": 350,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "Приказ №125 от",
              "x": 10,
              "y": 800,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "value": "Руководитель",
              "x": 10,
              "y": 830,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            }
          ],
          "dataFields": [{
              "name": "member",
              "value": "",
              "x": 0,
              "y": 320,
              "family": "Times New Roman",
              "color": "black",
              "font": 20,
              "align": "center"
            },
            {
              "name": "date",
              "value": "",
              "x": 160,
              "y": 800,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            },
            {
              "name": "leader",
              "value": "",
              "x": 10,
              "y": 860,
              "family": "Times New Roman",
              "color": "black",
              "font": 20
            }
          ]
        }
      },
      {
        "name": "Титульный лист диплома",
        "background": "diplom-title.jpg",
        "width": 793,
        "height": 1122,
        "offsets": {
          "left": 75,
          "right": 56,
          "top": 75,
          "bottom": 75
        },
        "elems": {
          "labels": [
          ],
          "dataFields": [
            {
                "name": "student",
                "value": "student",
                "x": 59,
                "y": 765,
                "family": "Times New Roman",
                "color": "black",
                "font": 20,
                "w": 57.7734375,
                "h": 20
            },
            {
                "name": "group",
                "value": "group",
                "x": 79,
                "y": 742,
                "family": "Times New Roman",
                "color": "black",
                "font": 20,
                "w": 46.66015625,
                "h": 20
            },
            {
                "name": "teacher",
                "value": "teacher",
                "x": 399,
                "y": 743,
                "family": "Times New Roman",
                "color": "black",
                "font": 20,
                "w": 57.724609375,
                "h": 20
            }
        ]
        }
      }
    ]
  };
});
