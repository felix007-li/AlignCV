export class PriceClient {
  async get(_locale: any): Promise<any> {
    return { student: {}, public: {}, monthly: {} };
  }
}
