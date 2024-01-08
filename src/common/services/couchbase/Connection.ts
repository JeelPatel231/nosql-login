import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Cluster, DocumentExistsError, DocumentNotFoundError, connect } from "couchbase";
import { CONFIG } from "src/app.configuration";

@Injectable()
export class CouchDbService {

  private readonly connectionPromise: Promise<Cluster>
  constructor() {
    this.connectionPromise = connect(CONFIG.CLUSTER_CONN_STRING, { 
      username: CONFIG.DB_USERNAME, 
      password: CONFIG.DB_PASSWORD,
    })
  }


  async getCollection(bucket: string, scope: string = "_default", collection: string = "_default") {
    return (await this.connectionPromise)
      .bucket(bucket)
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