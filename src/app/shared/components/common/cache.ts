import { HttpHeaders, HttpContext, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface HttpOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  params?:
    | HttpParams
    | { hideLoader: 'true' | 'false' }
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export type HttpResponseMapping<T> = Observable<{
  data: T[];
  message: string;
  success: boolean;
}>;
export class CacheStorage<T = any> {
  private db: { data: T[]; message: string; success: boolean } = {
    data: [],
    message: '',
    success: false,
  };
  constructor(private uniqueIdentifier: string) {}
  set addOrUpdateData(val: T | any) {
    const existingData = this.db.data.filter(
      (d: any) => d[this.uniqueIdentifier] == val[this.uniqueIdentifier]
    );
    if (existingData) {
      Object.keys(val).forEach((k: any) => {
        existingData[k] = val[k];
      });
    } else {
      this.db.data.push(val);
    }
  }
  private set updateDB(val: T[]) {
    this.db.data = val;
  }
  private hasFilteredData = false;
  loadData(
    obj: HttpResponseMapping<T>,
    options: HttpOptions
  ): HttpResponseMapping<T> {
    console.log('loading data..');
    if (this.db.data.length && !this.hasFilteredData)
      return of(this.db).pipe(
        map((res) => {
          let Data = res;
          if (options.params) {
            Object.entries(options.params).forEach(([k, v]) => {
              const value = v.includes(',')
                ? v.split(',')
                : v.includes(';')
                ? v.split(';')
                : v;
              Data.data = Data.data.filter((d: any) =>
                Array.isArray(value) ? value.includes(d[k]) : d[k] === value
              );
            });
          }
          return Data;
        })
      );
    else {
      if (options.params) {
        this.hasFilteredData = Object.values(options.params).some((v) => !!v);
      }
      return obj.pipe(
        map((res) => {
          this.updateDB = res.data;
          return res;
        })
      );
    }
  }
}