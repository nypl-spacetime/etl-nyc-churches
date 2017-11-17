const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const H = require('highland')
const R = require('ramda')

const types = {
  B: 'Baptist',
  C: 'Catholic',
  D: 'Reformed Dutch',
  E: 'Episcopalian',
  F: 'Unitas Fratrum/Moravian',
  J: 'Jewish',
  L: 'Lutheran',
  M: 'Methodist',
  P: 'Presbyterian',
  Q: 'Quaker',
  G: 'German Reformed',
  V: 'Unitarian',
  H: 'Huguenot',
  I: 'Congregational',
  U: 'Universalist',
  O: 'Other' // Is this true?
}

function parseHtml (html) {
  if (!html) {
    return
  }

  const keys = {
    'Denomination:': 'denomination',
    'Date Founded/Built:': 'yearBuilt',
    'name:': 'longName',
    'description:': 'description'
  }

  const findKv = (line) => {
    const kv = line.split('</b>')
      .map((kv) => kv.replace('</div>', ''))
      .map((kv) => kv.replace('  ', ' '))
      .map((kv) => kv.trim())

    const key = keys[kv[0]]

    return [
      key,
      key === 'yearBuilt' ? parseInt(kv[1]) : kv[1]
    ]
  }

  const dataArr = html.split('<b>')
    .slice(1)
    .map(findKv)

  return R.fromPairs(dataArr)
}

function parsePeriod (periodStr) {
  if (periodStr) {
    const match = periodStr.match(/(\d{2,4})/g)
    if (match) {
      let lastCentury
      const years = match
        .map((year) => {
          if (year.length === 2 && lastCentury) {
            year = lastCentury + year
          }
          lastCentury = year.substring(0, 2)

          return year
        })
        .map((year) => parseInt(year))

      return {
        validSince: years[0],
        validUntil: years[1]
      }
    }
  }
}

function transform (config, dirs, tools, callback) {
  const csvDir = path.join(__dirname, 'nyc-churches-1790-1856')
  const readFile = H.wrapCallback(fs.readFile)

  const rows = H(fs.readdirSync(csvDir))
    .filter((filename) => path.extname(filename) === '.csv')
    .map((filename) => path.join(csvDir, filename))
    .map(readFile)
    .merge()
    .pipe(csv({
      separator: ',',
      quote: '"',
      escape: '"',
      newline: '\n',
      headers: [
        'lat',
        'lon',
        'titlePeriod',
        'type',
        'evangelical',
        'html'
      ]
    }))

  let id = 0

  H(rows)
    .filter((row) => row.type)
    .map((row) => {
      let title
      let periodStr

      if (row.titlePeriod) {
        [title, periodStr] = row.titlePeriod.split(',')
      }

      const period = parsePeriod(periodStr)
      const data = parseHtml(row.html)

      const typeKey = row.type.trim()

      return Object.assign(row, {
        title,
        // year,
        typeKey,
        type: types[typeKey],
        evangelical: row.evangelical === 'Evangelical',
        lon: parseFloat(row.lon),
        lat: parseFloat(row.lat)
      }, period, data)
    })
    .map((row) => {
      var obj = {
        id: id++,
        type: 'st:Church',
        name: row.title,
        validSince: row.validSince,
        validUntil: row.validUntil,
        data: R.omit(['title', 'html', 'lat', 'lon', 'titlePeriod', 'validSince', 'validUntil'], row)
      }

      if (row.lat && row.lon) {
        obj.geometry = {
          type: 'Point',
          coordinates: [row.lat, row.lon]
        }
      }

      return obj
    })
    .map((row) => ({
      type: 'object',
      obj: row
    }))
    .map(H.curry(tools.writer.writeObject))
    .nfcall([])
    .series()
    .stopOnError(callback)
    .done(callback)
}

// ==================================== API ====================================

module.exports.steps = [
  transform
]
