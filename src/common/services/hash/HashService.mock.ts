import { HashService } from "./HashService"


export class MockHashService {
  static get() : HashService {
    const service = new HashService()
    jest.spyOn(service, 'hash').mockImplementation(
      async (data: string) => "hashed_"+data
    )
    jest.spyOn(service, 'compare').mockImplementation(
      async (plain: string, hashed: string) => hashed.slice(7) == plain
    )

    return service
  }
}