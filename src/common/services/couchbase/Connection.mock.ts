/**
 * This is not a mock per say, but essentially a
 * class that will connect to test database url
 * for testing
 */

import { CouchDbService } from "./Connection";


export class MockCouchbaseService {
  
  static get() : CouchDbService {
    return new CouchDbService({
      clusterConectionUrl: `couchbase://localhost`,
      username: "admin",
      password: "password",
    })
  }

}