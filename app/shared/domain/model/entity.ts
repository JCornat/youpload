import { EntityId } from './entity-id.ts';

export abstract class Entity {
  private readonly _id: EntityId;

  protected constructor(id: EntityId) {
    this._id = id;
  }

  get id(): EntityId {
    return this._id;
  }

  static createEntityId(): EntityId {
    return crypto.randomUUID();
  }
}
