export interface UpdateUserRequest{
    name?: string,
    email?: string,
    password?: string,
    password_confirmation?: string,
    actual_password?: string,
}