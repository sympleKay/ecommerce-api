import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'

export const signupRequest = async (request: object) => {
  const validation = await validator.validate({
    schema: schema.create({
      email: schema.string({ trim: true }, [
        rules.email({
          sanitize: true,
        }),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      username: schema.string({}, [
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      password: schema.string(),
      type: schema.string(),
      contactNumber: schema.string({}, [
        rules.mobile({
          strict: true,
        }),
        rules.unique({ table: 'users', column: 'contact_number' }),
      ]),
      firstName: schema.string(),
      lastName: schema.string(),
      address: schema.string(),
      avatar: schema.string.nullableAndOptional(),
    }),
    messages: {
      required: 'The {{ field }} is required to create a new account',
      'username.unique': 'Username is taken',
      'email.unique': 'Email is taken',
      'contactNumber.unique': 'Contact number is in use',
    },
    data: request,
  })

  return validation
}

export const signinRequest = async (request: object) => {
  const validation = await validator.validate({
    schema: schema.create({
      email: schema.string({ }, [
        rules.email(),
        rules.exists({ table: 'users', column: 'email' }),
      ]),
      password: schema.string(),
    }),
    messages: {
      required: 'The {{ field }} is required to create a new account',
      'email.exists': 'Invalid credentials',
    },
    data: request,
  })

  return validation
}

export const categoryRequest = async (request: object) => {
  const validation = await validator.validate({
    schema: schema.create({
      name: schema.string(),
    }),
    messages: {
      required: 'The {{ field }} is required to create a new account',
    },
    data: request,
  })

  return validation
}

export const subCategoryRequest = async (request: object) => {
  const validation = await validator.validate({
    schema: schema.create({
      name: schema.string(),
      productCategoryUid: schema.string({}, [
        rules.exists({ table: 'product_categories', column: 'uid' }),
      ]),
    }),
    messages: {
      required: 'The {{ field }} is required to create a new account',
      'productCategoryUid.exists': 'Product category not found',
    },
    data: request,
  })

  return validation
}

export const productRequest = async (request: object) => {
  const validation = await validator.validate({
    schema: schema.create({
      dayType: schema.string(),
      productCategoryUid: schema.string({}, [
        rules.exists({ table: 'product_categories', column: 'uid' }),
      ]),
      productSubCategoryUid: schema.string({}, [
        rules.exists({ table: 'product_sub_categories', column: 'uid' }),
      ]),
      title: schema.string(),
      description: schema.string(),
      address: schema.string(),
    }),
    messages: {
      required: 'The {{ field }} is required to create a new account',
      'productCategoryUid.exists': 'Product category not found',
      'productSubCategoryUid.exists': 'Product sub-category not found',
    },
    data: request,
  })

  return validation
}
