import Joi from "joi";

export interface StoreProfile {
  name: string;
  description: string;
  phone:string;
  logo: string;
  address: string;
  banner: string;
}

export const updateStoreProfileSchema = Joi.object<StoreProfile>({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  logo: Joi.string().uri().allow(""),
  banner: Joi.string().uri().allow(""),
  address: Joi.string().allow(""),
});
