import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {schema,rules, CustomMessages} from "@ioc:Adonis/Core/Validator"

export default class UserSignInValidator {
    constructor( protected ctx:HttpContextContract){}

    public schema = schema.create({
        email: schema.string([
            rules.email(),
            rules.required(),
            rules.trim(),
            rules.exists({
                table: "users",
                column: "email"
            })
        ]),
        password: schema.string([
            rules.required(),
            rules.trim(),
            rules.escape()
        ])
    })

    public messages:CustomMessages = {
        "email.required": "Email Field is required",
        "email.exists": "Invalid Credentials",
        "password.required": "Password field is required"
    }
}