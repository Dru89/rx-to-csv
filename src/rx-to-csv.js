import { Observable } from 'rxjs';
import { createWriteStream } from 'fs';
import defaults from 'lodash.defaults';

const defaultCSVOptions = {
  delimeter: ',',
  wrapText: 'true'
};

function toCSV(path, columns, options) {

  options = defaults(options, defaultCSVOptions);

  return Observable.create((subscriber) => {
    let source = this;
    let stream = createWriteStream(path);

    if (options.wrapText) {
      stream.write(columns.map((column) => `"${column}"`).join(','));
    } else {
      stream.write(columns.join(','));
    }

    stream.write('\n')
    stream.on('finish', () => subscriber.complete());
    stream.on('error', (err) => subscriber.error(err));

    let subscription = source.subscribe((values) => {
      try {
        let csvRow = [];

        for (let column of columns) {
          let value = String(values[column] || '');

          if (options.wrapText) {
            csvRow.push(`"${value}"`);
          } else {
            csvRow.push(value);
          }
        }

        stream.write(csvRow.join(options.delimeter));
        stream.write('\n');
        subscriber.next();
      } catch(err) {
        subscriber.error(err);
      }
    },
    (err) => {
      stream.end();
      subscriber.error(err)
    },
    () => {
      stream.end();
    });

    return subscription;
  });
}

Observable.prototype.toCSV = toCSV;
