import { User } from '../../domain/model/user.ts';
import { UserRepository } from '../../domain/repository/user.repository.ts';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';
import {EntityId} from "../../../shared/domain/model/entity-id.ts";

export class UserFileSystemRepository implements UserRepository {
  constructor(
    public filePath = './config/user.json',
  ) {}

  async get(id: string): Promise<User> {
    const userList = await this.getContent();
    const user = userList.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const userList = await this.getContent();
    const user = userList.find((item) => item.email.value === email);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async save(user: User): Promise<void> {
    const userList = await this.getContent();
    userList.push(user);

    await this.saveFile(userList);
  }

  async remove(id: EntityId): Promise<void> {
    const userList = await this.getContent();
    const index = userList.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException();
    }

    userList.splice(index, 1);

    await this.saveFile(userList);
  }

  private async saveFile(userList: User[]): Promise<void> {
    const serializedFiles = userList.map((temp) => temp.toObject());
    await Deno.writeTextFile(this.filePath, JSON.stringify(serializedFiles), { create: true });
  }

  private async getContent(): Promise<User[]> {
    let content: string;

    try {
      content = await Deno.readTextFile(this.filePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      content = '[]';
    }

    let array: any[];

    try {
      array = JSON.parse(content);
    } catch (error) {
      console.log(error);
      throw new ParseErrorException();
    }

    return array.map((item) => User.reconstitute(item));
  }
}
