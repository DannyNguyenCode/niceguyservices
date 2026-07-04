export {
  PET_MARKET_COLLECTION,
  petMarketProductSchema,
  parsePetMarketProductDocument,
  parsePetMarketProductDocuments,
  parsePetMarketProductInput,
  parsePetMarketProductPatch,
  mergePetMarketProductUpdate,
  toPetMarketProductDTO,
} from "./schema";

export {
  countPetMarketProducts,
  createPetMarketProduct,
  deletePetMarketProduct,
  findAllPetMarketProducts,
  findPetMarketFeaturedProducts,
  findPetMarketProductById,
  findPetMarketProducts,
  fulfillPetMarketOrder,
  getPetMarketCollection,
  listPetMarketCategories,
  listPetMarketPetTypes,
  updatePetMarketProduct,
} from "./model";

export { PetMarketInventoryError } from "./errors";

export {
  ensurePetMarketAdminUser,
  getPetMarketSession,
  registerPetMarketUser,
  resetPetMarketPassword,
  revokePetMarketSession,
  startPetMarketLogin,
  startPetMarketPasswordReset,
  verifyPetMarketLogin,
  PET_MARKET_MIN_PASSWORD_LENGTH,
} from "./auth";

export type {
  PetMarketAuthSessionDTO,
  PetMarketAuthUserDTO,
  PetMarketLoginInput,
  PetMarketRegisterInput,
  PetMarketResetPasswordInput,
  PetMarketVerifyCodeInput,
} from "./auth";

export {
  completePetMarketCheckoutReservation,
  createPetMarketCheckoutReservation,
  enrichPetMarketProductWithAvailability,
  expireStalePetMarketReservations,
  getPetMarketAvailabilityBatch,
  getPetMarketProductAvailability,
  releaseActiveReservationsForSession,
  releasePetMarketCheckoutReservation,
  sumActiveReservedQuantity,
  validatePetMarketCheckoutReservation,
} from "./reservations";

export { PET_MARKET_RESERVATIONS_COLLECTION } from "./reservation-schema";

export type {
  PetMarketProduct,
  PetMarketProductDocument,
  PetMarketProductDTO,
  PetMarketProductFilter,
  PetMarketProductInput,
  PetMarketProductSearchQuery,
  PetMarketProductSearchResult,
  PetMarketProductUpdateInput,
  PetMarketOrderLineItem,
  PetMarketFulfillOrderInput,
  PetMarketFulfillOrderResult,
  PetMarketReservationStatus,
  PetMarketInventoryReservationDTO,
  PetMarketCreateReservationInput,
  PetMarketCreateReservationResult,
  PetMarketValidateReservationResult,
  PetMarketCompleteReservationResult,
  PetMarketAvailabilitySnapshot,
} from "./types";

export { PET_MARKET_SEARCH_FIELDS } from "./types";
export {
  buildPetMarketMongoFilter,
  buildPetMarketTextSearchFilter,
  productMatchesPetMarketFilter,
  productMatchesPetMarketQuery,
  productMatchesPetMarketTextSearch,
  searchPetMarketProductsInMemory,
} from "./search-filters";
export {
  PET_MARKET_DEFAULT_PAGE_SIZE,
  PET_MARKET_HOMEPAGE_FEATURED_LIMIT,
  PET_MARKET_HOMEPAGE_FEATURED_NAMES,
  PET_MARKET_RESERVATION_TTL_MS,
  PET_MARKET_RESERVATION_TTL_MINUTES,
} from "./constants";
