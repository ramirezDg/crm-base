export class UpdateUserDto {
    name?: string;
    lastName?: string;
    email?: string;
    password?: string;
    rol?: string;
    status?: boolean;
    hashedRt?: string | null;
}
