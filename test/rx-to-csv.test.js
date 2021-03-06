import chai from 'chai';
import { join } from 'path';
import { Observable } from 'rxjs';
import { existsSync, unlinkSync, readFileSync } from 'fs';
import '../src/rx-to-csv';

const expect = chai.expect;
const testCSV = join(__dirname, 'write.test.csv');
const testCSV2 = join(__dirname, 'non-exist/write.test.csv');
const noop = () => {};

describe('toCSV()', () => {

  beforeEach(() => {
    cleanup();
  });

  after(() => {
    cleanup();
  });

  it('should generate a csv file.', (done) => {
    let data = [
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Tommy' }
    ];
    let csvString = '"id","name"\n1,"Mike"\n2,"Tommy"\n';

    Observable.of(...data)
      .toCSV(testCSV, ['id', 'name'])
      .subscribe(noop, noop, () => {
        let csv = readFileSync(testCSV, 'utf8');
        expect(csv).to.equal(csvString);
        done();
      });
  });

  it('should generate a csv file with directory not created.', (done) => {
    let data = [
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Tommy' }
    ];
    let csvString = '"id","name"\n1,"Mike"\n2,"Tommy"\n';

    Observable.of(...data)
      .toCSV(testCSV2, ['id', 'name'])
      .subscribe(noop, noop, () => {
        let csv = readFileSync(testCSV2, 'utf8');
        expect(csv).to.equal(csvString);
        done();
      });
  });

  it('should recognize upstream errors.', (done) => {
    let data = [
      { id: 1, name: 'Mike' },
      { id: 2, name: 'Tommy' }
    ];

    Observable.of(...data)
      .mergeMap(() => Observable.throw(new Error('failed')))
      .toCSV(testCSV2, ['id', 'name'])
      .subscribe(
        noop,
        (err) => {
          expect(err).to.be.an('error');
          done();
        },
        noop
      );
  });
});

function cleanup() {
  if (existsSync(testCSV)) {
    unlinkSync(testCSV);
  }

  if (existsSync(testCSV2)) {
    unlinkSync(testCSV2);
  }
}
