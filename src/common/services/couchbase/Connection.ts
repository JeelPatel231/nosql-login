import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Cluster, DocumentExistsError, DocumentNotFoundError, connect } from "couchbase";
import { CONFIG } from "src/app.configuration";

type CouchbaseConfig = {
  clusterConectionUrl: string,
  username: string,
  password: string,
}

const envCouchbaseConfig: CouchbaseConfig = {
  clusterConectionUrl: CONFIG.CLUSTER_CONN_STRING,
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD
}

@Injectable()
export class CouchDbService {

  private readonly connectionPromise: Promise<Cluster>
  constructor(config: CouchbaseConfig = envCouchbaseConfig) {
    this.connectionPromise = connect(config.clusterConectionUrl, { 
      username: config.username,
      password: config.password,
    })
  }


  async getCollection(bucket: string, scope: string = "_default", collection: string = "_default") {
    return (await this.connectionPromise)
      .bucket(bucket) // TODO: add scope
      .collection(collection)
  } 


  parseAs<U, T extends ClassConstructor<U>>(clazz: T, plain: string){
    return plainToInstance(clazz, plain)
  }

  async try<T>(callback: () => Promise<T>) : Promise<T> {
    try { return await callback() }
    catch(error: unknown) {
      // handle errors thrown by couchbase here
      // and map them to HttpExceptions
      if(error instanceof DocumentExistsError) {
        throw new BadRequestException("Entity with same key already exists")
      }

      if(error instanceof DocumentNotFoundError) {
        throw new NotFoundException("Entity not found")
      }

      // finally throw unhandled error
      throw error;
    }
  }

}