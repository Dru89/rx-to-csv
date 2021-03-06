declare module 'rxjs/Observable' {
  interface Observable<T> {
    toCSV(path: string, columns: Array<string>, options?: { delimiter?: string, wrapText?: boolean }): Observable<T>;
  }
}
