export default function validateCategoryMetadata(category: string, metadata: any) {
  if (
    category === "house" &&
    (!metadata?.bedrooms || !metadata?.bathrooms || !metadata?.type)
  ) {
    throw new Error(
      "House listings must include bedrooms, bathrooms, and type"
    );
  }
  if (category === "product" && !metadata?.productType) {
    throw new Error("Product listings must include productType");
  }
  if (
    category === "service" &&
    (!metadata?.serviceType || !metadata?.availability)
  ) {
    throw new Error(
      "Service listings must include serviceType and availability"
    );
  }
}
