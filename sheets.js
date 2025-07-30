const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  credentials: require('./credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'Jogos';

async function getSheetData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME,
  });
  return res.data.values;
}

function getTodayLeagues() {
  return getSheetData().then(rows => {
    const today = new Date().toLocaleDateString('pt-BR');
    const filtered = rows.filter(r => r[0] === today).map(r => r[1]);
    return [...new Set(filtered)];
  });
}

function getTodayMatchesByLeague(league) {
  return getSheetData().then(rows => {
    const today = new Date().toLocaleDateString('pt-BR');
    return rows.filter(r => r[0] === today && r[1] === league).map(r => ({
      timeA: r[2], timeB: r[3],
      probA: r[4], probX: r[6], probB: r[5],
      oddsA: r[7], oddsX: r[9], oddsB: r[8],
    }));
  });
}

module.exports = { getTodayLeagues, getTodayMatchesByLeague };