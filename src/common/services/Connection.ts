import { Injectable } from "@nestjs/common";
import { Bucket, BucketManager, Cluster, connect } from "couchbase";
import { CONFIG } from "src/app.configuration";

@Injectable()
export class CouchDbService {

  private readonly connectionPromise: Promise<Cluster> = connect(CONFIG.CLUSTER_CONN_STRING, { 
    username: CONFIG.DB_USERNAME, 
    password: CONFIG.DB_PASSWORD,
  })

  private async getConnection() : Promise<Cluster> {
    return await this.connectionPromise
  }

  async userBucket(): Promise<Bucket> {
    const conn = await this.getConnection()
    return conn.bucket("users")
  }

}