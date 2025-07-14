import {  Store } from "./model";
import { StoreProfile } from "./validation";

export class StoreService {
  create = async (value: StoreProfile, userId: string) => {
    const store = await Store.create({ ...value, owner: userId });
    return store;
  };

  update = async (value: StoreProfile, userId: string) => {
    const store = await Store.findOneAndUpdate(
      { owner: userId },
      value,
      {
        new: true,
        runValidators: true,
      }
    );
    return store;
  };

  updateStore = async (value: StoreProfile, userId: string) => {
    try {
      const update = await this.update(value, userId)
      if(update) return update;
      const create = await this.create(value, userId) 
      if(create) return create;
    } catch (error) {
      throw error
    }
  };
}
