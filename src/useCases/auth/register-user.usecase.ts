import { inject, injectable } from "tsyringe";
import { UserDTO } from "../../shared/dtos/user.dto";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IUserEntity } from "../../entities/models/user.entity";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";
import { IClientEntity } from "../../entities/models/client.entity";
import { IBarberEntity } from "../../entities/models/barber.entity";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt,
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("ICreateWalletUseCase")
    private _createWalletUseCase: ICreateWalletUseCase
  ) {}

  async execute(user: UserDTO): Promise<IBarberEntity | IClientEntity | null> {
    const { role, email, password } = user;

    const isEmailExisting = await this._userExistenceService.emailExists(email);
    if (isEmailExisting) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = password
      ? await this._passwordBcrypt.hash(password)
      : null;

    const userId = generateUniqueId(role);

    let repository;
    if (role === "client") {
      repository = this._clientRepository;
    } else if (role === "barber") {
      repository = this._barberRepository;
    } else {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._createWalletUseCase.execute({
      ownerId: userId,
      ownerType: role,
    });

    return await repository.save({
      ...user,
      password: hashedPassword ?? "",
      userId,
    });
  }
}
