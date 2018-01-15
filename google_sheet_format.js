
var numRowToCreate = 30;
var numColumnToCreate = 8;
var dm2SpreadSheetId = '1cNptK-AcRUHzEPsI122BwHLe9YwVz0Eaxp4VxtIUCgA';
var dailyTaskSheetId = 1753802151;
exports.numRowToCreate = numRowToCreate;
exports.data = [
{
    insertDimension: { //insert numRowToCreate rows
      range:{
        sheetId: dailyTaskSheetId,
        dimension: "ROWS",
        startIndex: 0,
        endIndex: numRowToCreate  
      },
      inheritFromBefore: false
    }
},
{
    repeatCell: { //format inserted rows
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 1,
        endRowIndex: numRowToCreate
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: {
            red: 1.0,
            green: 1.0,
            blue: 1.0
          },
          horizontalAlignment: "CENTER",
          textFormat: {
            foregroundColor: {
              red: 0,
              green: 0,
              blue: 0
            },
            bold: true
            //fontSize: 12
          }
        }
      },
      fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
    }
},
/*{ //format date cell
    repeatCell: {
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 0,
        endRowIndex: 10,
        startColumnIndex: 0,
        endColumnIndex: 1
      },
      cell: {
        userEnteredFormat: {
          numberFormat: {
            type: "DATE",
            pattern: "ddd mmm dd yyyy"
          } 
        }
      },
      fields: "userEnteredFormat.numberFormat"
    }
},*/
{ //format border
    updateBorders: {
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 0,
        endRowIndex: numRowToCreate,
        startColumnIndex: 0,
        endColumnIndex: numColumnToCreate 
      },
      top: {
        style: "SOLID",
        width: 0,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      },
      bottom: {
        style: "SOLID",
        width: 1,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      },
      left: {
        style: "SOLID",
        width: 0,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      },
      right: {
        style: "SOLID",
        width: 1,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      },
      innerHorizontal: {
        style: "SOLID",
        width: 1,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      },
      innerVertical: {
        style: "SOLID",
        width: 1,
        color: {
          red: 0.0,
          green: 0.0,
          blue: 0.0          
        }
      }
    }
},
{ //merge last column
    mergeCells: {
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 1,
        endRowIndex: numRowToCreate,
        startColumnIndex: numColumnToCreate - 1,
        endColumnIndex: numColumnToCreate
      },
      mergeType: "MERGE_ALL"
    }
},
{ //all drop down lists
    setDataValidation: {
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 1,
        endRowIndex: numRowToCreate,
        startColumnIndex: 4,
        endColumnIndex: 5
      },
      rule: {
        condition: {
          type: 'ONE_OF_LIST',
          values: [
            {
            userEnteredValue: 'DONE',
            },
            {
            userEnteredValue: 'WIP',
            },
            {
            userEnteredValue: 'PENDING',
            },
          ],
        },
        showCustomUi: true,
        strict: true
      }
    }
},
{
    addConditionalFormatRule: {//conditional format dropdown item
      rule: {
        ranges: [
          {
            sheetId: dailyTaskSheetId,
            startRowIndex: 1,
            endRowIndex: numRowToCreate,
            startColumnIndex: 4,
            endColumnIndex: 5,
          }
        ],
        booleanRule: {
          condition: {
            type: "TEXT_CONTAINS",
            values: [
              {
                userEnteredValue: "WIP"
              }
            ]
          },
          format: {
            textFormat: {
              foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
              },
              bold: true 
            },
            backgroundColor: {
              red: 0.80,
              green: 0.255,
              blue: 0.145,
            }
          }
        }
      }
    }
},
{
    addConditionalFormatRule: {//conditional format dropdown item
      rule: {
        ranges: [
          {
            sheetId: dailyTaskSheetId,
            startRowIndex: 1,
            endRowIndex: numRowToCreate,
            startColumnIndex: 4,
            endColumnIndex: 5,
          }
        ],
        booleanRule: {
          condition: {
            type: "TEXT_CONTAINS",
            values: [
              {
                userEnteredValue: "DONE"
              }
            ]
          },
          format: {
            textFormat: {
              foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
              },
              bold: true 
            },
            backgroundColor: {
              red: 0.153,
              green: 0.306,
              blue: 0.075,
            }
          }
        }
      }
    }
},
{
    addConditionalFormatRule: {//conditional format dropdown item
      rule: {
        ranges: [
          {
            sheetId: dailyTaskSheetId,
            startRowIndex: 1,
            endRowIndex: numRowToCreate,
            startColumnIndex: 4,
            endColumnIndex: 5,
          }
        ],
        booleanRule: {
          condition: {
            type: "TEXT_CONTAINS",
            values: [
              {
                userEnteredValue: "PENDING"
              }
            ]
          },
          format: {
            textFormat: {
              foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
              },
              bold: true 
            },
            backgroundColor: {
              red: 0.471,
              green: 0.247,
              blue: 0.16,
            }
          }
        }
      }
    }
},
{ //name drop down lists
    setDataValidation: {
      range: {
        sheetId: dailyTaskSheetId,
        startRowIndex: 1,
        endRowIndex: numRowToCreate,
        startColumnIndex: 3,
        endColumnIndex: 4
      },
      rule: {
        condition: {
          type: 'ONE_OF_LIST',
          values: [
            {
            userEnteredValue: 'Nguyễn Trung Hiếu',
            },
            {
            userEnteredValue: 'Phạm Tiến Thành',
            },
            {
            userEnteredValue: 'Lê Bình Minh',
            },
            {
            userEnteredValue: 'Nguyễn Minh Khương',
            },
            {
            userEnteredValue: 'Nguyễn Tùng Lâm',
            },
            {
            userEnteredValue: 'Nguyễn Đức Hậu',
            },
            {
            userEnteredValue: 'Lưu Trường Sinh',
            },
            {
            userEnteredValue: 'Nguyễn Quang Thắng',
            },
            {
            userEnteredValue: 'Đặng Đình Hùng',
            },
            {
            userEnteredValue: 'Phùng Thị Khánh Linh',
            },
            {
            userEnteredValue: 'Tạ Quang Huy',
            },
            {
            userEnteredValue: 'Trần Văn Bình',
            },
          ],
        },
        showCustomUi: true,
        strict: true
      }
    }
}
]