
/**
 *  Body necessary to make the request
 */
export interface ResetPasswordBody {
    /**
     *  Token that expires in the backend used to admit the restore password operation
     */
    token: string,
    /**
     *  New password to apply
     */
    password: string,
    /**
     *  The confirmation of the password.
     */
    password_confirmation: string
}