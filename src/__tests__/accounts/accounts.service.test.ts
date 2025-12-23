import { AccountsService } from "../../application/services/accounts.service";
import { AccountRepo } from "../../repositories/account.repo";
import { NotificationCenter } from "../../application/notifications/notification-center";
import prisma from "../../infrastructure/prisma/client";
import { AccountLeaf } from "../../domain/accounts/composite/AccountLeaf";
import { SavingsAccount } from "../../domain/accounts/composite/SavingsAccount";
import { ActiveState } from "../../domain/accounts/state/ActiveState";
import { AccountGroup } from "../../domain/accounts/composite/AccountGroup";

describe("AccountsService", () => {
  function mk() {
    const repo = new AccountRepo();
    const notifications = new NotificationCenter();
    jest.spyOn(notifications, "notify").mockResolvedValue(undefined as any);
    return { service: new AccountsService(repo, notifications), notifications, repo };
  }

  test("createAccount: parentAccountId not found => 404", async () => {
    const { service } = mk();
    jest.spyOn(AccountRepo.prototype, "findById").mockResolvedValue(null);

    await expect(service.createAccount({
      userId: 1,
      accountType: "SAVINGS" as any,
      name: "myacc",
      parentAccountId: 999,
    })).rejects.toThrow("Parent account not found");
  });

  test("createAccount: default initialBalance=0 + notify called", async () => {
    const { service, notifications } = mk();

    jest.spyOn(AccountRepo.prototype, "create").mockResolvedValue(
      new SavingsAccount("1", "acc", 0, new ActiveState()) as any
    );

    const out = await service.createAccount({
      userId: 1,
      accountType: "SAVINGS" as any,
      name: "acc",
    });

    expect(out.getBalance()).toBe(0);
    expect(notifications.notify).toHaveBeenCalledTimes(1);
  });

  test("changeState: group account => 400", async () => {
    const { service } = mk();
    jest.spyOn(AccountRepo.prototype, "findByIdDecorated").mockResolvedValue(
      new AccountGroup("10", "g") as any
    );

    await expect(service.changeState(10, "FREEZE" as any)).rejects.toThrow(
      "Cannot change state of an account group directly"
    );
  });

  test("changeState: FREEZE updates state + repo.save called", async () => {
    const { service } = mk();
    const acc: AccountLeaf = new SavingsAccount("10", "sav", 100, new ActiveState());

    jest.spyOn(AccountRepo.prototype, "findByIdDecorated").mockResolvedValue(acc as any);
    jest.spyOn(AccountRepo.prototype, "save").mockResolvedValue(undefined as any);
    jest.spyOn(AccountRepo.prototype, "getOwnerUserIdByAccountId").mockResolvedValue(1);

    const out = await service.changeState(10, "FREEZE" as any);
    expect((out as any).getState()).toBe("FROZEN");
    expect(AccountRepo.prototype.save).toHaveBeenCalledTimes(1);
  });

  test("addFeature: OVERDRAFT_PLUS only for CHECKING => 400", async () => {
    const { service } = mk();
    (prisma as any).account.findUnique.mockResolvedValue({ id: 1, accountType: "SAVINGS" });

    await expect(service.addFeature(1, { type: "OVERDRAFT_PLUS", numberValue: 100 }))
      .rejects.toThrow("OVERDRAFT_PLUS only allowed for CHECKING accounts");
  });
});
