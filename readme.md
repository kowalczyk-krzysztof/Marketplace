# Marketplace API

My first API. Trying out many different things to make sure I understand Express and mongoose properly.

## Indices

- [ADMIN](#admin)

  - [Delete User](#1-delete-user)
  - [Get All Users](#2-get-all-users)
  - [Get Single User](#3-get-single-user)
  - [Get User's Cart](#4-get-user's-cart)
  - [Update User](#5-update-user)

- [Cart](#cart)

  - [Add Many Products To Cart](#1-add-many-products-to-cart)
  - [Add Single Product To Cart](#2-add-single-product-to-cart)
  - [Delete Many Products From Cart](#3-delete-many-products-from-cart)
  - [Delete SIngle Product From Cart](#4-delete-single-product-from-cart)
  - [Empty Cart](#5-empty-cart)
  - [Get Logged In User's Cart](#6-get-logged-in-user's-cart)

- [Products](#products)

  - [Create New Product](#1-create-new-product)
  - [Delete Product](#2-delete-product)
  - [Get All Products](#3-get-all-products)
  - [Get Merchant By Product ID](#4-get-merchant-by-product-id)
  - [Get Products By Merchant](#5-get-products-by-merchant)
  - [Get Single Product](#6-get-single-product)
  - [Update Product](#7-update-product)
  - [Upload Product Photos](#8-upload-product-photos)

- [User](#user)

  - [Forgot Password](#1-forgot-password)
  - [Get Logged In User](#2-get-logged-in-user)
  - [Get Logged In User Created Products](#3-get-logged-in-user-created-products)
  - [Login User](#4-login-user)
  - [Logout User](#5-logout-user)
  - [Register User](#6-register-user)
  - [Resend Verify Email](#7-resend-verify-email)
  - [Reset Password](#8-reset-password)
  - [Update Logged In User Details](#9-update-logged-in-user-details)
  - [Update Logged In User Password](#10-update-logged-in-user-password)
  - [Upload Logged In User Photo](#11-upload-logged-in--user-photo)
  - [Verify Email](#12-verify-email)

---

## ADMIN

### 1. Delete User

Deletes user by user id. Requires being logged in and a role of ADMIN.

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: http://localhost:3000/api/v1/admin/users/user/604022eb69114234787e27e3
```

### 2. Get All Users

Gets a list of all users. Requires being logged in and a role of ADMIN.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/admin/users/all
```

### 3. Get Single User

Gets user's profile by user id. Requires being logged in and a role of ADMIN.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/admin/users/user/60402299aa2f0c1584af8164
```

### 4. Get User's Cart

Gets user's cart by user id. Requires being logged in and a role of ADMIN.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/admin/users/cart/60429af6c09f585534046c18
```

### 5. Update User

Updates user by user id. Requires being logged in and a role of ADMIN.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/admin/users/user/60429af6c09f585534046c18
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Name",
"email": "newemail@admin.com",
"role": "USER"
}
```

## Cart

### 1. Add Many Products To Cart

Adds many products to cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/cart/mycart/addmany
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"products": ["60429a73c09f585534046c16", "60429aa5c09f585534046c17"]}
```

### 2. Add Single Product To Cart

Adds a single product to cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/cart/mycart/add/60429a73c09f585534046c16
```

### 3. Delete Many Products From Cart

Deletes many products from cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/cart/mycart/deletemany
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"products": ["60429a73c09f585534046c16", "60429aa5c09f585534046c17"]}
```

### 4. Delete SIngle Product From Cart

Deletes a single product from cart of currently logged in user.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/cart/mycart/delete/603ed92cb391492ad40c1a59
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
URL: http://localhost:3000/api/v1/cart/mycart/empty
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
URL: http://localhost:3000/api/v1/cart/mycart/get
```

## Products

### 1. Create New Product

Creates product. Requires being logged in and role MERCHANT or ADMIN.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/api/v1/products/manage/create
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON        |
|  |

**_Body:_**

```js
{"name": "Product_Name",
"quantity": 0,
"description": "Description",
"pricePerUnit": 1
}
```

### 2. Delete Product

Deletes product. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: http://localhost:3000/api/v1/products/manage/delete/60429989c09f585534046c15
```

### 3. Get All Products

Gets a list of all existing products.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: http://localhost:3000/api/v1/products/find/allproducts
```

### 4. Get Merchant By Product ID

Gets merchant profile by product id.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: http://localhost:3000/api/v1/products/find/merchant/productid/60429989c09f585534046c15
```

### 5. Get Products By Merchant

Gets all product from a merchant by merchant id.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/products/find/merchant/products/603da016724a7c07100a9a4e
```

### 6. Get Single Product

Gets a single product by product id.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: http://localhost:3000/api/v1/products/find/product/60429989c09f585534046c15
```

### 7. Update Product

Updates product. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/products/manage/edit/60429989c09f585534046c15
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
"stock": "NO INFO"
}
```

### 8. Upload Product Photos

Uploads product's photos. Requires being logged in, role ADMIN or MERCHANT and being the product's owner.

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: http://localhost:3000/api/v1/products/manage/photo/60429989c09f585534046c15
```

**_Body:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| file |       |             |

## User

Routers for user authentication.

### 1. Forgot Password

Generates user's password reset token and sends e-mail.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/user/forgotpassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{ "email": "user@merchant.com"}
```

### 2. Get Logged In User

Gets profile of currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/user/profile
```

### 3. Get Logged In User Created Products

Gets all products created by logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/user/profile/products
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

### 4. Login User

Logins user and creates a cookie with JWT token.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/api/v1/user/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"email": "user@merchant.com",
"password": "123456aB@"}
```

### 5. Logout User

Logs out currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/user/logout
```

### 6. Register User

Registers user with encrypted password and sends a verification email.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/api/v1/user/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Username",
"email": "username@domain.com",
"password": "123456aB@"
}
```

### 7. Resend Verify Email

Resends verify email token to email of currently logged in user.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: http://localhost:3000/api/v1/user/profile/resendverifyemail
```

### 8. Reset Password

Resets user's password using password reset token sent in email.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/user/resetpassword/e98ee6d35111694ebf63b0b3f425c98752929e76
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{
	"password": "123456@aB"
}
```

### 9. Update Logged In User Details

Updates logged in user's details.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/user/profile/changedetails
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"name": "Name",
"email": "admin@admin.com",
"role": "MERCHANT"
}
```

### 10. Update Logged In User Password

Updates logged in user's password.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/user/profile/updatepassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

**_Body:_**

```js
{"currentPassword": "123456aB@ab",
"newPassword": "123456aB@abc"}
```

### 11. Upload Logged In User Photo

Updates logged in user's photo.

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: http://localhost:3000/api/v1/user/profile/photo
```

**_Body:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| file |       |             |

### 12. Verify Email

Verifies user's email using email verification token sent in email.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: http://localhost:3000/api/v1/user/verifyemail/3ccf71d84943c2f7a432a02059b528dbea545442
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | jSON Type   |

---

[Back to top](#marketplace-api)

> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2021-03-05 22:53:14 by [docgen](https://github.com/thedevsaddam/docgen)
