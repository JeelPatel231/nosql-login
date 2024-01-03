import { Injectable } from "@nestjs/common";
import { Bucket, BucketManager, Cluster, connect } from "couchbase";

const clusterConnStr = 'couchbase://localhost';
const username = 'admin';
const password = 'password';


@Injectable()
export class CouchDbService {

  private readonly connectionPromise: Promise<Cluster> = connect(clusterConnStr, { 
    username: username, 
    password: password
  })

  private async getConnection() : Promise<Cluster> {
    return await this.connectionPromise
  }

  async userBucket(): Promise<Bucket> {
    const conn = await this.getConnection()
    return conn.bucket("users")
  }

}