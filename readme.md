# Shop API

My first REST API - learning project. Authentication is done using JWT tokens.

NOTE: Registering as ADMIN is not possible. ADMIN role has to be manually given from inside database.

## Indices

- [ADMIN](#admin)

  - [Create New Category](#1-create-new-category)
  - [Delete Category](#2-delete-category)
  - [Delete User](#3-delete-user)
  - [Get All Categories](#4-get-all-categories)
  - [Get All Products](#5-get-all-products)
  - [Get All Users](#6-get-all-users)
  - [Get User's Cart](#7-get-user's-cart)
  - [Update User](#8-update-user)

- [Cart](#cart)

  - [Add Many Products To Cart](#1-add-many-products-to-cart)
  - [Add Single Product To Cart](#2-add-single-product-to-cart)
  - [Delete Many Products From Cart](#3-delete-many-products-from-cart)
  - [Delete SIngle Product From Cart](#4-delete-single-product-from-cart)
  - [Empty Cart](#5-empty-cart)
  - [Get Logged In User's Cart](#6-get-logged-in-user's-cart)

- [Categories](#categories)

  - [Get Category](#1-get-category)
  - [Get Direct Children](#2-get-direct-children)
  - [Get Path To Root Category](#3-get-path-to-root-category)
  - [Get Root Categories](#4-get-root-categories)

- [Products](#products)

  - [Create New Product](#1-create-new-product)
  - [Delete Product](#2-delete-product)
  - [Get Merchant By Product \_id](#3-get-merchant-by-product-_id)
  - [Get Products By Merchant](#4-get-products-by-merchant)
  - [Get Single Product](#5-get-single-product)
  - [Product Fuzzy Search](#6-product-fuzzy-search)
  - [Update Product](#7-update-product)
  - [Update Product Category](#8-update-product-category)
  - [Upload Product Photos](#9-upload-product-photos)

- [User](#user)

  - [Forgot Password](#1-forgot-password)
  - [Get Logged In User](#2-get-logged-in-user)
  - [Get Logged In User Created Products](#3-get-logged-in-user-created-products)
  - [Get Single User](#4-get-single-user)
  - [Login User](#5-login-user)
  - [Logout User](#6-logout-user)
  - [Register User](#7-register-user)
  - [Resend Verify Email](#8-resend-verify-email)
  - [Reset Password](#9-reset-password)
  - [Update Logged In User Details](#10-update-logged-in-user-details)
  - [Update Logged In User Password](#11-update-logged-in-user-password)
  - [Upload Logged In User Photo](#12-upload-logged-in--user-photo)
  - [Verify Email](#13-verify-email)

---

## ADMIN

ADMIN routes require user to be logged in and have ADMIN role.

### 1. Create New Category

Creates a new category. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/admin/categories/add
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Long Terriers",
"description": "description",
"parent": "Terriers"}
```

### 2. Delete Category

Deletes a category and all its subcategories. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: DELETE
Type: RAW
URL: {{URI}}/api/v1/admin/categories/delete/60450029e37bb9115cb95e08
```

### 3. Delete User

Deletes user by user \_id. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/admin/users/user/604281ea7ac10e49686a589d
```

### 4. Get All Categories

Gets a list of all categories. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/admin/categories/list
```

### 5. Get All Products

Gets a list of all products. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/admin/products
```

### 6. Get All Users

Gets a list of all users. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/admin/users/all
```

### 7. Get User's Cart

Gets user's cart by user \_id. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/admin/users/cart/604281ea7ac10e49686a589d
```

### 8. Update User

Updates user by user \_id. Requires being logged in and ADMIN role.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/admin/users/user/604281ea7ac10e49686a589d
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "",
"email": "",
"role": ""}
```

## Cart

Cart related requests available to logged in user.

### 1. Add Many Products To Cart

Adds many products to cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/addmany
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"products": ["60439c1afcbb170158def4b0", "6043a0a7a4cabf44b832d08e", "6043a18b58c89753ec9fea7c", "6043a39e19ce2b45c8c865bf"]}
```

### 2. Add Single Product To Cart

Adds a single product to cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/add/6043a389d92f7a3e7c8a431e
```

### 3. Delete Many Products From Cart

Deletes many products from cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/deletemany
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"products": ["60439c1afcbb170158def4b0","6043a0a7a4cabf44b832d08e","6043a18b58c89753ec9fea7c"]}
```

### 4. Delete SIngle Product From Cart

Deletes a single product from cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/delete/6043a389d92f7a3e7c8a431e
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

### 5. Empty Cart

Empties cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/empty
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

### 6. Get Logged In User's Cart

Gets cart of currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/cart/mycart/get
```

## Categories

Categories related requests available to users without ADMIN role.

### 1. Get Category

Gets all products in a category.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/categories/category/find/60511f0d735f7e0e882d383b
```

### 2. Get Direct Children

Gets all direct children of a category.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/categories/category/children/60511f34735f7e0e882d3840
```

### 3. Get Path To Root Category

Gets path to root category.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/categories/category/root/604fbd70090f7d1bf84ba074
```

### 4. Get Root Categories

Gets a list of all root categories

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/categories/roots
```

## Products

Product related requests available to users without ADMIN role.

### 1. Create New Product

Creates product. Requires being logged in and role MERCHANT or ADMIN.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/products/manage/create
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON        |
|              |

**_Body:_**

```js
{"name": "Name",
"quantity": 5,
"description": "description",
"pricePerUnit": 140,
"category": "category",
"stock": "IN STOCK"
}
```

### 2. Delete Product

Deletes product. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URI}}/api/v1/products/manage/delete/60455ee8869ec6326c9784e9
```

### 3. Get Merchant By Product \_id

Gets merchant profile by product \_id.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/products/find/merchant/productid/60426e69fa85b4444c9c7f1a
```

### 4. Get Products By Merchant

Gets all product from a merchant by merchant \_id.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/products/find/merchant/products/604266c84372372068259f80
```

### 5. Get Single Product

Gets a single product by product \_id.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/products/find/product/604fbdeb090f7d1bf84ba075
```

### 6. Product Fuzzy Search

Basic regex fuzzy search on "desription" and "name" fields.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URI}}/api/v1/products/find/search
```

**_Query params:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| term | aaaaa |             |

### 7. Update Product

Updates product. Requires being logged in, role ADMIN or MERCHANT and being the product's owner. You can NOT update photos or categories with this.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/products/manage/edit/604d2f5ff85cd80ca492d0cd
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Name",
"quantity": 0,
"description": "description",
"pricePerUnit": 20,
"stock": "OUT OF STOCK"
}
```

### 8. Update Product Category

Updates product category. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/products/manage/edit/category/604ce48ebd4d02272413cf40
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"category": "category"
}
```

### 9. Upload Product Photos

Uploads product's photos. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: {{URI}}/api/v1/products/manage/photo/604b5f6aa8b25715f45ad40a
```

**_Body:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| file |       | Image file  |

## User

User related requests available to users without ADMIN role. Some requests require being logged in.

### 1. Forgot Password

Generates user's password reset token and sends e-mail.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/user/forgotpassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{ "email": "email@domain.com"}
```

### 2. Get Logged In User

Gets profile of currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/user/profile
```

### 3. Get Logged In User Created Products

Gets all products created by logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/user/profile/products
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

### 4. Get Single User

Gets user's profile by user id.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/user/user/60402299aa2f0c1584af8164a
```

### 5. Login User

Logins user and creates a cookie with JWT token.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/user/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"email": "admin@admin.com",
"password": "123456aB@a"
}
```

### 6. Logout User

Logs out currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/user/logout
```

### 7. Register User

Registers user with encrypted password and sends a verification email.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URI}}/api/v1/user/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Name",
"email": "email@domain.com",
"password": "123456aB@a",
"role": "USER"
}
```

### 8. Resend Verify Email

Resends verify email token to email of currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URI}}/api/v1/user/profile/resendverifyemail
```

### 9. Reset Password

Resets user's password using password reset token sent in email.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{ResetPassword}}c5fa1f75968fbfd1a330bc41ec99e7c653779cf2
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{
	"password": "123456aB@a"
}
```

### 10. Update Logged In User Details

Updates logged in user's details.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/user/profile/changedetails
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "",
"email": "",
"role": "MERCHANT"
}
```

### 11. Update Logged In User Password

Updates logged in user's password.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URI}}/api/v1/user/profile/updatepassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"currentPassword": "123456aB@",
"newPassword": "123456aB@a"}
```

### 12. Upload Logged In User Photo

Updates logged in user's photo.

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: {{URI}}/api/v1/user/profile/photo
```

**_Body:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| file |       | Image file  |

### 13. Verify Email

Verifies user's email using email verification token sent in email.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{VerifyEmail}}7107bc166a7637e78c958405d32d4c25e6e83f06
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

---

[Back to top](#Shop-API)

> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2021-03-17 02:24:05 by [docgen](https://github.com/thedevsaddam/docgen)
