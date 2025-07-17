import { sendEmail } from "../../common/utils/sendEmail";
import { User } from "../user/model";
import { Store } from "./model";
import { StoreProfile } from "./validation";

export class StoreService {
  create = async (value: StoreProfile, userId: string) => {
    const store = await Store.create({ ...value, owner: userId });

    // Fetch user info (for email)
    const user = await User.findById(userId);
    if (user) {
      const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard/store`; // customize as needed

      await sendEmail({
        to: user.email,
        type: "store-created",
        data: {
          storeName: store.name,
          dashboardUrl,
        },
      });
    }

    return store;
  };

  update = async (value: StoreProfile, userId: string) => {
    const store = await Store.findOneAndUpdate({ owner: userId }, value, {
      new: true,
      runValidators: true,
    });
    return store;
  };

  updateStore = async (value: StoreProfile, userId: string) => {
    try {
      const update = await this.update(value, userId);
      if (update) return update;

      const create = await this.create(value, userId); // send email here
      if (create) return create;
    } catch (error) {
      throw error;
    }
  };
}
