import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJob, Job } from '../job.model';

import { JobService } from './job.service';

describe('Job Service', () => {
  let service: JobService;
  let httpMock: HttpTestingController;
  let elemDefault: IJob;
  let expectedResult: IJob | IJob[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JobService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      jobTitle: 'AAAAAAA',
      minSalary: 0,
      maxSalary: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Job', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Job()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Job', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          jobTitle: 'BBBBBB',
          minSalary: 1,
          maxSalary: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Job', () => {
      const patchObject = Object.assign(
        {
          jobTitle: 'BBBBBB',
          maxSalary: 1,
        },
        new Job()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Job', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          jobTitle: 'BBBBBB',
          minSalary: 1,
          maxSalary: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Job', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addJobToCollectionIfMissing', () => {
      it('should add a Job to an empty array', () => {
        const job: IJob = { id: 'ABC' };
        expectedResult = service.addJobToCollectionIfMissing([], job);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(job);
      });

      it('should not add a Job to an array that contains it', () => {
        const job: IJob = { id: 'ABC' };
        const jobCollection: IJob[] = [
          {
            ...job,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addJobToCollectionIfMissing(jobCollection, job);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Job to an array that doesn't contain it", () => {
        const job: IJob = { id: 'ABC' };
        const jobCollection: IJob[] = [{ id: 'CBA' }];
        expectedResult = service.addJobToCollectionIfMissing(jobCollection, job);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(job);
      });

      it('should add only unique Job to an array', () => {
        const jobArray: IJob[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'bd218adc-7090-4944-b3cd-6a2f7908d598' }];
        const jobCollection: IJob[] = [{ id: 'ABC' }];
        expectedResult = service.addJobToCollectionIfMissing(jobCollection, ...jobArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const job: IJob = { id: 'ABC' };
        const job2: IJob = { id: 'CBA' };
        expectedResult = service.addJobToCollectionIfMissing([], job, job2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(job);
        expect(expectedResult).toContain(job2);
      });

      it('should accept null and undefined values', () => {
        const job: IJob = { id: 'ABC' };
        expectedResult = service.addJobToCollectionIfMissing([], null, job, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(job);
      });

      it('should return initial array if no Job is added', () => {
        const jobCollection: IJob[] = [{ id: 'ABC' }];
        expectedResult = service.addJobToCollectionIfMissing(jobCollection, undefined, null);
        expect(expectedResult).toEqual(jobCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
