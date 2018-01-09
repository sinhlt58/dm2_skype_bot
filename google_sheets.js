var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var utils = require('./utils');
var sheets_data = require('./google_sheet_format');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials_oauth/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.dm2bot.json';

var oauth2_client = {};
var sheets = google.sheets('v4');

exports.init = function(){
  // Load client secrets from a local file.
  fs.readFile('google_sheet_client_key/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    getOauth2(JSON.parse(content), saveOauth2);
  });
};

exports.createDailyTasks = function(){
  var numRowToCreate = 30;
  var numColumnToCreate = 8;
  var dm2SpreadSheetId = '1cNptK-AcRUHzEPsI122BwHLe9YwVz0Eaxp4VxtIUCgA';
  var dailyTaskSheetId = 1753802151;
  
  var batchUpdateRequest = {requests: sheets_data.data};

  //data for insert date to first cell of each row (A Minh's request)
  var dataFirstCellEachRow = [];
  for (var i=0; i<sheets_data.numRowToCreate; i++){
    var d = [];
    d.push(utils.getDateTime());
    dataFirstCellEachRow.push(d);
  }

  sheets.spreadsheets.batchUpdate({
    spreadsheetId: dm2SpreadSheetId,
    resource: batchUpdateRequest,
    auth: oauth2_client
  }, function(err, response){
    if (err){
      console.log(err);
    }else{
      console.log('Create successfully!');
      sheets.spreadsheets.values.batchUpdate({ //write to the first row
        auth: oauth2_client,
        spreadsheetId: dm2SpreadSheetId,
        resource: {
          data: [
            {
              range: '2. Daily Task!A1:H1',
              majorDimension: 'ROWS',
              values: [
                [utils.getDateTime(), "Bug ID/Task", "Description", "PIC", "Status", "ETA", "Comment", "Miss Daily Task + ETA"]
              ]
            },
            {
              range: '2. Daily Task!A2:A' + sheets_data.numRowToCreate+1,
              majorDimension: 'ROWS',
              values: dataFirstCellEachRow
            }
          ],
          valueInputOption: "USER_ENTERED"     
        }
      }, function(err, response){
        if (err){
          console.log(err);
        }else{
          console.log('Format successfully!');
        }
      });   
    }
  });
};
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function getOauth2(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function saveOauth2(auth) {
  oauth2_client = auth;
}