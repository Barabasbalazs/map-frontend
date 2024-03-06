import { capitalizeFirstLetter } from "./string-manipulation";
import { Ref } from "vue";

export function mapErroMessage(errors: Ref<object>, errorMessage: string) {
  const key = Object.keys(errors.value).find((key) =>
    errorMessage.includes(key)
  );
  if (key) {
    const errorWithoutQutes = errorMessage.replace(/"/g, "");
    const lastDotIndex = errorWithoutQutes.lastIndexOf(".");
    errors.value[key] = capitalizeFirstLetter(
      lastDotIndex === -1
        ? errorWithoutQutes
        : errorWithoutQutes.substring(lastDotIndex + 1)
    );
  }
}
