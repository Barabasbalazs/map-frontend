import AdminRequestCard from "../AdminRequestCard.vue";
import { useAdministrationStore } from "../../../stores/administration-store";
import { setActivePinia, createPinia } from "pinia";
import { mount } from "@vue/test-utils";
import { expect, test, describe, beforeEach, vi } from "vitest";

const mockedAdminRequest = {
  id: "1",
  user: { id: "1", name: "Test User", email: "test@mail.com" },
};

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("AdminRequestCard", () => {
  test("It should send the approve parameter to administrationStore function correctly on the respective button", async () => {
    useAdministrationStore().respondToAdminRequest = vi
      .fn()
      .mockResolvedValue(() => {
        return 1;
      });

    const wrapper = mount(AdminRequestCard, {
      props: { adminRequest: mockedAdminRequest },
    });

    const approveButton = wrapper.find("#approve-request");
    await approveButton.trigger("click");

    expect(useAdministrationStore().respondToAdminRequest).toHaveBeenCalledWith(
       mockedAdminRequest ,  true 
    );

    const rejectButton = wrapper.find("#reject-request");
    await rejectButton.trigger("click");

    expect(useAdministrationStore().respondToAdminRequest).toHaveBeenCalledWith(
       mockedAdminRequest ,  false 
    );
  });
});
