import { Injectable } from "@nestjs/common";
import { Bucket, BucketManager, Cluster, connect } from "couchbase";
import { CONFIG } from "src/app.configuration";

@Injectable()
export class CouchDbService {

  private readonly connectionPromise: Promise<Cluster> = connect(CONFIG.CLUSTER_CONN_STRING, { 
    username: CONFIG.DB_USERNAME, 
    password: CONFIG.DB_PASSWORD,
  })

  get connection():  Promise<Cluster> {
    return this.connectionPromise
  }

  async getCollection(bucket: string, scope: string = "_default", collection: string = "_default") {
    return (await this.connection)
      .bucket(bucket)
      .scope(scope)
      .collection(collection)
  } 

}