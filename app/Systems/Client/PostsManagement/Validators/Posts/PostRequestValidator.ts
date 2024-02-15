import { rules,schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string([
      rules.required(),
      rules.unique({
        table: "posts",
        column: "title"
      }),
      rules.minLength(3),
      rules.escape(),
    ]),

    description: schema.string([
      rules.nullable(),
      rules.escape(),
    ]),

    body: schema.string([
      rules.escape(),
      rules.nullable(),
    ]),

    isPublished: schema.boolean([
      rules.nullable()
    ]),

    images: schema.string([
      rules.nullable(),
      rules.escape(),
    ]),

    video: schema.string([
      rules.nullable(),
      rules.escape()
    ]),
    
    subscriptionId: schema.number()

  })

    

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "title.required": "Enter a valid title for this subscription",
    "subscription": "Enter a valid Subscription ID"
  }
}
