import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext"
import {schema,rules, CustomMessages} from "@ioc:Adonis/Core/Validator"

export default class UserRequestValidator {
    constructor( protected ctx:HttpContextContract){}

    public schema = schema.create({
        email: schema.string([
            rules.email(),
            rules.required(),
            rules.trim(),
            rules.unique({
                table: "users",
                column: "email"
            })
        ]),
        firstname: schema.string([
            rules.required(),
            rules.trim(),
            rules.escape()
        ]),
        lastname: schema.string([
            rules.required(),
            rules.trim(),
            rules.escape()
        ]),
        password: schema.string([
            rules.required(),
            rules.trim(),
            rules.escape(),
            rules.minLength(8)
        ])
    })

    public messages:CustomMessages = {
        "email.required": "Email Field is required",
        "email.unique": "Email address taken, did you forget your password? try recovering your account",
        "firstname.required": "Firstname field is required",
        "lastname.required": "Lastname field is required",
        "password.required": "Password field is required",
        "password.minLength": "Password should contain a minimum of 8 characters"
    }
}