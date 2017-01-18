# Space/Time ETL module: Churches in New York City, 1790 to 1856

[ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) module for NYPL's [NYC Space/Time Direcory](http://spacetime.nypl.org/). This Node.js module downloads, parses, and/or transforms Churches in New York City, 1790 to 1856 data, and creates a NYC Space/Time Directory dataset.

## Details

<table>
  <tbody>

    <tr>
      <td>ID</td>
      <td><code>nyc-churches</code></td>
    </tr>

    <tr>
      <td>Title</td>
      <td>Churches in New York City, 1790 to 1856</td>
    </tr>

    <tr>
      <td>Description</td>
      <td>Churches in New York City, 1790 to 1856 - from Evangelical Gotham: Religion and the Making of New York City</td>
    </tr>

    <tr>
      <td>License</td>
      <td>CC BY 3.0</td>
    </tr>

    <tr>
      <td>Author</td>
      <td>Kyle Roberts <kroberts2@luc.edu></td>
    </tr>

    <tr>
      <td>Website</td>
      <td><a href="http://press.uchicago.edu/ucp/books/book/chicago/E/bo24204663.html">http://press.uchicago.edu/ucp/books/book/chicago/E/bo24204663.html</a></td>
    </tr>
  </tbody>
</table>

## Available steps

  - `transform`

## Usage

```
git clone https://github.com/nypl-spacetime/etl-nyc-churches.git /path/to/etl-modules
cd /path/to/etl-modules/etl-nyc-churches
npm install

spacetime-etl nyc-churches [<step>]
```

See http://github.com/nypl-spacetime/spacetime-etl for information about Space/Time's ETL tool. More Space/Time ETL modules [can be found on GitHub](https://github.com/search?utf8=%E2%9C%93&q=org%3Anypl-spacetime+etl-&type=Repositories&ref=advsearch&l=&l=).

# Data

The dataset created by this ETL module's `transform` step can be found in the [data section of the NYC Space/Time Directory website](http://spacetime.nypl.org/#data-nyc-churches).
